/**
 * OpenAPI(`docs/api/openapi.yaml`) 스키마를 그대로 옮긴 API 타입 정의.
 *
 * - 백엔드 응답/요청 계약을 1:1로 반영한다. 필드명·nullable·enum 문자열을 임의로 바꾸지 않는다.
 * - 화면 렌더링용 가공 타입은 `./view.ts`에 분리되어 있다.
 * - 더미 데이터 구조와의 차이는 `docs/api/type-mapping-ko.md` 참고.
 */

/* ------------------------------------------------------------------ */
/* 공통 래퍼                                                            */
/* ------------------------------------------------------------------ */

/** `{ success, data, message }` 형태의 공통 성공 응답 래퍼. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/** data가 없는 성공 응답(SimpleSuccessResponse). */
export type SimpleSuccessResponse = ApiResponse<Record<string, unknown> | null>;

/** 공통 에러 응답. */
export interface ErrorResponse {
  message: string;
  /** ISO 8601 date-time */
  time: string;
}

/* ------------------------------------------------------------------ */
/* 공통 값 / enum (erasableSyntaxOnly: enum 대신 union 사용)             */
/* ------------------------------------------------------------------ */

export interface CoordinateDto {
  /** -90 ~ 90 */
  latitude: number;
  /** -180 ~ 180 */
  longitude: number;
}

export type TradeType = "MONTHLY_RENT" | "DEPOSIT_BASIS";

export type AccountType = "SEEKER" | "BROKER";

export type PlaceCategory =
  | "SCHOOL"
  | "WORK_PLACE"
  | "HOME"
  | "SUBWAY_STATION"
  | "BUS_TERMINAL"
  | "ETC";

export type InfrastructureCategory =
  | "CONVENIENT_STORE"
  | "MART"
  | "PHARMACY"
  | "HOSPITAL"
  | "LAUNDRY"
  | "CAFE"
  | "SUBWAY"
  | "BANK"
  | "GYM"
  | "KARAOKE"
  | "PC_ROOM"
  | "ETC";

export type TransportMode = "PUBLIC_TRANSPORT" | "WALK";

export type RouteSubPathType = "SUBWAY" | "BUS" | "WALK" | "UNKNOWN";

/** SUMMARY: 최대 100 포인트, DETAIL: 최대 300 포인트 (기본 SUMMARY). */
export type RouteGeometryDetail = "SUMMARY" | "DETAIL";

/* ------------------------------------------------------------------ */
/* Property                                                            */
/* ------------------------------------------------------------------ */

/** `GET /api/v1/properties` 목록 아이템. */
export interface Property {
  propertyId: number;
  title: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  tradeType: TradeType | null;
  deposit: number | null;
  monthlyRent: number | null;
  areaM2: number | null;
  /** 예: "one_room" */
  roomType: string | null;
  floorInfo: string | null;
  maintenanceFee: number | null;
  description: string | null;
  tags: string[] | null;
  has3DModel: boolean | null;
  /** Spline 3D 모델 URL */
  splineUrl: string | null;
  imageUrls: string[] | null;
}

export type PropertyListResponse = ApiResponse<Property[]>;

/** `GET /api/v1/properties/{id}` 상세. */
export interface PropertyDetail {
  propertyId: number;
  title: string;
  address: string;
  tradeType: TradeType | null;
  deposit: number | null;
  monthlyRent: number | null;
  areaM2: number | null;
  roomType: string | null;
  floorInfo: string | null;
  maintenanceFee: number | null;
  description: string | null;
  tags: string[] | null;
  has3DModel: boolean | null;
}

export type PropertyDetailResponse = ApiResponse<PropertyDetail>;

/** `GET /api/v1/properties/{id}/images` 의 이미지 아이템. */
export interface PropertyImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}

export interface PropertyImagesData {
  propertyId: number;
  images: PropertyImage[];
}

export type PropertyImagesResponse = ApiResponse<PropertyImagesData>;

/** `GET /api/v1/properties/{id}/3d`. */
export interface Property3D {
  propertyId: number;
  has3DModel: boolean;
  /** 예: "spline" */
  modelType: string;
  modelUrl: string | null;
  previewImageUrl: string | null;
}

export type Property3DResponse = ApiResponse<Property3D>;

/* ------------------------------------------------------------------ */
/* Recommendation                                                      */
/* ------------------------------------------------------------------ */

/** `POST /api/v1/recommendations` 요청 본문. */
export interface RecommendationRequest {
  /** 자연어 검색어 */
  query: string;
  preferences?: string[] | null;
  /** 1 ~ 5, 기본 3 */
  topN?: number | null;
}

/** 추천 결과에 포함된 매물 요약. */
export interface RecommendationPropertyDetails {
  location: CoordinateDto | null;
  tradeType: TradeType;
  depositAmount: number | null;
  monthlyRent: number | null;
  maintenanceFee: number | null;
  description: string | null;
  tags: string[] | null;
  /** Optional display fields for the planned backend denormalized response. */
  title?: string | null;
  address?: string | null;
  areaM2?: number | null;
  roomType?: string | null;
  floorInfo?: string | null;
  has3DModel?: boolean | null;
  imageUrl?: string | null;
  imageUrls?: string[] | null;
}

/** 추천 결과에 포함된 주변 인프라. */
export interface RecommendationInfrastructureDetails {
  infrastructureId: number;
  name: string | null;
  category: InfrastructureCategory | null;
  roadAddress: string | null;
  location: CoordinateDto | null;
  walkingMinutes: number | null;
}

/** 카드/리스트용 요약 경로 구간. */
export interface RecommendationRouteSubPathSummary {
  type: RouteSubPathType;
  trafficType: number;
  /** 분 단위 */
  time: number;
  startName: string | null;
  endName: string | null;
  /** 예: 버스 노선 "62-1" */
  lane: string | null;
  /** 미터 단위 */
  distance: number | null;
  description: string | null;
}

/** 첫 목적지까지의 요약 경로. */
export interface RecommendationTargetPlaceRoute {
  targetPlaceId: number;
  transportMode: TransportMode;
  durationMinutes: number;
  transferCount: number;
  subPaths: RecommendationRouteSubPathSummary[];
  /** Optional display fields for the planned backend denormalized response. */
  placeName?: string | null;
  name?: string | null;
  location?: CoordinateDto | null;
}

/** 추천 결과 단위 (saved recommendation 포함). */
export interface RecommendationResult {
  recommendationId: number;
  propertyId: number;
  favorite: boolean;
  property: RecommendationPropertyDetails;
  firstTargetPlaceRoute: RecommendationTargetPlaceRoute | null;
  infrastructures: RecommendationInfrastructureDetails[];
  /** 추천 이유 */
  explanation: string | null;
}

export interface RecommendationData {
  message: string;
  results: RecommendationResult[];
}

/** `POST /api/v1/recommendations`. */
export type RecommendationResponse = ApiResponse<RecommendationData>;

export interface RecommendationListData {
  results: RecommendationResult[];
}

/** `GET /api/v1/recommendations`. */
export type RecommendationListResponse = ApiResponse<RecommendationListData>;

export interface FavoriteRecommendationData {
  results: RecommendationResult[];
}

/** `GET /api/v1/recommendations/favorites`. */
export type FavoriteRecommendationResponse = ApiResponse<FavoriteRecommendationData>;

/** `POST /api/v1/recommendations/{recommendationId}/favorite`. */
export type RecommendationResultResponse = ApiResponse<RecommendationResult>;

/* ------------------------------------------------------------------ */
/* Recommendation Route (geometry)                                     */
/* ------------------------------------------------------------------ */

/** 지도 geometry를 포함한 상세 경로 구간. */
export interface RecommendationRouteSubPathDetail {
  type: RouteSubPathType;
  trafficType: number;
  /** 분 단위 */
  time: number;
  startName: string | null;
  endName: string | null;
  lane: string | null;
  /** 미터 단위 */
  distance: number | null;
  description: string | null;
  /** 구간 simplified geometry */
  points: CoordinateDto[];
}

export interface RecommendationRoutePath {
  /** 분 단위 */
  totalTime: number;
  transferCount: number;
  /** simplify 후 포인트 수 (최대 300) */
  totalPointCount: number;
  pathList: RecommendationRouteSubPathDetail[];
}

export interface RecommendationRouteDetailData {
  recommendationId: number;
  propertyId: number;
  targetPlaceId: number;
  transportMode: TransportMode;
  durationMinutes: number;
  detail: RouteGeometryDetail;
  path: RecommendationRoutePath;
}

/** `GET /api/v1/recommendations/{recommendationId}/route`. */
export type RecommendationRouteDetailResponse = ApiResponse<RecommendationRouteDetailData>;

/* ------------------------------------------------------------------ */
/* Target Place                                                        */
/* ------------------------------------------------------------------ */

/** `POST /api/v1/user/seeker/target-place`. (category와 placeType은 동일 값) */
export interface TargetPlaceCreateRequest {
  category: PlaceCategory;
  /** category의 JSON alias */
  placeType: PlaceCategory;
  placeName: string;
  /** 최대 255자 */
  roadAddress: string;
  location: CoordinateDto;
  memo?: string | null;
}

/** `PUT /api/v1/user/seeker/target-place/{targetPlaceId}` (부분 수정). */
export interface TargetPlaceUpdateRequest {
  category?: PlaceCategory;
  placeType?: PlaceCategory;
  placeName?: string | null;
  roadAddress?: string | null;
  location?: CoordinateDto | null;
  memo?: string | null;
}

export interface TargetPlaceResponseItem {
  targetPlaceId: number;
  category: PlaceCategory;
  placeName: string;
  roadAddress: string | null;
  location: CoordinateDto;
  memo: string | null;
}

export type TargetPlaceResponse = ApiResponse<TargetPlaceResponseItem>;

export interface TargetPlaceListData {
  targetPlaces: TargetPlaceResponseItem[];
}

/** `GET /api/v1/user/seeker/target-place`. */
export type TargetPlaceListResponse = ApiResponse<TargetPlaceListData>;

/* ------------------------------------------------------------------ */
/* Auth / Profile                                                      */
/* ------------------------------------------------------------------ */

/** `GET /api/v1/user/seeker/me`. */
export interface SeekerProfileData {
  userId: number;
  email: string;
  name: string;
  accountType: "SEEKER";
}

export type SeekerProfileResponse = ApiResponse<SeekerProfileData>;

/** `GET /api/v1/user/broker/me`. */
export interface BrokerProfileData {
  brokerId: number;
  email: string;
  name: string;
  accountType: "BROKER";
  officeId: number | null;
  officeName: string | null;
  registrationNo: string | null;
  officePhone: string | null;
  officeAddress: string | null;
  phoneNumber: string | null;
  hasVerificationDocument: boolean;
  verificationDocumentFileName: string | null;
  isVerified: boolean;
  /** registrationNo, phoneNumber, verificationDocument가 모두 제출되면 true */
  profileComplete: boolean;
}

export type BrokerProfileResponse = ApiResponse<BrokerProfileData>;

/** `PUT /api/v1/user/broker/me/additional-info`. */
export interface BrokerAdditionalInfoRequest {
  officeId?: number | null;
  registrationNo: string;
  phoneNumber: string;
}

/* ------------------------------------------------------------------ */
/* Broker Office / Property                                            */
/* ------------------------------------------------------------------ */

export interface BrokerOfficeData {
  officeId: number;
  officeName: string;
  officePhone: string;
  officeAddress: string;
}

/** `POST /api/v1/broker-offices`. */
export interface BrokerOfficeCreateRequest {
  officeName: string;
  officePhone: string;
  officeAddress: string;
}

export type BrokerOfficeResponse = ApiResponse<BrokerOfficeData>;

export interface BrokerOfficeListData {
  offices: BrokerOfficeData[];
}

/** `GET /api/v1/broker-offices`. */
export type BrokerOfficeListResponse = ApiResponse<BrokerOfficeListData>;

/** `POST /api/v1/user/broker/me/properties`. */
export interface BrokerPropertyCreateRequest {
  title: string;
  /** 자유 문자열 (예: "one_room") */
  propertyType?: string | null;
  tradeType: TradeType;
  depositAmount: number;
  /** DEPOSIT_BASIS면 생략하거나 0 */
  monthlyRent?: number | null;
  tags?: string[] | null;
  maintenanceFee?: number | null;
  areaM2: number;
  /** 예: "5층" */
  floorInfo?: string | null;
  roomCount?: number | null;
  bathroomCount?: number | null;
  /** 예: "SOUTH" */
  direction?: string | null;
  availableFrom?: string | null;
  description?: string | null;
  roadAddress: string;
  location: CoordinateDto;
}

export interface BrokerPropertyData {
  propertyId: number;
  title: string;
  propertyType: string | null;
  roadAddress: string;
  location: CoordinateDto;
  tradeType: TradeType;
  depositAmount: number;
  monthlyRent: number | null;
  maintenanceFee: number | null;
  areaM2: number;
  floorInfo: string | null;
  description: string | null;
  tags: string[] | null;
  hasProperty3D: boolean;
}

export type BrokerPropertyResponse = ApiResponse<BrokerPropertyData>;

export interface BrokerPropertySummaryData {
  propertyId: number;
  title: string;
}

export type BrokerPropertyListResponse = ApiResponse<BrokerPropertySummaryData[]>;
