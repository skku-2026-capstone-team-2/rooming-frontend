import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Coffee,
  Dumbbell,
  Store,
  School,
  Bus,
  MapPin,
} from "lucide-react";

import {
  useRecommendationRoute,
  useRecommendationSearch,
  useFavorites,
  useRecommendations,
} from "../hooks/queries/recommendationQueries";
import { usePropertyImagesByIds } from "../hooks/queries/propertyQueries";
import { loadSearchRequest } from "../utils/recommendationSearch";
import {
  findRecommendationForProperty,
  parsePropertyId,
  parseRecommendationId,
} from "../utils/recommendationSelection";
import {
  formatRouteDurationLabel,
  formatRoutePlaceDurationLabel,
  getRecommendationRoutePlace,
  mapInfrastructureToMarkerView,
  mapRecommendationToCardView,
} from "../api/mappers/recommendationMapper";
import { useTargetPlaces } from "../hooks/queries/targetPlaceQueries";
import { createPropertyMarkerHTML } from "../utils/createPropertyMarkerHTML";
import {
  createInfraMarkerHTML,
  type InfraMarkerType,
} from "../utils/createInfraMarkerHTML";
import { createSchoolMarkerHTML } from "../utils/createSchoolMarkerHTML";
import { drawDistanceLine } from "../utils/drawDistanceLine";
import { drawRecommendationRoute } from "../utils/drawRecommendationRoute";
import { drawPedestrianRoute } from "../utils/drawPedestrianRoute";
import type { InfrastructureCategory } from "../types";
import CenteredMessage from "../components/CenteredMessage";
import PropertyImagePlaceholder from "../components/PropertyImagePlaceholder";

/** 백엔드 인프라 category(12종) → 마커/아이콘 표현 타입(5종) 매핑. */
const MARKER_TYPE_BY_CATEGORY: Record<InfrastructureCategory, InfraMarkerType> = {
  CONVENIENT_STORE: "store",
  MART: "store",
  CAFE: "cafe",
  GYM: "gym",
  SUBWAY: "bus",
  PHARMACY: "default",
  HOSPITAL: "default",
  LAUNDRY: "default",
  BANK: "default",
  KARAOKE: "default",
  PC_ROOM: "default",
  ETC: "default",
};

const CATEGORY_LABEL: Record<InfrastructureCategory, string> = {
  CONVENIENT_STORE: "편의점",
  MART: "마트",
  PHARMACY: "약국",
  HOSPITAL: "병원",
  LAUNDRY: "세탁소",
  CAFE: "카페",
  SUBWAY: "지하철역",
  BANK: "은행",
  GYM: "헬스장",
  KARAOKE: "노래방",
  PC_ROOM: "PC방",
  ETC: "기타",
};

const MARKER_ICON: Record<InfraMarkerType, React.ElementType> = {
  store: Store,
  cafe: Coffee,
  gym: Dumbbell,
  bus: Bus,
  default: MapPin,
};

const MARKER_COLOR_TOKEN: Record<InfraMarkerType, string> = {
  cafe: "--token-color-infra-cafe",
  gym: "--token-color-infra-gym",
  store: "--token-color-infra-store",
  bus: "--token-color-infra-bus",
  default: "--token-color-purple-600",
};

export default function InfraViewScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 인프라/경로 데이터의 출처는 추천 응답이다. 지도 화면과 동일한 검색 요청을
  // 키로 React Query 캐시를 공유한다. (별도 전역 상태 없음)
  const request = useMemo(() => loadSearchRequest(), []);
  const recommendationIdParam = parseRecommendationId(
    searchParams.get("recommendationId")
  );
  const propertyIdParam = parsePropertyId(searchParams.get("propertyId"));
  const hasInfraLookupContext =
    request != null || recommendationIdParam != null || propertyIdParam != null;

  const {
    data,
    isPending: isSearchPending,
    isError: isSearchError,
  } = useRecommendationSearch(request);
  const {
    data: favoriteData,
    isPending: isFavoritesPending,
    isError: isFavoritesError,
  } = useFavorites(hasInfraLookupContext);
  const primaryRecommendationGroups = useMemo(
    () => [favoriteData?.results ?? [], data?.results ?? []],
    [data, favoriteData]
  );
  const primarySelectedResult = (() => {
    if (propertyIdParam != null) {
      return findRecommendationForProperty({
        propertyId: propertyIdParam,
        recommendationId: recommendationIdParam,
        groups: primaryRecommendationGroups,
      });
    }

    const recommendations = primaryRecommendationGroups.flat();

    if (recommendationIdParam != null) {
      return (
        recommendations.find(
          (recommendation) =>
            recommendation.recommendationId === recommendationIdParam
        ) ?? null
      );
    }

    return recommendations[0] ?? null;
  })();
  const isPrimaryLookupPending =
    (request != null && isSearchPending) || isFavoritesPending;
  const shouldFetchSavedRecommendations =
    !primarySelectedResult &&
    !isPrimaryLookupPending &&
    (propertyIdParam != null || recommendationIdParam != null);
  const {
    data: savedRecommendationData,
    isPending: isSavedRecommendationsPending,
    isError: isSavedRecommendationsError,
  } = useRecommendations(shouldFetchSavedRecommendations);
  const { data: targetPlaceData } = useTargetPlaces(hasInfraLookupContext);
  const savedRecommendationGroups = useMemo(
    () => [savedRecommendationData?.results ?? []],
    [savedRecommendationData]
  );
  const propertyIds = useMemo(
    () =>
      [...primaryRecommendationGroups, ...savedRecommendationGroups]
        .flat()
        .map((recommendation) => recommendation.propertyId),
    [primaryRecommendationGroups, savedRecommendationGroups]
  );
  const { imageUrlsByPropertyId } = usePropertyImagesByIds(
    propertyIds,
    propertyIds.length > 0
  );
  const targetPlaceById = useMemo(
    () =>
      new Map(
        (targetPlaceData?.targetPlaces ?? []).map((place) => [
          place.targetPlaceId,
          place,
        ])
      ),
    [targetPlaceData]
  );
  const recommendationMapperOptions = useMemo(
    () => ({ targetPlaceById, propertyImagesById: imageUrlsByPropertyId }),
    [targetPlaceById, imageUrlsByPropertyId]
  );

  const savedSelectedResult = (() => {
    if (propertyIdParam != null) {
      return findRecommendationForProperty({
        propertyId: propertyIdParam,
        recommendationId: recommendationIdParam,
        groups: savedRecommendationGroups,
      });
    }

    const recommendations = savedRecommendationGroups.flat();

    if (recommendationIdParam != null) {
      return (
        recommendations.find(
          (recommendation) =>
            recommendation.recommendationId === recommendationIdParam
        ) ?? null
      );
    }

    return recommendations[0] ?? null;
  })();
  const selectedResult = primarySelectedResult ?? savedSelectedResult;

  const isLookupPending =
    !selectedResult &&
    (isPrimaryLookupPending ||
      (shouldFetchSavedRecommendations && isSavedRecommendationsPending));
  const isLookupError =
    !selectedResult &&
    (isSearchError ||
      isFavoritesError ||
      (shouldFetchSavedRecommendations && isSavedRecommendationsError));

  // 지도에 경로 선을 그릴 때만 route geometry endpoint를 호출한다(상세 지도이므로 DETAIL).
  const { data: routeData } = useRecommendationRoute(
    selectedResult?.recommendationId ?? null,
    "DETAIL",
    !!selectedResult
  );

  const card = useMemo(
    () =>
      selectedResult
        ? mapRecommendationToCardView(selectedResult, recommendationMapperOptions)
        : null,
    [selectedResult, recommendationMapperOptions]
  );

  const infraMarkers = useMemo(
    () => (selectedResult?.infrastructures ?? []).map(mapInfrastructureToMarkerView),
    [selectedResult]
  );

  const routeDurationLabel = formatRouteDurationLabel(
    selectedResult?.firstTargetPlaceRoute ?? null
  );
  const routePlace = useMemo(
    () =>
      getRecommendationRoutePlace(
        selectedResult?.firstTargetPlaceRoute ?? null,
        recommendationMapperOptions
      ),
    [selectedResult, recommendationMapperOptions]
  );
  const routePlaceLabel = routePlace?.placeName ?? null;
  const routePlacePosition = useMemo(() => {
    const lat = routePlace?.location?.latitude;
    const lng = routePlace?.location?.longitude;
    if (lat == null || lng == null) return null;
    return { lat, lng };
  }, [routePlace]);
  const routePlaceDurationLabel = formatRoutePlaceDurationLabel(
    selectedResult?.firstTargetPlaceRoute ?? null,
    routePlaceLabel
  );

  useEffect(() => {
    if (!selectedResult) return;

    const loadTmapScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.Tmapv2) {
          resolve();
          return;
        }

        const existingScript = document.querySelector<HTMLScriptElement>(
          'script[src*="tmap/jsv2"]'
        );

        if (existingScript) {
          existingScript.onload = () => resolve();
          existingScript.onerror = () => reject();
          return;
        }

        const appKey = import.meta.env.VITE_TMAP_APP_KEY;

        if (!appKey) {
          reject(new Error("VITE_TMAP_APP_KEY가 .env에 설정되어 있지 않습니다."));
          return;
        }

        const script = document.createElement("script");
        script.src = `https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=${appKey}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();

        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      try {
        await loadTmapScript();

        const mapContainer = document.getElementById("infra_map_div");
        const tmap = window.Tmapv2;
        if (!mapContainer || !tmap) return;

        const themeStyles = getComputedStyle(document.documentElement);
        const getThemeColor = (token: string) =>
          themeStyles.getPropertyValue(token).trim();

        // 매물 좌표가 없으면 목적지 기준으로 지도를 띄운다(fallback).
        const propertyLat = card?.lat ?? routePlacePosition?.lat;
        const propertyLng = card?.lng ?? routePlacePosition?.lng;
        if (propertyLat == null || propertyLng == null) return;

        mapContainer.innerHTML = "";

        const map = new tmap.Map("infra_map_div", {
          center: new tmap.LatLng(propertyLat, propertyLng),
          width: "100%",
          height: "100%",
          zoom: 17,
        });

        // 목적지 마커 (목적지 좌표가 있을 때만)
        if (routePlacePosition) {
          new tmap.Marker({
            position: new tmap.LatLng(
              routePlacePosition.lat,
              routePlacePosition.lng
            ),
            map,
            iconHTML: createSchoolMarkerHTML(routePlaceLabel ?? "목적지"),
          });
        }

        // 선택 매물 마커
        new tmap.Marker({
          position: new tmap.LatLng(propertyLat, propertyLng),
          map,
          title: card?.title,
          iconHTML: createPropertyMarkerHTML(card?.priceLabel ?? ""),
          zIndex: 30,
        });

        // 추천 응답의 저장된 경로 geometry를 그린다.
        const routeResult = routeData
          ? drawRecommendationRoute({
              map,
              path: routeData.path,
              propertyLat,
              propertyLng,
              destinationLat: routePlacePosition?.lat,
              destinationLng: routePlacePosition?.lng,
              colorByType: {
                WALK: getThemeColor("--token-color-purple-700"),
                BUS: getThemeColor("--token-color-infra-bus"),
                SUBWAY: getThemeColor("--token-color-infra-bus"),
              },
              defaultColor: getThemeColor("--token-color-purple-700"),
            })
          : { drawnPoints: 0, emptySegments: [] };

        // 비어있는 각 도보 구간을 Tmap 도보 경로 API로 보강한다.
        for (const segment of routeResult.emptySegments) {
          await drawPedestrianRoute({
            map,
            from: {
              lat: segment.startLat,
              lng: segment.startLng,
              name: "",
            },
            to: {
              lat: segment.endLat,
              lng: segment.endLng,
              name: "",
            },
            strokeColor: getThemeColor("--token-color-purple-700"),
          });
        }

        // 경로가 전혀 없으면 직선으로 fallback. (목적지가 있을 때만)
        if (
          routePlacePosition &&
          routeResult.drawnPoints === 0 &&
          routeResult.emptySegments.length === 0
        ) {
          drawDistanceLine({
            map,
            from: { lat: propertyLat, lng: propertyLng },
            to: { lat: routePlacePosition.lat, lng: routePlacePosition.lng },
            strokeColor: getThemeColor("--token-color-purple-700"),
          });
        }

        // 인프라 마커 + 매물과의 점선 (추천 응답 infrastructures 기반)
        infraMarkers.forEach((infra) => {
          if (infra.lat == null || infra.lng == null) return;

          const markerType = MARKER_TYPE_BY_CATEGORY[infra.category];

          new tmap.Marker({
            position: new tmap.LatLng(infra.lat, infra.lng),
            map,
            iconHTML: createInfraMarkerHTML({
              label: infra.name,
              type: markerType,
            }),
            zIndex: 10,
          });

          drawDistanceLine({
            map,
            from: { lat: propertyLat, lng: propertyLng },
            to: { lat: infra.lat, lng: infra.lng },
            strokeColor: getThemeColor("--token-color-green-400"),
          });
        });
      } catch (error) {
        console.error("Tmap 지도 생성 실패:", error);
      }
    };

    initMap();
  }, [
    selectedResult,
    routeData,
    infraMarkers,
    card,
    routePlaceLabel,
    routePlacePosition,
  ]);

  // 검색 전 / 로딩 / 실패 / 결과 없음 상태 fallback.
  if (!hasInfraLookupContext) {
    return (
      <CenteredMessage
        title="추천 결과가 없어요"
        description="지도 화면의 AI 검색에서 먼저 매물을 추천받아 주세요."
        onBack={() => navigate("/map")}
      />
    );
  }

  if (isLookupPending) {
    return (
      <CenteredMessage
        title="인프라 정보를 불러오고 있어요"
        description="추천 매물의 주변 생활 인프라를 정리하는 중이에요."
      />
    );
  }

  if (isLookupError) {
    return (
      <CenteredMessage
        title="인프라 정보를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
        onBack={() => navigate(-1)}
      />
    );
  }

  if (!selectedResult || !card) {
    return (
      <CenteredMessage
        title="표시할 매물이 없어요"
        description="다른 조건으로 다시 검색해 보세요."
        onBack={() => navigate("/map")}
      />
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <div id="infra_map_div" className="h-full w-full" />

      {/* 좌측 상단 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-2xl border border-green-800 bg-green-900 px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-green-800"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </button>

      {/* 좌측 하단 인프라 리스트 */}
      <section className="absolute bottom-6 left-6 z-20 w-[390px] rounded-3xl border border-border bg-card/95 p-5 shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              주변 생활 인프라
            </h3>
            <p className="mt-1 text-xs text-text-tertiary">
              추천 매물 기준으로 가까운 시설을 지도에 표시합니다.
            </p>
          </div>
        </div>

        {infraMarkers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-text-tertiary">
            주변 인프라 정보가 없어요.
          </div>
        ) : (
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {infraMarkers.map((infra) => {
              const markerType = MARKER_TYPE_BY_CATEGORY[infra.category];
              const Icon = MARKER_ICON[markerType];
              const infraColor = `var(${MARKER_COLOR_TOKEN[markerType]})`;

              return (
                <div
                  key={infra.infrastructureId}
                  style={{
                    borderColor: `color-mix(in srgb, ${infraColor} 42%, var(--token-color-white))`,
                    backgroundColor: `color-mix(in srgb, ${infraColor} 4%, var(--token-color-white))`,
                  }}
                  className="flex items-center justify-between rounded-2xl border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: `color-mix(in srgb, ${infraColor} 10%, var(--token-color-white))`,
                        color: infraColor,
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {infra.name}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        {CATEGORY_LABEL[infra.category]}
                      </div>
                    </div>
                  </div>

                  {infra.walkingLabel && (
                    <span
                      style={{
                        borderColor: `color-mix(in srgb, ${infraColor} 58%, var(--token-color-white))`,
                        backgroundColor: `color-mix(in srgb, ${infraColor} 8%, var(--token-color-white))`,
                        color: infraColor,
                      }}
                      className="rounded-full border px-3 py-1 text-xs font-semibold"
                    >
                      {infra.walkingLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 우측 하단 선택 매물 카드 */}
      <section className="absolute bottom-6 right-6 z-20 w-[360px] rounded-3xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-sm">
        {/* 매물 사진 영역 (추천 응답에는 이미지가 없어 placeholder) */}
        <div className="relative mb-4 h-44 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-border/30 to-purple-300/30">
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <PropertyImagePlaceholder size="md" />
          )}

          {/* 하단 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 via-foreground/35 to-transparent px-4 pb-3 pt-12">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-card/40 bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-purple-800">
                AI 추천
              </span>
            </div>

            <h2 className="line-clamp-1 text-base font-bold text-primary-foreground">
              {card.title}
            </h2>

            {card.description && (
              <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-primary-foreground/85">
                {card.description}
              </p>
            )}
          </div>
        </div>

        {/* 가격 */}
        <div className="flex items-center justify-between rounded-2xl border border-beige-300 bg-green-300 px-4 py-3">
          <span className="text-sm font-medium text-text-tertiary">
            보증금 / 월세
          </span>
          <span className="text-base font-bold text-text-secondary">
            {card.priceLabel}
          </span>
        </div>

        {/* 학교까지 거리 (추천 요약 경로) - 목적지 정보가 있을 때만 */}
        {(routePlaceDurationLabel || routePlaceLabel) && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-100 px-4 py-3 text-sm text-purple-800">
            <School className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {routePlaceDurationLabel ??
                `${routePlaceLabel}까지 ${routeDurationLabel ?? "경로 정보 없음"}`}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

