/**
 * 추천(recommendation) 도메인 React Query 훅.
 *
 * - AI 검색 요청(query/preferences/topN)을 키로 추천 결과를 캐싱한다.
 * - 동일 요청은 queryKey가 같으므로 추천 결과 화면 ↔ 지도 화면이 캐시를 공유한다.
 *   → 별도 전역 상태 없이 화면 간 추천 결과 전달이 이루어진다.
 */

import { useQuery } from "@tanstack/react-query";
import { recommendationApi } from "../../api";
import type { RecommendationRequest } from "../../types";

export const recommendationKeys = {
  /** AI 검색 요청 기반 추천 결과 */
  search: (request: RecommendationRequest) =>
    ["recommendations", "search", request] as const,
};

/**
 * AI 검색 요청 기반 추천 결과.
 *
 * `POST /api/v1/recommendations`이지만, "이 요청에 대한 추천 결과"는 입력이 같으면
 * 결과도 같으므로 query로 모델링해 화면 간 캐시를 공유한다.
 * request가 없으면(검색 전) 실행하지 않는다.
 */
export function useRecommendationSearch(request: RecommendationRequest | null) {
  return useQuery({
    queryKey: request
      ? recommendationKeys.search(request)
      : ["recommendations", "search", "none"],
    queryFn: () => recommendationApi.postRecommendation(request!),
    enabled: !!request,
    // 동일 검색 요청 결과는 세션 동안 고정 (재진입 시 재요청 방지).
    staleTime: Infinity,
  });
}
