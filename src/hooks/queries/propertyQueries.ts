/**
 * 매물(property) 도메인 React Query 훅.
 *
 * - queryFn은 기존 도메인 API(`propertyApi`)를 그대로 호출하므로
 *   mock ↔ real 전환(`USE_MOCK`)과 mapper 계층이 변경 없이 재사용된다.
 * - 화면은 `useState`/`useEffect` 패칭 대신 이 훅들의 상태(data/isLoading/error)를 사용한다.
 */

import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "../../api";
import { mapPropertyToCardView } from "../../api/mappers/propertyMapper";
import type { PropertyCardView } from "../../types";

/** 매물 queryKey 컨벤션. */
export const propertyKeys = {
  /** 전체 매물 목록 */
  list: ["properties"] as const,
  /** 매물 상세 */
  detail: (id: number) => ["property", id] as const,
  /** 매물 상세 이미지 */
  images: (id: number) => ["property", id, "images"] as const,
};

/** 지도 전체(추천) 매물 목록. 원시 응답을 캐시하고 `select`로 카드 view model 변환. */
export function useProperties() {
  return useQuery({
    queryKey: propertyKeys.list,
    queryFn: () => propertyApi.getProperties(),
    select: (data): PropertyCardView[] => data.map(mapPropertyToCardView),
  });
}

/** 매물 상세. `id`가 유효할 때만 실행한다. */
export function useProperty(id: number, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyApi.getProperty(id),
    enabled,
  });
}

/**
 * 매물 상세 이미지.
 *
 * 이미지 조회 실패는 상세 화면 전체 실패로 보지 않으므로 재시도하지 않는다.
 * (호출부에서 실패 시 빈 목록으로 처리)
 */
export function usePropertyImages(id: number, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.images(id),
    queryFn: () => propertyApi.getPropertyImages(id),
    enabled,
    retry: false,
  });
}
