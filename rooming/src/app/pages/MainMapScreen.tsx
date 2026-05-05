import { useEffect } from "react";
import AIPanelScreen from "../components/AIPanel";
import PropertyListPanel from "../components/PropertyListPanel";
import InfraSearchWidget from "../components/InfraSearchWidget";

declare global {
  interface Window {
    Tmapv2: any;
  }
}

export default function MainMapScreen() {
  // const navigate = useNavigate();
  // const mapInstanceRef = useRef<any>(null);

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
    <div className="relative h-screen w-full overflow-hidden bg-[#FDFCF8]">
      <div id="map_div" className="absolute inset-0 h-full w-full" />

      <PropertyListPanel />
      <AIPanelScreen />
      <InfraSearchWidget />

    </div>
  );
}
