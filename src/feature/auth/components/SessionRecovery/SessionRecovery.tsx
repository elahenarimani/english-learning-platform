"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import Button from "@/components/kit/Button/Button";
import Loading from "@/components/shared/Loading";
import { getLoginRedirect } from "../../utils/loginRedirect";
import { clearRecoveryAttempt, recoverSession, type RecoveryResult } from "../../utils/sessionRecovery";

type Props = {
  needsRecovery: boolean;
  renderId: string;
  children?: ReactNode;
};

export default function SessionRecovery({ needsRecovery, renderId, children }: Props) {
  const t = useTranslations("SessionRecovery");
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState<RecoveryResult | "loading">("loading");

  useEffect(() => {
    const destination = window.location.pathname + window.location.search;
    if (!needsRecovery) {
      // Pages render this branch only after the server confirms the student session.
      clearRecoveryAttempt(destination);
      return;
    }
    let active = true;
    recoverSession(destination).then((result) => {
      if (!active) return;
      setState(result);
      if (result === "renewed") router.refresh();
      if (result === "expired") {
        queryClient.clear();
        // These consumers are student pages; this validates a return URL, not a user role.
        const callbackUrl = getLoginRedirect(destination, locale, false);
        router.replace(`/login?${new URLSearchParams({ callbackUrl })}`);
      }
    });
    return () => { active = false; };
  }, [needsRecovery, renderId, locale, router, queryClient]);

  const retry = async () => {
    setState("loading");
    const destination = window.location.pathname + window.location.search;
    const result = await recoverSession(destination, true);
    // Do not navigate a different page if the user moved while the request was pending.
    if (destination !== window.location.pathname + window.location.search) return;
    setState(result);
    if (result === "renewed") router.refresh();
    if (result === "expired") {
      queryClient.clear();
      const callbackUrl = getLoginRedirect(destination, locale, false);
      router.replace(`/login?${new URLSearchParams({ callbackUrl })}`);
    }
  };

  if (!needsRecovery) return children;
  if (state === "loading" || state === "renewed" || state === "expired") {
    return <Loading message={t("loading")} />;
  }
  return (
    <section role="alert" style={{ padding: "24px", color: "var(--color-foreground)", background: "var(--color-surface)", textAlign: "center" }}>
      <p>{t(state === "blocked" ? "stopped" : "temporary")}</p>
      <Button type="button" onClick={retry}>{t("retry")}</Button>
    </section>
  );
}
