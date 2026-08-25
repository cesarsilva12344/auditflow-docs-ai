import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = { redirectOnUnauthenticated?: boolean; redirectPath?: string };

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: true });
  const loginMutation = trpc.auth.login.useMutation({ onSuccess: () => meQuery.refetch() });
  const registerMutation = trpc.auth.register.useMutation({ onSuccess: () => meQuery.refetch() });
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => utils.auth.me.setData(undefined, null) });
  const logout = useCallback(async () => { try { await logoutMutation.mutateAsync(); } catch (error) { if (!(error instanceof TRPCClientError)) throw error; } finally { await utils.auth.me.invalidate(); } }, [logoutMutation, utils]);
  const state = useMemo(() => ({ user: meQuery.data ?? null, loading: meQuery.isLoading || logoutMutation.isPending, error: meQuery.error ?? logoutMutation.error ?? null, isAuthenticated: Boolean(meQuery.data) }), [meQuery.data, meQuery.error, meQuery.isLoading, logoutMutation.error, logoutMutation.isPending]);
  useEffect(() => { if (!redirectOnUnauthenticated || meQuery.isLoading || state.user || typeof window === "undefined") return; if (redirectPath && window.location.pathname !== redirectPath) window.location.href = redirectPath; }, [redirectOnUnauthenticated, redirectPath, meQuery.isLoading, state.user]);
  return { ...state, refresh: () => meQuery.refetch(), login: loginMutation.mutateAsync, register: registerMutation.mutateAsync, logout };
}
