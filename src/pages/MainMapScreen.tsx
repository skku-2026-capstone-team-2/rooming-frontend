import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

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
  loadPropertyMarkers,
  loadSchoolMarker,
} from "../utils/tmapMarkerUtils";
import type { ListMode } from "../utils/propertyListItems";
import { loadSearchRequest } from "../utils/recommendationSearch";
import {
  useFavorites,
  useRecommendationSearch,
} from "../hooks/queries/recommendationQueries";
import { mapRecommendationToCardView } from "../api/mappers/recommendationMapper";
import type { PropertyCardView } from "../types";

const MAP_CENTER = {
  lat: 37.5882,
  lng: 126.9936,
};

const SCHOOL_LOCATION = {
  lat: 37.5849,
  lng: 126.9953,
};

const DEFAULT_INFRA_CONDITION: InfraSearchCondition = {
  categories: [],
  radius: 500,
  customKeyword: "",
};

/** 지도가 무엇을 보여줄지. `view`가 없으면(검색 전) 아무것도 노출하지 않는다. */
function getValidView(value: string | null): ListMode | null {
  if (value === "recommended") return "recommended";
  if (value === "favorites") return "favorites";
  return null;
}

export default function MainMapScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const mapRef = useRef<any>(null);
  const isMapInitializedRef = useRef(false);

  const infraMarkersRef = useRef<any[]>([]);
  const schoolMarkerRef = useRef<any | null>(null);
  const propertyMarkersRef = useRef<any[]>([]);

  const setSearchParamsRef = useRef(setSearchParams);

  // view 없음(null) = 검색 전 빈 상태, "recommended"/"favorites" = 해당 목록 노출.
  // (검색 완료 여부를 sessionStorage 플래그 대신 URL로 표현 → 새로고침/딥링크 안전)
  const view = getValidView(searchParams.get("view"));
  const hasSearchResult = view !== null;
  const listMode: ListMode = view ?? "recommended";
  const listModeRef = useRef<ListMode>(listMode);
  const hasSearchResultRef = useRef(hasSearchResult);

  const [showPropertyMarkers, setShowPropertyMarkers] = useState(true);
  const showPropertyMarkersRef = useRef(true);

  // 지도 "추천" 목록은 AI 검색 결과(mock recommendation API)에서 가져온다.
  // 저장된 검색 요청을 키로 추천 결과 화면과 React Query 캐시를 공유한다.
  const searchRequest = useMemo(() => loadSearchRequest(), []);
  const { data: recommendationData } = useRecommendationSearch(searchRequest);
  const recommendedProperties = useMemo<PropertyCardView[]>(
    () => (recommendationData?.results ?? []).map(mapRecommendationToCardView),
    [recommendationData]
  );
  const recommendedPropertiesRef = useRef<PropertyCardView[]>([]);

  // 찜(MY) 매물은 favorites 쿼리를 단일 출처로 사용한다.
  // (토글 mutation 연동은 #30)
  const { data: favoriteData } = useFavorites();
  const favoriteProperties = useMemo(
    () => favoriteData ?? [],
    [favoriteData]
  );
  const favoritePropertiesRef = useRef<PropertyCardView[]>([]);

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

  // imperative 지도 init 코드가 최신 노출 여부를 읽도록 ref에 동기화한다.
  useEffect(() => {
    hasSearchResultRef.current = hasSearchResult;
  }, [hasSearchResult]);

  // imperative 마커 코드가 최신 목록을 읽도록 query 결과를 ref에 동기화한다.
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
      properties = visibleProperties,
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
    [visibleProperties]
  );

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

    renderPropertyMarkers(
      resolveProperties(mode),
      showPropertyMarkersRef.current
    );
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

  const handleClickPropertyDetail = () => {
    if (!selectedProperty) return;
    navigate(`/property/${selectedProperty.propertyId}`);
  };

  const handleClickInfra = () => {
    if (!selectedProperty) {
      navigate("/infra-view");
      return;
    }

    // 인프라 화면은 추천 응답(infrastructures/route)을 쓰므로 recommendationId를 함께 넘긴다.
    const params = new URLSearchParams({
      propertyId: String(selectedProperty.propertyId),
    });
    if (selectedProperty.recommendationId != null) {
      params.set("recommendationId", String(selectedProperty.recommendationId));
    }
    navigate(`/infra-view?${params.toString()}`);
  };

  const handleClick3D = () => {
    navigate(
      selectedProperty
        ? `/3d-view?propertyId=${selectedProperty.propertyId}`
        : "/3d-view"
    );
  };

  useEffect(() => {
    renderPropertyMarkers(visibleProperties, showPropertyMarkersRef.current);
  }, [visibleProperties, renderPropertyMarkers]);

  useEffect(() => {
    let timeoutId: number | null = null;
    let cancelled = false;

    const initMap = () => {
      if (cancelled) return;
      if (!window.Tmapv2 || !window.Tmapv2.Map) return;
      if (isMapInitializedRef.current || mapRef.current) return;

      const mapContainer = document.getElementById("map_div");
      if (!mapContainer) return;

      mapContainer.innerHTML = "";
      isMapInitializedRef.current = true;

      const map = new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(MAP_CENTER.lat, MAP_CENTER.lng),
        width: "100%",
        height: "100%",
        zoom: 17,
      });

      mapRef.current = map;

      loadSchoolMarker({
        map,
        markerRef: schoolMarkerRef,
        position: SCHOOL_LOCATION,
        label: "성균관대 정문",
      });

      const initialProperties = hasSearchResultRef.current
        ? resolveProperties(listModeRef.current)
        : [];

      renderPropertyMarkers(initialProperties, showPropertyMarkersRef.current);

      loadPoiMarkers({
        map,
        markersRef: infraMarkersRef,
        condition: DEFAULT_INFRA_CONDITION,
        center: MAP_CENTER,
      });

      console.log("지도 생성 완료");
    };

    const waitForTmap = () => {
      if (cancelled) return;

      if (window.Tmapv2 && window.Tmapv2.Map) {
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
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

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