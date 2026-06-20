/**
 * 추천(recommendation) 도메인 React Query 훅.
 *
 * - AI 검색 요청(query/preferences/topN)을 키로 추천 결과를 캐싱한다.
 * - 동일 요청은 queryKey가 같으므로 추천 결과 화면 ↔ 지도 화면이 캐시를 공유한다.
 *   → 별도 전역 상태 없이 화면 간 추천 결과 전달이 이루어진다.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recommendationApi } from "../../api";
import type {
  RecommendationData,
  RecommendationRequest,
  RouteGeometryDetail,
} from "../../types";

export const recommendationKeys = {
  /** AI 검색 요청 기반 추천 결과 */
  search: (request: RecommendationRequest) =>
    ["recommendations", "search", request] as const,
  /** 추천 경로 geometry (detail 단계별) */
  route: (recommendationId: number, detail: RouteGeometryDetail) =>
    ["recommendations", recommendationId, "route", detail] as const,
  /** 서버에 저장된 추천 목록 */
  list: ["recommendations", "list"] as const,
  /** 찜(MY) 추천 목록 */
  favorites: ["recommendations", "favorites"] as const,
};

/**
 * AI 검색 요청 기반 추천 결과.
 *
 * `POST /api/v1/recommendations`이지만, "이 요청에 대한 추천 결과"는 입력이 같으면
 * 결과도 같으므로 query로 모델링해 화면 간 캐시를 공유한다.
 * request가 없으면(검색 전) 실행하지 않는다.
 */
export function useRecommendationSearch(request: RecommendationRequest | null) {
  const normalizedRequest =
    request && request.query.trim()
      ? { ...request, query: request.query.trim() }
      : null;

  return useQuery({
    queryKey: normalizedRequest
      ? recommendationKeys.search(normalizedRequest)
      : ["recommendations", "search", "none"],
    queryFn: () => recommendationApi.postRecommendation(normalizedRequest!),
    enabled: normalizedRequest != null,
    // 동일 검색 요청 결과는 세션 동안 고정 (재진입 시 재요청 방지).
    staleTime: Infinity,
  });
}

/**
 * 추천 경로 geometry.
 *
 * 카드/리스트는 추천 응답의 요약 경로(`firstTargetPlaceRoute`)만으로 충분하고,
 * 지도에 실제 경로 선을 그릴 때만 이 endpoint(`GET /recommendations/{id}/route`)를
 * 호출한다. `recommendationId`가 유효할 때만 실행한다.
 */
export function useRecommendationRoute(
  recommendationId: number | null,
  detail: RouteGeometryDetail = "SUMMARY",
  enabled = true
) {
  return useQuery({
    queryKey: recommendationKeys.route(recommendationId ?? -1, detail),
    queryFn: () => recommendationApi.getRoute(recommendationId!, detail),
    enabled: enabled && recommendationId != null,
    staleTime: Infinity,
    // 경로 표시는 보조 정보이므로 실패해도 화면 전체를 막지 않는다.
    retry: false,
  });
}

/** 서버에 저장된 추천 목록. direct 상세 진입에서도 propertyId로 추천 컨텍스트를 복원한다. */
export function useRecommendations(enabled = true) {
  return useQuery({
    queryKey: recommendationKeys.list,
    queryFn: () => recommendationApi.getRecommendations(),
    enabled,
  });
}

/**
 * 찜(MY) 추천 목록.
 *
 * `GET /api/v1/recommendations/favorites`를 단일 출처로 사용한다.
 * 원시 응답을 캐시하고 `select`로 카드 view model로 변환한다.
 */
export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: recommendationKeys.favorites,
    queryFn: () => recommendationApi.getFavorites(),
    enabled,
  });
}

/**
 * 검색 결과 캐시(`["recommendations","search", ...]`)를 재요청 없이 직접 패치한다.
 *
 * 검색 쿼리는 AI 추천(POST)을 query로 모델링한 것이라 invalidate하면 화면에 활성
 * 옵저버가 있는 동안 즉시 refetch → 추천 검색이 통째로 재실행된다. favorite/삭제는
 * 결과 집합의 부분 변경일 뿐이므로 캐시를 직접 갱신해 불필요한 재검색을 막는다.
 */
function patchSearchCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (results: RecommendationData["results"]) => RecommendationData["results"]
) {
  queryClient.setQueriesData<RecommendationData>(
    { queryKey: ["recommendations", "search"] },
    (data) => (data ? { ...data, results: updater(data.results) } : data)
  );
}

/**
 * 찜 토글 mutation.
 *
 * 성공 시 favorites/list 목록은 무효화해 재동기화하되, 검색 결과 캐시는 invalidate 대신
 * favorite 플래그만 직접 패치한다(재검색 방지).
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recommendationId,
      favorite,
    }: {
      recommendationId: number;
      favorite: boolean;
    }) =>
      favorite
        ? recommendationApi.addFavorite(recommendationId)
        : recommendationApi.removeFavorite(recommendationId),
    onSuccess: (_data, { recommendationId, favorite }) => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.list });
      queryClient.invalidateQueries({ queryKey: recommendationKeys.favorites });
      patchSearchCaches(queryClient, (results) =>
        results.map((result) =>
          result.recommendationId === recommendationId
            ? { ...result, favorite }
            : result
        )
      );
    },
  });
}

export function useDeleteRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recommendationId: number) =>
      recommendationApi.deleteRecommendation(recommendationId),
    onSuccess: (_data, recommendationId) => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.list });
      queryClient.invalidateQueries({ queryKey: recommendationKeys.favorites });
      patchSearchCaches(queryClient, (results) =>
        results.filter((result) => result.recommendationId !== recommendationId)
      );
    },
  });
}
