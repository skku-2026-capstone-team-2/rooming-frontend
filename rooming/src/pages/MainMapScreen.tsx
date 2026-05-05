import { useEffect } from "react";
import PropertyListPanel from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";
import AIPanel from "../components/AIPanel";
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
        // title: "성균관대 경영관",
        iconHTML: createSchoolMarkerHTML("성균관대 경영관"),
      });

      // 상위 3개 추천 매물 마커
      properties.slice(0, 3).forEach((property) => {
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(property.lat, property.lng),
          map,
          title: property.title,
          iconHTML: createPropertyMarkerHTML(property.price),
        });
      });

      // 인프라 마커
      infraPlaces.forEach((place) => {
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(place.lat, place.lng),
          map,
          // title: place.label,
          iconHTML: createInfraMarkerHTML({
            label: place.label,
            type: place.type,
          }),
        });
      });

      console.log("지도 생성 완료");
    };

    waitForTmap();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FDFCF8]">
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

        <PropertyListPanel />
        <InfraSearchWidget />
      </main>

      <AIPanel />
    </div>
  );
}