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
import {
  getFavoriteProperties,
  type ListMode,
} from "../utils/propertyListItems";
import { useProperties } from "../hooks/queries/propertyQueries";
import type { PropertyCardView } from "../types";

const AI_SEARCH_COMPLETED_KEY = "rooming_ai_search_completed";

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

function getValidListMode(value: string | null): ListMode {
  if (value === "favorites") return "favorites";
  return "recommended";
}

function getIsAISearchCompleted() {
  return sessionStorage.getItem(AI_SEARCH_COMPLETED_KEY) === "true";
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

  const listMode = getValidListMode(searchParams.get("mode"));
  const listModeRef = useRef<ListMode>(listMode);

  const [hasSearchResult, setHasSearchResult] = useState(false);

  const [showPropertyMarkers, setShowPropertyMarkers] = useState(true);
  const showPropertyMarkersRef = useRef(true);

  // 지도 전체(추천) 매물은 property API에서 React Query로 로드/캐싱한다.
  const { data: recommendedProperties = [] } = useProperties();
  const recommendedPropertiesRef = useRef<PropertyCardView[]>([]);

  // 찜(MY) 매물은 recommendation 도메인이라 후속 이슈에서 API 연동 (현재 더미).
  const favoriteProperties = useMemo(() => getFavoriteProperties(), []);
  const favoritePropertiesRef = useRef<PropertyCardView[]>(favoriteProperties);

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

  useEffect(() => {
    const isCompleted = getIsAISearchCompleted();
    setHasSearchResult(isCompleted);
  }, []);

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
            params.set("mode", listModeRef.current);
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
    const nextProperties = hasSearchResult ? resolveProperties(mode) : [];

    listModeRef.current = mode;

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("mode", mode);
      params.delete("propertyId");
      return params;
    });

    renderPropertyMarkers(nextProperties, showPropertyMarkersRef.current);
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
    navigate(
      selectedProperty
        ? `/infra-view?propertyId=${selectedProperty.propertyId}`
        : "/infra-view"
    );
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

      const isCompleted = getIsAISearchCompleted();
      const initialProperties = isCompleted
        ? resolveProperties(listModeRef.current)
        : [];

      setHasSearchResult(isCompleted);
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