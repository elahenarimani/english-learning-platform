// Simulated browser effects; no live backend or browser is used.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

function harness(fetchResponse) {
  const storage = new Map();
  const effects = [];
  const events = [];
  const location = { pathname: "/fa/dashboard/student/profile", search: "" };
  const sessionStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => { events.push("clear-marker"); storage.delete(key); },
  };
  function evaluate(relative, dependencies) {
    const source = readFileSync(new URL(`../src/${relative}`, import.meta.url), "utf8");
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText, {
      exports, sessionStorage, window: { location }, URLSearchParams,
      fetch: async () => { events.push("refresh-request"); return fetchResponse(); },
      require: (name) => {
        assert.ok(name in dependencies, `Unexpected import: ${name}`);
        return dependencies[name];
      },
    });
    return exports;
  }
  const recovery = evaluate("feature/auth/utils/sessionRecovery.ts", {});
  const component = evaluate("feature/auth/components/SessionRecovery/SessionRecovery.tsx", {
    react: { useEffect: (effect) => effects.push(effect), useState: () => ["loading", () => {}] },
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    "next-intl": { useLocale: () => "fa", useTranslations: () => (key) => key },
    "@tanstack/react-query": { useQueryClient: () => ({ clear: () => events.push("clear-user") }) },
    "@/i18n/routing": { useRouter: () => ({
      refresh: () => events.push("router-refresh"), replace: () => events.push("redirect"),
    }) },
    "@/components/kit/Button/Button": { default: "Button" },
    "@/components/shared/Loading": { default: "Loading" },
    "../../utils/loginRedirect": { getLoginRedirect: (destination) => destination },
    "../../utils/sessionRecovery": recovery,
  }).default;
  function mount(needsRecovery) {
    component({ needsRecovery, renderId: String(events.length) });
    return effects.pop()();
  }
  return { storage, events, location, mount, recovery };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));
const marker = "session-recovery:/fa/dashboard/student/profile";

test("refresh success preserves marker until server-confirmed page arrives", async () => {
  const h = harness(() => Response.json({ ok: true }));
  h.mount(true);
  await settle();
  assert.equal(h.storage.get(marker), "attempted");
  assert.deepEqual(h.events, ["refresh-request", "router-refresh"]);
  h.mount(true); // Server still rejects session: no automatic renewal loop.
  await settle();
  assert.deepEqual(h.events, ["refresh-request", "router-refresh"]);
  h.mount(false); // Only emitted after requireStudentSession succeeds on the server.
  assert.equal(h.storage.has(marker), false);
});

for (const [name, response] of [
  ["network", () => { throw new Error("offline"); }],
  ["503", () => Response.json({}, { status: 503 })],
  ["invalid JSON", () => new Response("invalid")],
]) test(`${name}: keep marker, no logout or redirect, no automatic repeat`, async () => {
  const h = harness(response);
  h.mount(true);
  await settle();
  h.mount(true);
  await settle();
  assert.deepEqual(h.events, ["refresh-request"]);
  assert.equal(h.storage.get(marker), "attempted");
});

test("navigation cleanup ignores an old page's pending recovery result", async () => {
  let finish;
  const h = harness(() => new Promise((resolve) => { finish = resolve; }));
  const unmount = h.mount(true);
  unmount();
  h.location.pathname = "/fa/dashboard/student/payment";
  finish(Response.json({ ok: true }));
  await settle();
  assert.deepEqual(h.events, ["refresh-request"]);
  assert.equal(h.storage.get(marker), "attempted");
  h.mount(false); // New page's successful server verification clears only its marker.
  assert.equal(h.storage.get(marker), "attempted");
});
