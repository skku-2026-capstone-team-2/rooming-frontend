/**
 * 매물(property) 도메인 React Query 훅.
 *
 * - queryFn은 기존 도메인 API(`propertyApi`)를 그대로 호출하므로
 *   mock ↔ real 전환(`USE_MOCK`)과 mapper 계층이 변경 없이 재사용된다.
 * - 화면은 `useState`/`useEffect` 패칭 대신 이 훅들의 상태(data/isLoading/error)를 사용한다.
 */

import { useMemo } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyApi } from "../../api";
import {
  mapProperty3DToView,
  mapPropertyToCardView,
} from "../../api/mappers/propertyMapper";
import type { PropertyCardView, Property3DView, PropertyImagesData } from "../../types";

/** 매물 queryKey 컨벤션. */
export const propertyKeys = {
  /** 전체 매물 목록 */
  list: ["properties"] as const,
  /** 매물 상세 */
  detail: (id: number) => ["property", id] as const,
  /** 매물 상세 이미지 */
  images: (id: number) => ["property", id, "images"] as const,
  /** 매물 3D 모델 */
  threeD: (id: number) => ["property", id, "3d"] as const,
};

/** 지도 전체(추천) 매물 목록. 원시 응답을 캐시하고 `select`로 카드 view model 변환. */
export function usePropertyList(enabled = true) {
  return useQuery({
    queryKey: propertyKeys.list,
    queryFn: () => propertyApi.getProperties(),
    enabled,
  });
}

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

function getUniquePropertyIds(propertyIds: number[]): number[] {
  return Array.from(new Set(propertyIds.filter(Number.isFinite)));
}

function mapImageUrls(data: PropertyImagesData | undefined): string[] {
  return [...(data?.images ?? [])]
    .sort((a, b) => a.imageOrder - b.imageOrder)
    .map((image) => image.imageUrl);
}

/** 여러 추천 매물의 대표 이미지를 보강하기 위한 이미지 조회. 실패한 매물은 빈 이미지로 둔다. */
export function usePropertyImagesByIds(propertyIds: number[], enabled = true) {
  const uniquePropertyIds = useMemo(
    () => getUniquePropertyIds(propertyIds),
    [propertyIds]
  );

  return useQueries({
    queries: uniquePropertyIds.map((id) => ({
      queryKey: propertyKeys.images(id),
      queryFn: () => propertyApi.getPropertyImages(id),
      enabled: enabled && uniquePropertyIds.length > 0,
      retry: false,
      staleTime: Infinity,
    })),
    combine: (results) => {
      const imageUrlsByPropertyId = new Map<number, string[]>();

      results.forEach((result, index) => {
        const propertyId = uniquePropertyIds[index];
        if (propertyId == null || !result.data) return;
        imageUrlsByPropertyId.set(propertyId, mapImageUrls(result.data));
      });

      return {
        imageUrlsByPropertyId,
        isPending: results.some((result) => result.isPending),
        isFetching: results.some((result) => result.isFetching),
        isError: results.some((result) => result.isError),
      };
    },
  });
}

/**
 * 매물 3D 모델. 원시 응답을 캐시하고 `select`로 3D 보기 view model로 변환한다.
 * `id`가 유효할 때만 실행한다.
 */
export function useProperty3D(id: number, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.threeD(id),
    queryFn: () => propertyApi.getProperty3D(id),
    enabled,
    select: (data): Property3DView => mapProperty3DToView(data),
  });
}

/**
 * 매물 이미지 업로드. 성공 시 해당 매물의 이미지 캐시를 무효화한다.
 * (중개사 매물 등록 흐름에서 사용)
 */
export function useUploadPropertyImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, files }: { propertyId: number; files: File[] }) =>
      propertyApi.uploadPropertyImages(propertyId, files),
    onSuccess: (_data, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.images(propertyId) });
    },
  });
}
