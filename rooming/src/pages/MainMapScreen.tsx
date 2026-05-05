import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import PropertyListPanel, {
  type ListMode,
  type PropertyListItem,
} from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";
import AIPanel from "../components/AIPanel";
import PropertyDetailModal from "../components/PropertyDetailModal";
import PropertyMarkerToggle from "../components/PropertyMarkerToggle";

import { properties as dummyProperties } from "../data/dummyProperties";
import { favoriteListDummyData } from "../data/dummyFavorites";
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

type MapCenter = {
  lat: number;
  lng: number;
};

function getLatFromTmapCenter(center: any): number | null {
  if (!center) return null;

  if (typeof center.lat === "function") {
    return Number(center.lat());
  }

  if (typeof center.lat === "number") {
    return center.lat;
  }

  if (typeof center.getLat === "function") {
    return Number(center.getLat());
  }

  if (typeof center._lat === "number") {
    return center._lat;
  }

  return null;
}

function getLngFromTmapCenter(center: any): number | null {
  if (!center) return null;

  if (typeof center.lng === "function") {
    return Number(center.lng());
  }

  if (typeof center.lng === "number") {
    return center.lng;
  }

  if (typeof center.getLng === "function") {
    return Number(center.getLng());
  }

  if (typeof center._lng === "number") {
    return center._lng;
  }

  return null;
}

function formatPriceToManwon(value: number) {
  return `${Math.floor(value / 10000)}`;
}

function getRecommendedProperties(): PropertyListItem[] {
  return dummyProperties.slice(0, 3).map((property) => ({
    id: property.id,
    title: property.title,
    price: property.price,
    description: property.description,
    area: property.area,
    distance: property.distance,
    lat: property.lat,
    lng: property.lng,
    mode: "recommended",
  }));
}

function getFavoriteProperties(): PropertyListItem[] {
  return favoriteListDummyData.data.slice(0, 3).map((favorite) => {
    const { snapshot } = favorite;

    const depositText = formatPriceToManwon(snapshot.price.depositAmount);
    const monthlyRentText = formatPriceToManwon(snapshot.price.monthlyRent);

    return {
      id: snapshot.propertyId,
      title: snapshot.title,
      price: `${depositText} / ${monthlyRentText}`,
      description: snapshot.matchReasons.join(" · "),
      area: `${snapshot.areaM2}㎡`,
      distance:
        snapshot.keyPlaceRoutes[0]?.routeJson.totalTime !== undefined
          ? `${snapshot.keyPlaceRoutes[0].routeJson.totalTime}분`
          : undefined,
      lat: snapshot.location.latitude,
      lng: snapshot.location.longitude,
      mode: "favorites",
      matchScore: snapshot.matchScore,
    };
  });
}

function getPropertiesByListMode(listMode: ListMode): PropertyListItem[] {
  if (listMode === "recommended") {
    return getRecommendedProperties();
  }

  return getFavoriteProperties();
}

export default function MainMapScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const mapRef = useRef<any>(null);
  const isMapInitializedRef = useRef(false);

  const infraMarkersRef = useRef<any[]>([]);
  const schoolMarkerRef = useRef<any>(null);
  const propertyMarkersRef = useRef<any[]>([]);

  const setSearchParamsRef = useRef(setSearchParams);

  const [listMode, setListMode] = useState<ListMode>("recommended");
  const listModeRef = useRef<ListMode>("recommended");

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

  const getCurrentMapCenter = useCallback((): MapCenter => {
    const map = mapRef.current;

    if (!map || typeof map.getCenter !== "function") {
      return MAP_CENTER;
    }

    const center = map.getCenter();

    const lat = getLatFromTmapCenter(center);
    const lng = getLngFromTmapCenter(center);

    if (
      lat === null ||
      lng === null ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      console.warn("현재 지도 중심 좌표를 읽지 못해 기본 중심 좌표를 사용합니다.");
      return MAP_CENTER;
    }

    return { lat, lng };
  }, []);

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
        console.warn("매물 마커 제거 실패:", error);
      }
    });

    propertyMarkersRef.current = [];
  }, []);

  const loadPropertyMarkers = useCallback(
    (map: any, properties: PropertyListItem[]) => {
      if (!window.Tmapv2 || !map) return;

      clearPropertyMarkers();

      properties.forEach((property) => {
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

  const handleChangeListMode = (mode: ListMode) => {
    const nextProperties = getPropertiesByListMode(mode);

    setListMode(mode);
    listModeRef.current = mode;
    setSearchParams({});

    if (!showPropertyMarkersRef.current) return;
    if (!mapRef.current) return;

    loadPropertyMarkers(mapRef.current, nextProperties);
  };

  const handleTogglePropertyMarkers = () => {
    setShowPropertyMarkers((prev) => {
      const next = !prev;

      showPropertyMarkersRef.current = next;

      if (next) {
        if (!mapRef.current) {
          console.warn("지도 로드 전이라 매물 마커를 표시할 수 없습니다.");
          return next;
        }

        const nextProperties = getPropertiesByListMode(listModeRef.current);
        loadPropertyMarkers(mapRef.current, nextProperties);
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

    const currentCenter = getCurrentMapCenter();

    loadPoiMarkers({
      map: mapRef.current,
      markersRef: infraMarkersRef,
      condition,
      center: currentCenter,
    });
  };

  const handleClosePropertyModal = () => {
    setSearchParams({});
  };

  const handleClickPropertyDetail = () => {
    if (!selectedProperty) return;

    navigate(`/property/${selectedProperty.id}`);
  };

  const handleClickInfra = () => {
    if (!selectedProperty) {
      navigate("/infra-view");
      return;
    }

    navigate(`/infra-view?propertyId=${selectedProperty.id}`);
  };

  const handleClick3D = () => {
    if (!selectedProperty) {
      navigate("/3d-view");
      return;
    }

    navigate(`/3d-view?propertyId=${selectedProperty.id}`);
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
        loadPropertyMarkers(map, currentProperties);
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
  }, [currentProperties, loadSchoolMarker, loadPropertyMarkers, resetMapContainer]);

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