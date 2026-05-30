/**
 * 추천(recommendation) API 응답 → 화면 view model 변환 mapper.
 *
 * - 추천 결과(`RecommendationResult`)를 지도/리스트 카드(`PropertyCardView`)로 변환한다.
 * - 가격/면적 라벨은 property mapper를 재사용한다.
 * - 추천 응답에는 매물 제목·주소·면적·이미지가 없으므로(스키마 한계) 해당 필드는
 *   합성하거나 "정보 없음"으로 둔다. (전체 매물 상세는 propertyApi로 별도 조회)
 */

import type {
  RecommendationResult,
  RecommendationTargetPlaceRoute,
  TransportMode,
} from "../../types";
import type { PropertyCardView } from "../../types";
import { formatAreaLabel, formatPriceLabel } from "./propertyMapper";

/** 이동 수단 라벨 (예: "도보", "대중교통"). */
export function formatTransportModeLabel(mode: TransportMode): string {
  return mode === "WALK" ? "도보" : "대중교통";
}

/** 첫 목적지 경로 요약 라벨 (예: "도보 11분"). */
export function formatRouteDurationLabel(
  route: RecommendationTargetPlaceRoute | null
): string | null {
  if (!route) return null;
  return `${formatTransportModeLabel(route.transportMode)} ${route.durationMinutes}분`;
}

/** 인프라 도보 시간 라벨 (예: "도보 5분"). */
export function formatWalkingLabel(minutes: number | null): string | null {
  return minutes != null ? `도보 ${minutes}분` : null;
}

/** 추천 결과 → 지도/리스트 카드 view model. */
export function mapRecommendationToCardView(
  result: RecommendationResult
): PropertyCardView {
  const property = result.property;

  return {
    propertyId: result.propertyId,
    // 추천 응답에 매물 제목이 없어 식별용으로 합성한다.
    title: `추천 매물 #${result.propertyId}`,
    address: "",
    tradeType: property.tradeType,
    priceLabel: formatPriceLabel(
      property.tradeType,
      property.depositAmount,
      property.monthlyRent
    ),
    // 면적은 추천 응답에 없음 → "면적 정보 없음".
    areaLabel: formatAreaLabel(null),
    description: property.description,
    imageUrl: null,
    lat: property.location?.latitude ?? null,
    lng: property.location?.longitude ?? null,
    tags: property.tags ?? [],
    has3DModel: false,
    favorite: result.favorite,
    recommendationId: result.recommendationId,
    explanation: result.explanation,
    routeDurationLabel: formatRouteDurationLabel(result.firstTargetPlaceRoute),
  };
}
