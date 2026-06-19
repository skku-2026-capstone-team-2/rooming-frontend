/**
 * 추천/MY(찜) 매물 관리 로직을 화면 간 공유하는 훅.
 *
 * - 서버 저장 추천 목록(useRecommendations)과 찜 목록(useFavorites)을 단일 출처로 사용한다.
 * - 추천 결과를 카드 view model로 변환할 때 쓰는 mapper 옵션(targetPlaceById)을 함께 제공한다.
 * - 찜 토글/추천 삭제 mutation과 진행 중(pending) 식별자를 노출해
 *   마이페이지·지도 화면이 동일한 관리 로직을 재사용한다.
 */

import { useMemo } from "react";

import type { RecommendationCardMapperOptions } from "../api/mappers/recommendationMapper";
import {
  useDeleteRecommendation,
  useFavorites,
  useRecommendations,
  useToggleFavorite,
} from "./queries/recommendationQueries";
import { useTargetPlaces } from "./queries/targetPlaceQueries";

/** 찜 토글에 필요한 최소 정보. RecommendationResult/PropertyCardView 모두 충족한다. */
export type FavoriteToggleTarget = {
  recommendationId: number;
  favorite: boolean;
};

export function useRecommendationManagement() {
  const recommendationsQuery = useRecommendations();
  const favoritesQuery = useFavorites();
  const targetPlacesQuery = useTargetPlaces();
  const toggleFavoriteMutation = useToggleFavorite();
  const deleteRecommendationMutation = useDeleteRecommendation();

  const targetPlaceById = useMemo(
    () =>
      new Map(
        (targetPlacesQuery.data?.targetPlaces ?? []).map((place) => [
          place.targetPlaceId,
          place,
        ])
      ),
    [targetPlacesQuery.data]
  );
  const mapperOptions = useMemo<RecommendationCardMapperOptions>(
    () => ({ targetPlaceById }),
    [targetPlaceById]
  );

  const recommendations = recommendationsQuery.data?.results ?? [];
  const favorites = favoritesQuery.data?.results ?? [];

  const favoriteRecommendationIds = useMemo(
    () =>
      new Set(
        favorites.map((recommendation) => recommendation.recommendationId)
      ),
    [favorites]
  );

  const toggleFavorite = (target: FavoriteToggleTarget) => {
    const isFavorite =
      favoriteRecommendationIds.has(target.recommendationId) || target.favorite;

    toggleFavoriteMutation.mutate({
      recommendationId: target.recommendationId,
      favorite: !isFavorite,
    });
  };

  const deleteRecommendation = (recommendationId: number) => {
    deleteRecommendationMutation.mutate(recommendationId);
  };

  const pendingFavoriteId = toggleFavoriteMutation.isPending
    ? toggleFavoriteMutation.variables?.recommendationId ?? null
    : null;
  const pendingDeleteId = deleteRecommendationMutation.isPending
    ? deleteRecommendationMutation.variables ?? null
    : null;

  return {
    recommendations,
    favorites,
    favoriteRecommendationIds,
    mapperOptions,
    isRecommendationsLoading: recommendationsQuery.isPending,
    isFavoritesLoading: favoritesQuery.isPending,
    toggleFavorite,
    deleteRecommendation,
    pendingFavoriteId,
    pendingDeleteId,
  };
}
