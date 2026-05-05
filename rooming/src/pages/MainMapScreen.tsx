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
  getPropertiesByListMode,
  type ListMode,
} from "../utils/propertyListItems";

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

  const [showPropertyMarkers, setShowPropertyMarkers] = useState(true);
  const showPropertyMarkersRef = useRef(true);

  const currentProperties = useMemo(
    () => getPropertiesByListMode(listMode),
    [listMode]
  );

  const selectedPropertyId = searchParams.get("propertyId");

  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;

    return (
      currentProperties.find(
        (property) => String(property.id) === selectedPropertyId
      ) ?? null
    );
  }, [currentProperties, selectedPropertyId]);

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  useEffect(() => {
    listModeRef.current = listMode;
  }, [listMode]);

  const renderPropertyMarkers = useCallback(
    (properties = currentProperties) => {
      if (!mapRef.current) return;

      loadPropertyMarkers({
        map: mapRef.current,
        properties,
        markersRef: propertyMarkersRef,
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
    [currentProperties]
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
    const nextProperties = getPropertiesByListMode(mode);

    listModeRef.current = mode;

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("mode", mode);
      params.delete("propertyId");
      return params;
    });

    if (showPropertyMarkersRef.current) {
      renderPropertyMarkers(nextProperties);
    }
  };

  const handleTogglePropertyMarkers = () => {
    setShowPropertyMarkers((prev) => {
      const next = !prev;
      showPropertyMarkersRef.current = next;

      if (next) {
        renderPropertyMarkers(getPropertiesByListMode(listModeRef.current));
      } else {
        clearMarkers(propertyMarkersRef, "매물 마커");
      }

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
    navigate(`/property/${selectedProperty.id}`);
  };

  const handleClickInfra = () => {
    navigate(
      selectedProperty
        ? `/infra-view?propertyId=${selectedProperty.id}`
        : "/infra-view"
    );
  };

  const handleClick3D = () => {
    navigate(
      selectedProperty
        ? `/3d-view?propertyId=${selectedProperty.id}`
        : "/3d-view"
    );
  };

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

      if (showPropertyMarkersRef.current) {
        renderPropertyMarkers(currentProperties);
      }

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
  }, [currentProperties, renderPropertyMarkers, resetMapContainer]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FDFCF8]">
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

        <PropertyListPanel
          listMode={listMode}
          properties={currentProperties}
          onChangeListMode={handleChangeListMode}
        />

        <InfraSearchWidget onApply={handleApplyInfraSearch} />

        <PropertyMarkerToggle
          enabled={showPropertyMarkers}
          onToggle={handleTogglePropertyMarkers}
        />

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