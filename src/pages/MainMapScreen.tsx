import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { UserRound } from "lucide-react";

import PropertyListPanel from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";
import AIPanel from "../components/AIPanel";
import PropertyDetailModal from "../components/PropertyDetailModal";
import PropertyMarkerToggle from "../components/PropertyMarkerToggle";

import {
  clearInfraMarkers,
  loadPoiMarkers,
  type InfraSearchCondition,
} from "../utils/infraPoiMarkers";
import {
  clearMarkers,
  clearSingleMarker,
  getCurrentMapCenter,
  getPropertiesCenter,
  getPropertyViewportZoom,
  loadPropertyMarkers,
  loadSchoolMarker,
} from "../utils/tmapMarkerUtils";
import type { ListMode } from "../utils/propertyListItems";
import { useTargetPlaces } from "../hooks/queries/targetPlaceQueries";
import { useRecommendationManagement } from "../hooks/useRecommendationManagement";
import { mapRecommendationToCardView } from "../api/mappers/recommendationMapper";
import type { PropertyCardView, TargetPlaceResponseItem } from "../types";

const MAP_CENTER = {
  lat: 37.5882,
  lng: 126.9936,
};

type TargetPlaceMarker = {
  label: string;
  position: {
    lat: number;
    lng: number;
  };
};

const DEFAULT_TARGET_PLACE: TargetPlaceMarker = {
  label: "성균관대 정문",
  position: {
    lat: 37.5849,
    lng: 126.9953,
  },
};

const MAIN_TARGET_PLACE_CATEGORY = "SCHOOL";

const DEFAULT_INFRA_CONDITION: InfraSearchCondition = {
  categories: [],
  radius: 500,
  customKeyword: "",
};

function isValidCoordinate(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function getMainTargetPlace(
  targetPlaces: TargetPlaceResponseItem[]
): TargetPlaceResponseItem | null {
  return (
    targetPlaces.find((place) => place.category === MAIN_TARGET_PLACE_CATEGORY) ??
    targetPlaces[0] ??
    null
  );
}

function toTargetPlaceMarker(
  targetPlace: TargetPlaceResponseItem | null
): TargetPlaceMarker | null {
  if (
    !targetPlace ||
    !isValidCoordinate(targetPlace.location?.latitude) ||
    !isValidCoordinate(targetPlace.location?.longitude)
  ) {
    return null;
  }

  return {
    label: targetPlace.placeName,
    position: {
      lat: targetPlace.location.latitude,
      lng: targetPlace.location.longitude,
    },
  };
}

/** 지도가 무엇을 보여줄지. `view`가 없으면(검색 전) 아무것도 노출하지 않는다. */
function getValidView(value: string | null): ListMode | null {
  if (value === "recommended") return "recommended";
  if (value === "favorites") return "favorites";
  return null;
}

export default function MainMapScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const mapRef = useRef<TmapMap | null>(null);
  const isMapInitializedRef = useRef(false);

  const infraMarkersRef = useRef<TmapMarker[]>([]);
  const schoolMarkerRef = useRef<TmapMarker | null>(null);
  const propertyMarkersRef = useRef<TmapMarker[]>([]);

  const setSearchParamsRef = useRef(setSearchParams);
  const targetPlaceMarkerRef = useRef(DEFAULT_TARGET_PLACE);

  // 추천/MY(찜) 매물은 마이페이지와 동일한 관리 훅(서버 저장 추천/찜 목록 + 토글)을 공유한다.
  const {
    recommendations,
    favorites,
    mapperOptions: recommendationMapperOptions,
  } = useRecommendationManagement();

  // view 없음(null) = 추천 모드 기본. 추천/MY 토글 상태를 URL로 유지한다.
  const view = getValidView(searchParams.get("view"));
  const listMode: ListMode = view ?? "recommended";
  const listModeRef = useRef<ListMode>(listMode);

  const [showPropertyMarkers, setShowPropertyMarkers] = useState(true);
  const showPropertyMarkersRef = useRef(true);

  const {
    data: targetPlaceData,
    isPending: isTargetPlacesPending,
  } = useTargetPlaces();
  const shouldWaitForTargetPlaces = isTargetPlacesPending && !targetPlaceData;

  const mainTargetPlaceMarker = useMemo(
    () =>
      toTargetPlaceMarker(
        getMainTargetPlace(targetPlaceData?.targetPlaces ?? [])
      ) ?? DEFAULT_TARGET_PLACE,
    [targetPlaceData]
  );

  const recommendedProperties = useMemo<PropertyCardView[]>(() => {
    // 동일 매물이 여러 조건에서 추천될 수 있어 propertyId 기준으로 한 번만 표시한다.
    const seen = new Set<PropertyCardView["propertyId"]>();
    return recommendations
      .map((result) =>
        mapRecommendationToCardView(result, recommendationMapperOptions)
      )
      .filter((property) => {
        if (seen.has(property.propertyId)) return false;
        seen.add(property.propertyId);
        return true;
      });
  }, [recommendations, recommendationMapperOptions]);
  const recommendedPropertiesRef = useRef<PropertyCardView[]>([]);

  const favoriteProperties = useMemo<PropertyCardView[]>(() => {
    // 서버 응답에 동일 propertyId가 중복으로 내려오는 경우가 있어
    // 먼저 나온 항목만 남기고 한 번씩만 표시한다.
    const seen = new Set<PropertyCardView["propertyId"]>();
    return favorites
      .map((result) =>
        mapRecommendationToCardView(result, recommendationMapperOptions)
      )
      .filter((property) => {
        if (seen.has(property.propertyId)) return false;
        seen.add(property.propertyId);
        return true;
      });
  }, [favorites, recommendationMapperOptions]);
  const favoritePropertiesRef = useRef<PropertyCardView[]>([]);

  // 추천/MY 중 하나라도 데이터가 있으면 목록·마커를 노출한다.
  const hasSearchResult =
    recommendedProperties.length > 0 || favoriteProperties.length > 0;
  const hasSearchResultRef = useRef(hasSearchResult);

  // 마커 갱신 등 imperative 코드에서 최신 목록을 읽기 위한 resolver.
  const resolveProperties = useCallback(
    (mode: ListMode): PropertyCardView[] =>
      mode === "favorites"
        ? favoritePropertiesRef.current
        : recommendedPropertiesRef.current,
    []
  );

  const currentProperties = useMemo(
    () =>
      listMode === "favorites" ? favoriteProperties : recommendedProperties,
    [listMode, favoriteProperties, recommendedProperties]
  );

  const visibleProperties = useMemo(() => {
    return hasSearchResult ? currentProperties : [];
  }, [hasSearchResult, currentProperties]);

  const selectedPropertyId = searchParams.get("propertyId");

  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    if (!hasSearchResult) return null;

    return (
      currentProperties.find(
        (property) => String(property.propertyId) === selectedPropertyId
      ) ?? null
    );
  }, [currentProperties, selectedPropertyId, hasSearchResult]);

  const targetPlaceMarker = useMemo(() => {
    const routePlaceProperty =
      selectedProperty ??
      visibleProperties.find(
        (property) =>
          property.routePlaceLat != null ||
          property.routePlaceLng != null ||
          property.routePlaceName != null
      );

    const routePlaceLat = routePlaceProperty?.routePlaceLat;
    const routePlaceLng = routePlaceProperty?.routePlaceLng;

    if (isValidCoordinate(routePlaceLat) && isValidCoordinate(routePlaceLng)) {
      return {
        label: routePlaceProperty?.routePlaceName ?? mainTargetPlaceMarker.label,
        position: {
          lat: routePlaceLat,
          lng: routePlaceLng,
        },
      };
    }

    if (routePlaceProperty?.routePlaceName) {
      return {
        label: routePlaceProperty.routePlaceName,
        position: mainTargetPlaceMarker.position,
      };
    }

    return {
      label: mainTargetPlaceMarker.label,
      position: mainTargetPlaceMarker.position,
    };
  }, [selectedProperty, visibleProperties, mainTargetPlaceMarker]);

  // imperative 지도 init 코드가 최신 노출 여부를 읽도록 ref에 동기화한다.
  useEffect(() => {
    hasSearchResultRef.current = hasSearchResult;
  }, [hasSearchResult]);

  // imperative 마커 코드가 최신 목록을 읽도록 추천 결과를 ref에 동기화한다.
  useEffect(() => {
    recommendedPropertiesRef.current = recommendedProperties;
  }, [recommendedProperties]);

  useEffect(() => {
    favoritePropertiesRef.current = favoriteProperties;
  }, [favoriteProperties]);

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  useEffect(() => {
    listModeRef.current = listMode;
  }, [listMode]);

  useEffect(() => {
    showPropertyMarkersRef.current = showPropertyMarkers;
  }, [showPropertyMarkers]);

  const renderPropertyMarkers = useCallback(
    (
      properties: PropertyCardView[],
      enabled = showPropertyMarkersRef.current
    ) => {
      if (!mapRef.current) return;

      loadPropertyMarkers({
        map: mapRef.current,
        properties,
        markersRef: propertyMarkersRef,
        enabled,
        onClickProperty: (nextParams) => {
          setSearchParamsRef.current((prev) => {
            const params = new URLSearchParams(prev);
            params.set("view", listModeRef.current);
            params.set("propertyId", nextParams.propertyId);
            return params;
          });
        },
      });
    },
    []
  );

  const renderTargetPlaceMarker = useCallback(
    (marker = targetPlaceMarkerRef.current) => {
      if (!mapRef.current) return;

      clearSingleMarker(schoolMarkerRef, "목적지 마커");
      loadSchoolMarker({
        map: mapRef.current,
        markerRef: schoolMarkerRef,
        position: marker.position,
        label: marker.label,
      });
    },
    []
  );

  const updateMapViewport = useCallback(
    (
      properties: PropertyCardView[],
      fallbackCenter: TargetPlaceMarker["position"]
    ) => {
      const map = mapRef.current;
      const tmap = window.Tmapv2;

      if (!map || !tmap || typeof map.setCenter !== "function") return;

      const center = getPropertiesCenter(properties, fallbackCenter);
      const zoom = getPropertyViewportZoom(properties, 17);

      map.setCenter(new tmap.LatLng(center.lat, center.lng));

      const zoomableMap = map as TmapMap & {
        setZoom?: (zoom: number) => void;
      };

      if (typeof zoomableMap.setZoom === "function") {
        zoomableMap.setZoom(zoom);
      }
    },
    []
  );

  useEffect(() => {
    targetPlaceMarkerRef.current = targetPlaceMarker;
    renderTargetPlaceMarker(targetPlaceMarker);
  }, [targetPlaceMarker, renderTargetPlaceMarker]);

  const resetMapContainer = useCallback(() => {
    clearInfraMarkers(infraMarkersRef);
    clearSingleMarker(schoolMarkerRef, "학교 마커");
    clearMarkers(propertyMarkersRef, "매물 마커");

    mapRef.current = null;
    isMapInitializedRef.current = false;

    const mapContainer = document.getElementById("map_div");

    if (mapContainer) {
      mapContainer.innerHTML = "";
    }
  }, []);

  const handleChangeListMode = (mode: ListMode) => {
    listModeRef.current = mode;
    hasSearchResultRef.current = true;

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("view", mode);
      params.delete("propertyId");
      return params;
    });
  };

  const handleTogglePropertyMarkers = () => {
    setShowPropertyMarkers((prev) => {
      const next = !prev;

      showPropertyMarkersRef.current = next;

      const nextProperties = hasSearchResult
        ? resolveProperties(listModeRef.current)
        : [];

      renderPropertyMarkers(nextProperties, next);

      return next;
    });
  };

  const handleApplyInfraSearch = (condition: InfraSearchCondition) => {
    if (!mapRef.current) {
      console.warn("지도 로드 전이라 인프라 마커를 생성할 수 없습니다.");
      return;
    }

    loadPoiMarkers({
      map: mapRef.current,
      markersRef: infraMarkersRef,
      condition,
      center: getCurrentMapCenter(mapRef.current, MAP_CENTER),
    });
  };

  const handleClosePropertyModal = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("propertyId");
      return params;
    });
  };

  // 모달에서 하위 화면 진입 시 `replace`로 이동한다.
  // → 모달이 열린 URL(?propertyId)을 히스토리에서 소비하므로, 하위 화면의 뒤로가기가
  //   모달이 다시 열리는 대신 깨끗한 지도(?view=..., 모달 닫힘)로 복귀한다.
  const handleClickPropertyDetail = () => {
    if (!selectedProperty) return;

    const params = new URLSearchParams();

    if (selectedProperty.recommendationId != null) {
      params.set("recommendationId", String(selectedProperty.recommendationId));
    }

    const query = params.toString();

    navigate(
      `/property/${selectedProperty.propertyId}${query ? `?${query}` : ""}`,
      { replace: true }
    );
  };

  const handleClickInfra = () => {
    if (!selectedProperty) {
      navigate("/infra-view", { replace: true });
      return;
    }

    // 인프라 화면은 추천 응답(infrastructures/route)을 쓰므로 recommendationId를 함께 넘긴다.
    const params = new URLSearchParams({
      propertyId: String(selectedProperty.propertyId),
    });

    if (selectedProperty.recommendationId != null) {
      params.set("recommendationId", String(selectedProperty.recommendationId));
    }

    navigate(`/infra-view?${params.toString()}`, { replace: true });
  };

  const handleClick3D = () => {
    navigate(
      selectedProperty
        ? `/3d-view?propertyId=${selectedProperty.propertyId}`
        : "/3d-view",
      { replace: true }
    );
  };

  useEffect(() => {
    renderPropertyMarkers(visibleProperties, showPropertyMarkersRef.current);
  }, [visibleProperties, renderPropertyMarkers]);

  useEffect(() => {
    updateMapViewport(visibleProperties, targetPlaceMarker.position);
  }, [visibleProperties, targetPlaceMarker.position, updateMapViewport]);

  useEffect(() => {
    if (shouldWaitForTargetPlaces) return;

    let timeoutId: number | null = null;
    let cancelled = false;

    const initMap = () => {
      if (cancelled) return;

      const tmap = window.Tmapv2;
      if (!tmap) return;
      if (isMapInitializedRef.current || mapRef.current) return;

      const mapContainer = document.getElementById("map_div");
      if (!mapContainer) return;

      mapContainer.innerHTML = "";
      isMapInitializedRef.current = true;

      const initialProperties = hasSearchResultRef.current
        ? resolveProperties(listModeRef.current)
        : [];

      const initialCenter = getPropertiesCenter(
        initialProperties,
        targetPlaceMarkerRef.current.position
      );

      const initialZoom = getPropertyViewportZoom(initialProperties, 17);

      const map = new tmap.Map("map_div", {
        center: new tmap.LatLng(initialCenter.lat, initialCenter.lng),
        width: "100%",
        height: "100%",
        zoom: initialZoom,
      });

      mapRef.current = map;

      loadSchoolMarker({
        map,
        markerRef: schoolMarkerRef,
        position: targetPlaceMarkerRef.current.position,
        label: targetPlaceMarkerRef.current.label,
      });

      renderPropertyMarkers(initialProperties, showPropertyMarkersRef.current);

      loadPoiMarkers({
        map,
        markersRef: infraMarkersRef,
        condition: DEFAULT_INFRA_CONDITION,
        center: initialCenter,
      });

      console.log("지도 생성 완료");
    };

    const waitForTmap = () => {
      if (cancelled) return;

      if (window.Tmapv2) {
        initMap();
      } else {
        timeoutId = window.setTimeout(waitForTmap, 100);
      }
    };

    waitForTmap();

    return () => {
      cancelled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      resetMapContainer();
    };
  }, [
    renderPropertyMarkers,
    resetMapContainer,
    resolveProperties,
    shouldWaitForTargetPlaces,
  ]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

        <button
          type="button"
          onClick={() => navigate("/my")}
          className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-4 py-3 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm transition hover:bg-background"
        >
          <UserRound className="h-4 w-4" />
          마이페이지
        </button>

        <PropertyListPanel
          listMode={listMode}
          properties={visibleProperties}
          onChangeListMode={handleChangeListMode}
        />

        <InfraSearchWidget onApply={handleApplyInfraSearch} />

        {hasSearchResult && (
          <PropertyMarkerToggle
            enabled={showPropertyMarkers}
            listMode={listMode}
            onToggle={handleTogglePropertyMarkers}
          />
        )}

        <PropertyDetailModal
          isOpen={!!selectedProperty}
          property={selectedProperty}
          onClose={handleClosePropertyModal}
          onClickDetail={handleClickPropertyDetail}
          onClickInfra={handleClickInfra}
          onClick3D={handleClick3D}
        />
      </main>

      <AIPanel />
    </div>
  );
}
