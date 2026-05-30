/**
 * 추천/찜 API.
 *
 * endpoints:
 *   POST   /api/v1/recommendations
 *   GET    /api/v1/recommendations
 *   GET    /api/v1/recommendations/favorites
 *   DELETE /api/v1/recommendations/{recommendationId}
 *   GET    /api/v1/recommendations/{recommendationId}/route
 *   POST   /api/v1/recommendations/{recommendationId}/favorite
 *   DELETE /api/v1/recommendations/{recommendationId}/favorite
 */

import type {
  RecommendationRequest,
  RecommendationData,
  RecommendationListData,
  FavoriteRecommendationData,
  RecommendationRouteDetailData,
  RecommendationResult,
  RouteGeometryDetail,
} from "../types";
import { USE_MOCK } from "./config";
import { request } from "./http";
import { recommendationMock } from "./mock/recommendationMock";

export const recommendationApi = {
  postRecommendation(body: RecommendationRequest): Promise<RecommendationData> {
    if (USE_MOCK) return recommendationMock.postRecommendation(body);
    return request<RecommendationData>("/api/v1/recommendations", { method: "POST", body });
  },

  getRecommendations(): Promise<RecommendationListData> {
    if (USE_MOCK) return recommendationMock.getRecommendations();
    return request<RecommendationListData>("/api/v1/recommendations");
  },

  getFavorites(): Promise<FavoriteRecommendationData> {
    if (USE_MOCK) return recommendationMock.getFavorites();
    return request<FavoriteRecommendationData>("/api/v1/recommendations/favorites");
  },

  deleteRecommendation(recommendationId: number): Promise<null> {
    if (USE_MOCK) return recommendationMock.deleteRecommendation(recommendationId);
    return request<null>(`/api/v1/recommendations/${recommendationId}`, { method: "DELETE" });
  },

  getRoute(
    recommendationId: number,
    detail: RouteGeometryDetail = "SUMMARY"
  ): Promise<RecommendationRouteDetailData> {
    if (USE_MOCK) return recommendationMock.getRoute(recommendationId, detail);
    return request<RecommendationRouteDetailData>(
      `/api/v1/recommendations/${recommendationId}/route`,
      { query: { detail } }
    );
  },

  addFavorite(recommendationId: number): Promise<RecommendationResult> {
    if (USE_MOCK) return recommendationMock.addFavorite(recommendationId);
    return request<RecommendationResult>(
      `/api/v1/recommendations/${recommendationId}/favorite`,
      { method: "POST" }
    );
  },

  removeFavorite(recommendationId: number): Promise<null> {
    if (USE_MOCK) return recommendationMock.removeFavorite(recommendationId);
    return request<null>(
      `/api/v1/recommendations/${recommendationId}/favorite`,
      { method: "DELETE" }
    );
  },
};
