/**
 * 전역 QueryClient 설정.
 *
 * - 서버 상태(매물 등) 캐싱/refetch 기본 정책을 한곳에서 관리한다.
 * - 4xx(클라이언트 오류, 예: 404)는 재시도해도 결과가 같으므로 retry하지 않는다.
 */

import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./http";

/** 4xx 응답이면 재시도하지 않고, 그 외에는 최대 2회까지 재시도. */
export function retryExceptClientError(
  failureCount: number,
  error: unknown
): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1분 동안은 fresh로 간주 → 목록 ↔ 상세 이동 시 중복 요청 방지.
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: retryExceptClientError,
      refetchOnWindowFocus: false,
    },
  },
});
