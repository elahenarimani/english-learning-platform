// Run: node --conditions=react-server --test tests/student-session.test.mjs
// Executes the production loaders/pages with simulated HTTP, cookies and rendering.
import assert from "node:assert/strict";
import { test } from "node:test";
import { AsyncLocalStorage } from "node:async_hooks";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import React from "react";

const requireDependency = createRequire(import.meta.url);

const request = new AsyncLocalStorage();
// Use React's real cache with a simulated per-render cache dispatcher.
React.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.A = {
  getOwner: () => null,
  getCacheForType(factory) {
    const { cache } = request.getStore();
    if (!cache.has(factory)) cache.set(factory, factory());
    return cache.get(factory);
  },
};
const root = fileURLToPath(new URL("../src", import.meta.url));
const modules = new Map();
const recoveryComponent = "SessionRecovery";

function load(filename) {
  if (!existsSync(filename) && filename.endsWith(".ts")) filename += "x";
  filename = path.resolve(filename);
  if (modules.has(filename)) return modules.get(filename).exports;
  const loadedModule = { exports: {} };
  modules.set(filename, loadedModule);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const mockedRequire = (name) => {
    if (name === "server-only") return {};
    if (name === "next/headers") return {
      cookies: async () => ({ get: () => {
        const access = request.getStore().access;
        return access ? { value: access } : undefined;
      } }),
    };
    if (name === "next-intl/server") return { getLocale: async () => request.getStore().locale };
    if (name === "@/i18n/routing") return {
      redirect: (destination) => {
        const error = new Error("NEXT_REDIRECT");
        error.destination = destination;
        request.getStore().redirect = error;
        throw error;
      },
    };
    if (name === "next/navigation") return { notFound: () => { throw new Error("NEXT_NOT_FOUND"); } };
    if (name.includes("/components/SessionRecovery/")) return { default: recoveryComponent, __esModule: true };
    if (name.includes("/components/")) return { default: "View", __esModule: true };
    if (name.startsWith("@/")) return load(path.join(root, name.slice(2)) + ".ts");
    if (name.startsWith(".")) return load(path.resolve(path.dirname(filename), name) + ".ts");
    return requireDependency(name);
  };
  vm.runInNewContext(source, {
    module: loadedModule, exports: loadedModule.exports, require: mockedRequire,
    process: { env: { API_URL: "https://backend.test/api/" } },
    crypto: globalThis.crypto,
    fetch: async (url, options) => {
      const state = request.getStore();
      const endpoint = new URL(url).pathname;
      state.calls.push(endpoint);
      assert.equal(options.cache, "no-store");
      assert.equal(options.headers.Authorization, `Bearer ${state.access}`);
      if (endpoint === "/api/me/") {
        if (state.networkError) throw new Error("Network unavailable");
        if (state.invalidJson) return new Response("invalid", { status: 200 });
        return Response.json(state.me, { status: state.status });
      }
      assert.ok(["/api/enrollments/my/", "/api/tutors/"].includes(endpoint));
      return Response.json(state.data, { status: state.dataStatus });
    },
  }, { filename });
  return loadedModule.exports;
}

const loaders = load(path.join(root, "feature/dashboard/api/dashboard.server.ts"));
const errors = load(path.join(root, "lib/server/backendErrors.ts"));
const studentRoot = path.join(root, "app/[locale]/dashboard/student");
const pageFiles = readdirSync(studentRoot, { recursive: true })
  .filter((file) => path.basename(file) === "page.tsx");
const pages = pageFiles.map((file) => load(path.join(studentRoot, file)).default);
const dataPages = ["page.tsx", "student-dashboard/page.tsx", "tutors/page.tsx"]
  .map((file) => load(path.join(studentRoot, file)).default);
function scenario(overrides, run) {
  const state = {
    access: "test-access", locale: "fa", me: { id: 1, is_teacher: false },
    status: 200, data: [{ id: 10 }], dataStatus: 200, calls: [], cache: new Map(),
    ...overrides,
  };
  return request.run(state, () => run(state));
}

test("valid student: me precedes data, pages render without recovery", async () => {
  await scenario({}, async (state) => {
    assert.deepEqual(await loaders.getEnrollmentsServer(), state.data);
    assert.deepEqual(state.calls, ["/api/me/", "/api/enrollments/my/"]);
  });
  for (const page of pages) await scenario({}, async () => {
    const result = await page();
    assert.equal(result.type, recoveryComponent);
    assert.equal(result.props.needsRecovery, false);
  });
});

test("teacher: no student data request; localized redirect survives every page catch", async () => {
  for (const locale of ["fa", "en"]) {
    for (const call of [loaders.getEnrollmentsServer, loaders.getTutorsServer, ...pages]) {
      await scenario({ locale, me: { id: 2, is_teacher: true } }, async (state) => {
        await assert.rejects(call, (error) => error === state.redirect);
        assert.equal(state.redirect.destination.href, "/dashboard/teacher");
        assert.equal(state.redirect.destination.locale, locale);
        assert.deepEqual(state.calls, ["/api/me/"]);
      });
    }
  }
});

for (const [name, overrides, expectedCalls] of [
  ["missing access", { access: undefined }, []],
  ["me 401", { status: 401 }, ["/api/me/"]],
  ["data 401", { dataStatus: 401 }, ["/api/me/", "/api/enrollments/my/"]],
]) test(`${name}: existing session recovery is used`, async () => {
  await scenario(overrides, async (state) => {
    await assert.rejects(loaders.getEnrollmentsServer, errors.SessionRecoveryRequired);
    assert.deepEqual(state.calls, expectedCalls);
  });
  for (const page of (name === "data 401" ? dataPages : pages)) await scenario(overrides, async () => {
    const result = await page();
    assert.equal(result.type, recoveryComponent);
    assert.equal(result.props.needsRecovery, true);
  });
});

for (const [name, overrides, kind] of [
  ["network", { networkError: true }, "network"],
  ["503", { status: 503 }, "server"],
  ["403", { status: 403 }, "permission"],
  ["invalid JSON", { invalidJson: true }, "response"],
  ...[null, [], {}, { id: 1 }, { id: 1, is_teacher: "false" },
    { id: 1, is_teacher: 0 }, { id: 0, is_teacher: false },
    { id: "1", is_teacher: false }].map((me, index) => [`invalid identity ${index}`, { me }, "response"]),
]) test(`${name}: no data, redirect, logout or refresh; pages propagate API error`, async () => {
  for (const call of [loaders.getEnrollmentsServer, loaders.getTutorsServer, ...pages]) {
    await scenario(overrides, async (state) => {
      await assert.rejects(call, (error) => error instanceof errors.BackendRequestError && error.kind === kind);
      assert.equal(state.redirect, undefined);
      assert.deepEqual(state.calls, ["/api/me/"]);
    });
  }
});

test("me is deduplicated within a render, never shared between requests", async () => {
  await scenario({}, async (state) => {
    await Promise.all([loaders.getEnrollmentsServer(), loaders.getTutorsServer()]);
    assert.equal(state.calls.filter((url) => url === "/api/me/").length, 1);
  });
  await scenario({ access: "teacher-access", me: { id: 2, is_teacher: true } }, async (state) => {
    await assert.rejects(loaders.getEnrollmentsServer, (error) => error === state.redirect);
    assert.deepEqual(state.calls, ["/api/me/"]);
  });
});

test("all nine pages recheck me on successive server navigations without rerunning layout", async () => {
  assert.equal(pages.length, 9);
  for (const page of pages) {
    await scenario({}, async (state) => {
      const result = await page();
      assert.equal(result.props.needsRecovery, false);
      assert.equal(state.calls[0], "/api/me/");
    });
    await scenario({ me: { id: 2, is_teacher: true } }, async (state) => {
      await assert.rejects(page, (error) => error === state.redirect);
      assert.deepEqual(state.calls, ["/api/me/"]);
    });
    await scenario({ status: 401 }, async (state) => {
      const result = await page();
      assert.equal(result.props.needsRecovery, true);
      assert.equal(result.props.children, undefined);
      assert.deepEqual(state.calls, ["/api/me/"]);
    });
  }
});

test("unfinished tutor detail remains empty after successful verification", async () => {
  await scenario({}, async () => {
    const page = load(path.join(studentRoot, "tutors/[tutorId]/page.tsx")).default;
    assert.equal((await page()).props.children, null);
  });
});
