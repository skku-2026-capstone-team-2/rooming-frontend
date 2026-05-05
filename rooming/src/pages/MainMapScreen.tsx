import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PropertyListPanel from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";
import AIPanel from "../components/AIPanel";
import PropertyDetailModal from "../components/PropertyDetailModal";

import { properties } from "../data/dummyProperties";
import { infraPlaces } from "../data/dummyInfraPlaces";
import { createPropertyMarkerHTML } from "../utils/createPropertyMarkerHTML";
import { createInfraMarkerHTML } from "../utils/createInfraMarkerHTML";
import { createSchoolMarkerHTML } from "../utils/createSchoolMarkerHTML";

declare global {
  interface Window {
    Tmapv2: any;
  }
}

export default function MainMapScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPropertyId = searchParams.get("propertyId");

  const selectedProperty = properties.find(
    (property) => String(property.id) === selectedPropertyId
  );

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
        center: new window.Tmapv2.LatLng(37.5882, 126.9936),
        width: "100%",
        height: "100%",
        zoom: 17,
      });

      // 학교 마커
      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(37.5888, 126.9926),
        map,
        iconHTML: createSchoolMarkerHTML("성균관대 경영관"),
      });

      // 상위 3개 추천 매물 마커
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

      // 인프라 마커
      infraPlaces.forEach((place) => {
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(place.lat, place.lng),
          map,
          iconHTML: createInfraMarkerHTML({
            label: place.label,
            type: place.type,
          }),
          zIndex: 10,
        });
      });

      console.log("지도 생성 완료");
    };

    waitForTmap();
  }, [setSearchParams]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FDFCF8]">
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

        <PropertyListPanel />
        <InfraSearchWidget />

        <PropertyDetailModal
          isOpen={!!selectedProperty}
          property={selectedProperty ?? null}
          onClose={() => setSearchParams({})}
          onClickInfra={() => navigate(`/infra-view?propertyId=${selectedProperty?.id}`)}
          onClick3D={() => navigate("/3d-view")}
        />
      </main>

      <AIPanel />
    </div>
  );
}