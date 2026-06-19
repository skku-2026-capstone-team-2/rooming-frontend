import type {
  RecommendationResult,
  RecommendationData,
  RecommendationListData,
  FavoriteRecommendationData,
  RecommendationRouteDetailData,
  RecommendationRequest,
  RouteGeometryDetail,
  CoordinateDto,
} from "../../types";
import { mockData, mockError } from "./runtime";

/** mock 경로의 도착지(성균관대 정문). 실제 서버에서는 targetPlace 좌표로 대체된다. */
const MOCK_TARGET: CoordinateDto = { latitude: 37.5849, longitude: 126.9953 };

/**
 * 출발지 → 도착지 사이를 직선 보간해 simplified geometry 좌표를 생성한다.
 * SUMMARY는 적은 포인트(개요용), DETAIL은 많은 포인트(상세 지도용)를 돌려준다.
 */
function buildMockGeometry(
  from: CoordinateDto,
  to: CoordinateDto,
  detail: RouteGeometryDetail
): CoordinateDto[] {
  const segments = detail === "DETAIL" ? 24 : 8;
  const points: CoordinateDto[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    points.push({
      latitude: from.latitude + (to.latitude - from.latitude) * t,
      longitude: from.longitude + (to.longitude - from.longitude) * t,
    });
  }
  return points;
}

const mockResults: RecommendationResult[] = [
  {
    recommendationId: 1,
    propertyId: 1,
    favorite: true,
    property: {
      location: { latitude: 37.5898, longitude: 126.9942 },
      tradeType: "MONTHLY_RENT",
      depositAmount: 500,
      monthlyRent: 55,
      maintenanceFee: 0,
      description: "생활 인프라 우수, 편의점 도보 2분",
      tags: ["편의점", "인프라"],
    },
    firstTargetPlaceRoute: {
      targetPlaceId: 1,
      transportMode: "WALK",
      durationMinutes: 11,
      transferCount: 0,
      subPaths: [
        {
          type: "WALK",
          trafficType: 3,
          time: 11,
          startName: "출발지",
          endName: "성균관대 정문",
          lane: null,
          distance: 850,
          description: null,
        },
      ],
    },
    infrastructures: [
      {
        infrastructureId: 101,
        name: "인근 편의점",
        category: "CONVENIENT_STORE",
        roadAddress: "서울 종로구 성균관로 ...",
        location: { latitude: 37.5899, longitude: 126.9944 },
        walkingMinutes: 2,
      },
    ],
    explanation: "생활 인프라 우수, 편의점 도보 2분",
  },
  {
    recommendationId: 12,
    propertyId: 101,
    favorite: true,
    property: {
      location: { latitude: 37.5826, longitude: 127.0012 },
      tradeType: "MONTHLY_RENT",
      depositAmount: 1000,
      monthlyRent: 45,
      maintenanceFee: 5,
      description: null,
      tags: ["헬스장", "음식점"],
    },
    firstTargetPlaceRoute: {
      targetPlaceId: 1,
      transportMode: "WALK",
      durationMinutes: 12,
      transferCount: 0,
      subPaths: [
        {
          type: "WALK",
          trafficType: 3,
          time: 12,
          startName: "출발지",
          endName: "성균관대학교",
          lane: null,
          distance: 900,
          description: null,
        },
      ],
    },
    infrastructures: [
      {
        infrastructureId: 102,
        name: "피트니스 혜화점",
        category: "GYM",
        roadAddress: "서울 종로구 대학로 ...",
        location: { latitude: 37.583, longitude: 127.0017 },
        walkingMinutes: 4,
      },
    ],
    explanation: "학교까지 도보 12분, 헬스장 도보 4분, 음식점 도보 6분",
  },
  {
    recommendationId: 13,
    propertyId: 102,
    favorite: true,
    property: {
      location: { latitude: 37.5862, longitude: 126.9988 },
      tradeType: "MONTHLY_RENT",
      depositAmount: 500,
      monthlyRent: 52,
      maintenanceFee: 6,
      description: null,
      tags: ["카페", "편의점"],
    },
    firstTargetPlaceRoute: {
      targetPlaceId: 1,
      transportMode: "WALK",
      durationMinutes: 8,
      transferCount: 0,
      subPaths: [
        {
          type: "WALK",
          trafficType: 3,
          time: 8,
          startName: "출발지",
          endName: "성균관대학교",
          lane: null,
          distance: 650,
          description: null,
        },
      ],
    },
    infrastructures: [
      {
        infrastructureId: 103,
        name: "CU 명륜성대점",
        category: "CONVENIENT_STORE",
        roadAddress: "서울 종로구 명륜길 ...",
        location: { latitude: 37.5865, longitude: 126.9993 },
        walkingMinutes: 2,
      },
    ],
    explanation: "학교까지 도보 8분, 편의점 도보 2분, 카페 도보 5분",
  },
];

export const recommendationMock = {
  postRecommendation(_req: RecommendationRequest): Promise<RecommendationData> {
    return mockData({ message: "추천 결과입니다.", results: mockResults });
  },

  getRecommendations(): Promise<RecommendationListData> {
    return mockData({ results: mockResults });
  },

  getFavorites(): Promise<FavoriteRecommendationData> {
    const favorites = mockResults.filter((r) => r.favorite);
    return mockData({ results: favorites });
  },

  getRoute(
    recommendationId: number,
    detail: RouteGeometryDetail = "SUMMARY"
  ): Promise<RecommendationRouteDetailData> {
    const rec = mockResults.find((r) => r.recommendationId === recommendationId);
    if (!rec || !rec.firstTargetPlaceRoute) {
      return mockError(404, `경로를 찾을 수 없습니다. (id=${recommendationId})`);
    }
    const route = rec.firstTargetPlaceRoute;
    const from = rec.property.location ?? MOCK_TARGET;
    const geometry = buildMockGeometry(from, MOCK_TARGET, detail);

    // 단일 WALK 구간(요약)을 detail 단계 수만큼 보간한 좌표로 채운다.
    // 다구간 경로면 구간 수로 좌표를 분배한다.
    const subPathCount = route.subPaths.length || 1;
    const chunkSize = Math.ceil(geometry.length / subPathCount);
    const pathList = route.subPaths.map((sp, index) => ({
      ...sp,
      points: geometry.slice(index * chunkSize, (index + 1) * chunkSize + 1),
    }));

    const result: RecommendationRouteDetailData = {
      recommendationId: rec.recommendationId,
      propertyId: rec.propertyId,
      targetPlaceId: route.targetPlaceId,
      transportMode: route.transportMode,
      durationMinutes: route.durationMinutes,
      detail,
      path: {
        totalTime: route.durationMinutes,
        transferCount: route.transferCount,
        totalPointCount: geometry.length,
        pathList,
      },
    };
    return mockData(result);
  },

  addFavorite(recommendationId: number): Promise<RecommendationResult> {
    const rec = mockResults.find((r) => r.recommendationId === recommendationId);
    if (!rec) return mockError(404, `추천 결과를 찾을 수 없습니다. (id=${recommendationId})`);
    rec.favorite = true;
    return mockData({ ...rec });
  },

  removeFavorite(recommendationId: number): Promise<null> {
    const rec = mockResults.find((r) => r.recommendationId === recommendationId);
    if (!rec) return mockError(404, `추천 결과를 찾을 수 없습니다. (id=${recommendationId})`);
    rec.favorite = false;
    return mockData(null);
  },

  deleteRecommendation(recommendationId: number): Promise<null> {
    const idx = mockResults.findIndex((r) => r.recommendationId === recommendationId);
    if (idx === -1) return mockError(404, `추천 결과를 찾을 수 없습니다. (id=${recommendationId})`);
    mockResults.splice(idx, 1);
    return mockData(null);
  },
};
