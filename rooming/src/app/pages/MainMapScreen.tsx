import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import AIPanelScreen from "../components/AIPanel";
import PropertyListPanel from "../components/PropertyListPanel";

declare global {
  interface Window {
    Tmapv2: any;
  }
}

export default function MainMapScreen() {
  const navigate = useNavigate();
  const mapInstanceRef = useRef<any>(null);

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

      <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-3 rounded-full border-2 border-[#EEECCA] bg-white px-5 py-3 shadow-xl">
        <FilterButton text="매물 마커" active />
        <FilterButton text="인프라 마커" active />
        <FilterButton text="3D 보기" onClick={() => navigate("/3d-view")} />
        <FilterButton text="인프라 검색" onClick={() => navigate("/infra-search")} />
      </div>
    </div>
  );
}

function FilterButton({
  text,
  active = false,
  onClick,
}: {
  text: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${active
        ? "bg-[#4A4530] text-white shadow-lg shadow-[#4A4530]/30"
        : "bg-[#FDFBD4] text-[#8B8850] hover:bg-[#F5F5E8] hover:text-[#8B89DD]"
        }`}
    >
      {text}
    </button>
  );
}