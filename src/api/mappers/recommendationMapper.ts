/**
 * 추천(recommendation) API 응답 → 화면 view model 변환 mapper.
 *
 * - 추천 결과(`RecommendationResult`)를 지도/리스트 카드(`PropertyCardView`)로 변환한다.
 * - 가격/면적 라벨은 property mapper를 재사용한다.
 * - 매물 제목 등 표시 필드는 추천 응답(`result.property`)에서 직접 사용한다.
 *   (값이 비어 있으면 합성하거나 "정보 없음"으로 둔다.)
 */

import type {
  CoordinateDto,
  RecommendationInfrastructureDetails,
  RecommendationResult,
  RecommendationRouteSubPathSummary,
  RecommendationTargetPlaceRoute,
  RouteSubPathType,
  TargetPlaceResponseItem,
  TransportMode,
} from "../../types";
import type {
  InfraMarkerView,
  PropertyCardView,
  RouteSubPathView,
  RouteSummaryView,
} from "../../types";
import { formatAreaLabel, formatPriceLabel } from "./propertyMapper";

export interface RecommendationCardMapperOptions {
  targetPlaceById?: ReadonlyMap<number, TargetPlaceResponseItem>;
  propertyImagesById?: ReadonlyMap<number, readonly string[]>;
}

export interface RecommendationRoutePlaceView {
  placeName: string | null;
  location: CoordinateDto | null;
}

function firstValue<T>(...values: Array<T | null | undefined>): T | null {
  for (const value of values) {
    if (value !== null && value !== undefined) return value;
  }
  return null;
}

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

export function getRecommendationRoutePlace(
  route: RecommendationTargetPlaceRoute | null,
  options: RecommendationCardMapperOptions = {}
): RecommendationRoutePlaceView | null {
  if (!route) return null;

  const joinedTargetPlace = options.targetPlaceById?.get(route.targetPlaceId);

  return {
    placeName: firstValue(route.placeName, route.name, joinedTargetPlace?.placeName),
    location: firstValue(route.location, joinedTargetPlace?.location),
  };
}

export function formatRoutePlaceDurationLabel(
  route: RecommendationTargetPlaceRoute | null,
  placeName?: string | null
): string | null {
  const durationLabel = formatRouteDurationLabel(route);
  if (!durationLabel) return null;
  return placeName ? `${placeName}까지 ${durationLabel}` : durationLabel;
}

/** 인프라 도보 시간 라벨 (예: "도보 5분"). */
export function formatWalkingLabel(minutes: number | null): string | null {
  return minutes != null ? `도보 ${minutes}분` : null;
}

/** 경로 구간 유형 라벨 (예: "지하철", "버스", "도보"). */
export function formatSubPathTypeLabel(type: RouteSubPathType): string {
  switch (type) {
    case "SUBWAY":
      return "지하철";
    case "BUS":
      return "버스";
    case "WALK":
      return "도보";
    default:
      return "이동";
  }
}

/** 미터 → 거리 라벨 (예: 320 → "320m", 1570 → "1.6km"). */
export function formatDistanceLabel(meters: number | null): string | null {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/** 추천 인프라 → 인프라 마커/리스트 view model. */
export function mapInfrastructureToMarkerView(
  infra: RecommendationInfrastructureDetails
): InfraMarkerView {
  return {
    infrastructureId: infra.infrastructureId,
    name: infra.name ?? "이름 미상",
    category: infra.category ?? "ETC",
    lat: infra.location?.latitude ?? null,
    lng: infra.location?.longitude ?? null,
    walkingLabel: formatWalkingLabel(infra.walkingMinutes),
  };
}

/** 요약 경로 구간 → view model. */
export function mapRouteSubPathToView(
  subPath: RecommendationRouteSubPathSummary
): RouteSubPathView {
  return {
    type: subPath.type,
    durationLabel: `${formatSubPathTypeLabel(subPath.type)} ${subPath.time}분`,
    startName: subPath.startName,
    endName: subPath.endName,
    lane: subPath.lane,
    distanceLabel: formatDistanceLabel(subPath.distance),
  };
}

/** 첫 목적지 요약 경로 → 결과 카드/지도용 요약 view model. */
export function mapRouteSummaryToView(
  route: RecommendationTargetPlaceRoute | null
): RouteSummaryView | null {
  if (!route) return null;
  return {
    transportMode: route.transportMode,
    durationLabel: `${route.durationMinutes}분`,
    transferCount: route.transferCount,
    subPaths: route.subPaths.map(mapRouteSubPathToView),
  };
}

/** 추천 결과 → 지도/리스트 카드 view model. */
export function mapRecommendationToCardView(
  result: RecommendationResult,
  options: RecommendationCardMapperOptions = {}
): PropertyCardView {
  const property = result.property;
  const routePlace = getRecommendationRoutePlace(
    result.firstTargetPlaceRoute,
    options
  );

  const title =
    firstValue(property.title, `추천 매물 #${result.propertyId}`) ??
    `추천 매물 #${result.propertyId}`;
  const address = property.address ?? "";
  const areaM2 = property.areaM2 ?? null;
  const imageUrl = firstValue(
    property.imageUrl,
    property.imageUrls?.[0],
    options.propertyImagesById?.get(result.propertyId)?.[0]
  );
  const has3DModel = property.has3DModel ?? null;

  return {
    propertyId: result.propertyId,
    title,
    address,
    tradeType: property.tradeType,
    priceLabel: formatPriceLabel(
      property.tradeType,
      property.depositAmount,
      property.monthlyRent
    ),
    areaLabel: formatAreaLabel(areaM2),
    description: property.description,
    imageUrl,
    lat: property.location?.latitude ?? null,
    lng: property.location?.longitude ?? null,
    tags: property.tags ?? [],
    has3DModel: has3DModel ?? false,
    favorite: result.favorite,
    recommendationId: result.recommendationId,
    explanation: result.explanation,
    routeDurationLabel: formatRouteDurationLabel(result.firstTargetPlaceRoute),
    routePlaceName: routePlace?.placeName ?? null,
    routePlaceLat: routePlace?.location?.latitude ?? null,
    routePlaceLng: routePlace?.location?.longitude ?? null,
  };
}
