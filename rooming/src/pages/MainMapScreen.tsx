import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import PropertyListPanel from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";
import AIPanel from "../components/AIPanel";
import PropertyDetailModal from "../components/PropertyDetailModal";
import PropertyMarkerToggle from "../components/PropertyMarkerToggle";

import { properties } from "../data/dummyProperties";
import { createPropertyMarkerHTML } from "../utils/createPropertyMarkerHTML";
import { createSchoolMarkerHTML } from "../utils/createSchoolMarkerHTML";
import {
  clearInfraMarkers,
  loadPoiMarkers,
  type InfraSearchCondition,
} from "../utils/infraPoiMarkers";

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

export default function MainMapScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const mapRef = useRef<any>(null);
  const isMapInitializedRef = useRef(false);

  const infraMarkersRef = useRef<any[]>([]);
  const schoolMarkerRef = useRef<any>(null);
  const propertyMarkersRef = useRef<any[]>([]);

  const setSearchParamsRef = useRef(setSearchParams);

  const [showPropertyMarkers, setShowPropertyMarkers] = useState(true);
  const showPropertyMarkersRef = useRef(true);

  const selectedPropertyId = searchParams.get("propertyId");

  const selectedProperty = properties.find(
    (property) => String(property.id) === selectedPropertyId
  );

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const clearSchoolMarker = useCallback(() => {
    if (!schoolMarkerRef.current) return;

    try {
      schoolMarkerRef.current.setMap(null);
    } catch (error) {
      console.warn("학교 마커 제거 실패:", error);
    }

    schoolMarkerRef.current = null;
  }, []);

  const loadSchoolMarker = useCallback((map: any) => {
    if (!window.Tmapv2 || !map) return;

    if (schoolMarkerRef.current) {
      return;
    }

    schoolMarkerRef.current = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(
        SCHOOL_LOCATION.lat,
        SCHOOL_LOCATION.lng
      ),
      map,
      iconHTML: createSchoolMarkerHTML("성균관대 정문"),
      zIndex: 40,
    });
  }, []);

  const clearPropertyMarkers = useCallback(() => {
    propertyMarkersRef.current.forEach((marker) => {
      try {
        marker.setMap(null);
      } catch (error) {
        console.warn("추천 매물 마커 제거 실패:", error);
      }
    });

    propertyMarkersRef.current = [];
  }, []);

  const loadPropertyMarkers = useCallback(
    (map: any) => {
      if (!window.Tmapv2 || !map) return;

      clearPropertyMarkers();

      properties.slice(0, 3).forEach((property) => {
        const propertyMarker = new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(property.lat, property.lng),
          map,
          title: property.title,
          iconHTML: createPropertyMarkerHTML(property.price),
          zIndex: 30,
        });

        propertyMarker.addListener("click", () => {
          setSearchParamsRef.current({
            propertyId: String(property.id),
          });
        });

        propertyMarkersRef.current.push(propertyMarker);
      });
    },
    [clearPropertyMarkers]
  );

  const resetMapContainer = useCallback(() => {
    clearInfraMarkers(infraMarkersRef);
    clearSchoolMarker();
    clearPropertyMarkers();

    mapRef.current = null;
    isMapInitializedRef.current = false;

    const mapContainer = document.getElementById("map_div");

    if (mapContainer) {
      mapContainer.innerHTML = "";
    }
  }, [clearSchoolMarker, clearPropertyMarkers]);

  const handleTogglePropertyMarkers = () => {
    setShowPropertyMarkers((prev) => {
      const next = !prev;

      showPropertyMarkersRef.current = next;

      if (next) {
        if (!mapRef.current) {
          console.warn("지도 로드 전이라 추천 매물 마커를 표시할 수 없습니다.");
          return next;
        }

        loadPropertyMarkers(mapRef.current);
      } else {
        clearPropertyMarkers();
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
      center: MAP_CENTER,
    });
  };

  useEffect(() => {
    let timeoutId: number | null = null;
    let cancelled = false;

    const initMap = () => {
      if (cancelled) return;
      if (!window.Tmapv2 || !window.Tmapv2.Map) return;

      if (isMapInitializedRef.current || mapRef.current) {
        return;
      }

      const mapContainer = document.getElementById("map_div");

      if (!mapContainer) {
        return;
      }

      mapContainer.innerHTML = "";

      isMapInitializedRef.current = true;

      const map = new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(MAP_CENTER.lat, MAP_CENTER.lng),
        width: "100%",
        height: "100%",
        zoom: 17,
      });

      mapRef.current = map;

      loadSchoolMarker(map);

      if (showPropertyMarkersRef.current) {
        loadPropertyMarkers(map);
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
  }, [loadSchoolMarker, loadPropertyMarkers, resetMapContainer]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FDFCF8]">
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

        <PropertyListPanel />

        <InfraSearchWidget onApply={handleApplyInfraSearch} />

        <PropertyMarkerToggle
          enabled={showPropertyMarkers}
          onToggle={handleTogglePropertyMarkers}
        />

        <PropertyDetailModal
          isOpen={!!selectedProperty}
          property={selectedProperty ?? null}
          onClose={() => setSearchParams({})}
          onClickInfra={() =>
            navigate(`/infra-view?propertyId=${selectedProperty?.id}`)
          }
          onClick3D={() => navigate("/3d-view")}
        />
      </main>

      <AIPanel />
    </div>
  );
}