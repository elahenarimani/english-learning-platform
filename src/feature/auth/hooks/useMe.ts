
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { getMe, SessionExpiredError, User } from "../api/auth.api";
import { expireClientSession, getClientSession, getServerSessionSnapshot, subscribeClientSession } from "../utils/clientSession";
import { getLoginRedirect } from "../utils/loginRedirect";

export const useMe = () => {
  const session = useSyncExternalStore(subscribeClientSession, getClientSession, getServerSessionSnapshot);
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  const query = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: session.phase === "active",
    staleTime: 1000 * 60 * 15, // ۱۵ دقیقه معتبر بودن اطلاعات در حافظه
    retry: (failureCount, error) => !(error instanceof SessionExpiredError) && failureCount < 1,
  });
  const expired = query.error instanceof SessionExpiredError && query.error.generation === session.generation;
  useEffect(() => {
    if (!(query.error instanceof SessionExpiredError)) return;
    if (!expireClientSession(query.error.generation)) return;
    const destination = window.location.pathname + window.location.search;
    const callbackUrl = query.data
      ? getLoginRedirect(destination, locale, query.data.is_teacher)
      : null;
    queryClient.clear();
    router.replace(callbackUrl ? `/login?${new URLSearchParams({ callbackUrl })}` : "/login");
  }, [query.error, query.data, queryClient, router, locale]);
  // Header receives no stale identity while termination or login is in progress.
  return { ...query, data: expired || session.phase !== "active" ? undefined : query.data };
};
