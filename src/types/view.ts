/**
 * 화면 렌더링용 view model 타입.
 *
 * - API 응답 타입(`./api.ts`)과 **분리**된 화면 전용 형태다.
 * - 가격/면적/거리 등 사람이 읽는 라벨 문자열, 화면이 바로 쓰는 평탄화된 구조를 담는다.
 * - API 타입 → view model 변환(mapper)은 후속 이슈(FE-02/03/04/06)에서 구현한다.
 * - enum류는 API 타입을 그대로 재사용한다.
 */

import type {
  InfrastructureCategory,
  RouteSubPathType,
  TradeType,
  TransportMode,
} from "./api";

/** 지도/리스트의 매물 카드. 추천 컨텍스트일 때 favorite/recommendationId/explanation이 채워진다. */
export interface PropertyCardView {
  propertyId: number;
  title: string;
  address: string;
  /** 거래 유형 (배지 표시용) */
  tradeType: TradeType | null;
  /** 예: "500 / 55" 또는 "전세 1억" */
  priceLabel: string;
  /** 예: "23.5m²" */
  areaLabel: string;
  description: string | null;
  imageUrl: string | null;
  lat: number | null;
  lng: number | null;
  tags: string[];
  has3DModel: boolean;

  /** --- 추천(recommendation) 컨텍스트에서만 의미 있음 --- */
  favorite?: boolean;
  recommendationId?: number;
  /** 추천 이유 (RecommendationResult.explanation) */
  explanation?: string | null;
  /** 첫 목적지까지 소요 시간 라벨, 예: "도보 11분" */
  routeDurationLabel?: string | null;
}

/** 인프라 보기 화면의 마커/리스트 아이템. */
export interface InfraMarkerView {
  infrastructureId: number;
  name: string;
  category: InfrastructureCategory;
  lat: number | null;
  lng: number | null;
  /** 예: "도보 5분" */
  walkingLabel: string | null;
}

/** 요약 경로의 한 구간. */
export interface RouteSubPathView {
  type: RouteSubPathType;
  /** 예: "도보 4분", "버스 12분" */
  durationLabel: string;
  startName: string | null;
  endName: string | null;
  /** 버스/지하철 노선명 */
  lane: string | null;
  /** 예: "320m" */
  distanceLabel: string | null;
}

/** 결과 카드/지도에서 쓰는 요약 경로. */
export interface RouteSummaryView {
  transportMode: TransportMode;
  /** 예: "11분" */
  durationLabel: string;
  transferCount: number;
  subPaths: RouteSubPathView[];
}

/** 3D 보기 화면 상태. */
export interface Property3DView {
  propertyId: number;
  available: boolean;
  modelUrl: string | null;
  /** 예: "spline" */
  modelType: string | null;
  previewImageUrl: string | null;
}
