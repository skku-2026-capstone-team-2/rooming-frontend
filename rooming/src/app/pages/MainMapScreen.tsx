import { useEffect } from "react";
import PropertyListPanel from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";
import AIPanel from "../components/AIPanel";

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

      new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(37.5882, 126.9936),
        width: "100%",
        height: "100%",
        zoom: 15,
      });

      console.log("지도 생성 완료");
    };

    waitForTmap();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FDFCF8]">
      {/* 왼쪽 지도 영역 */}
      <main className="relative h-full flex-1 overflow-hidden">
        <div id="map_div" className="h-full w-full" />

        {/* 지도 위에 필요한 요소만 플로팅 */}
        <PropertyListPanel />
        <InfraSearchWidget />
      </main>

      <AIPanel />
    </div>
  );
}