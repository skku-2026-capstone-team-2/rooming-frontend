import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PropertyListPanel from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";
import AIPanel from "../components/AIPanel";
import PropertyDetailModal from "../components/PropertyDetailModal";

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
  const infraMarkersRef = useRef<any[]>([]);

  const selectedPropertyId = searchParams.get("propertyId");

  const selectedProperty = properties.find(
    (property) => String(property.id) === selectedPropertyId
  );

  const handleApplyInfraSearch = (condition: InfraSearchCondition) => {
    loadPoiMarkers({
      map: mapRef.current,
      markersRef: infraMarkersRef,
      condition,
      center: MAP_CENTER,
    });
  };

  useEffect(() => {
    const waitForTmap = () => {
      if (window.Tmapv2 && window.Tmapv2.Map) {
        initMap();
      } else {
        setTimeout(waitForTmap, 100);
      }
    };

    const initMap = () => {
      if (!window.Tmapv2) return;

      const map = new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(MAP_CENTER.lat, MAP_CENTER.lng),
        width: "100%",
        height: "100%",
        zoom: 17,
      });

      mapRef.current = map;

      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(
          SCHOOL_LOCATION.lat,
          SCHOOL_LOCATION.lng
        ),
        map,
        iconHTML: createSchoolMarkerHTML("성균관대 정문"),
        zIndex: 40,
      });

      properties.slice(0, 3).forEach((property) => {
        const marker = new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(property.lat, property.lng),
          map,
          title: property.title,
          iconHTML: createPropertyMarkerHTML(property.price),
          zIndex: 30,
        });

        marker.addListener("click", () => {
          setSearchParams({ propertyId: String(property.id) });
        });
      });

      loadPoiMarkers({
        map,
        markersRef: infraMarkersRef,
        condition: DEFAULT_INFRA_CONDITION,
        center: MAP_CENTER,
      });

      console.log("지도 생성 완료");
    };

    waitForTmap();

    return () => {
      clearInfraMarkers(infraMarkersRef);
    };
  }, [setSearchParams]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FDFCF8]">
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

        <PropertyListPanel />

        <InfraSearchWidget onApply={handleApplyInfraSearch} />

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