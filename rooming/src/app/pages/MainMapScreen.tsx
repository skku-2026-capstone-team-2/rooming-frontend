// import { useState } from "react";
import { useNavigate } from "react-router";
import { Map } from "lucide-react";
import AIPanelScreen from "../components/AIPanel";
import PropertyListPanel from "../components/PropertyListPanel";

export default function MainMapScreen() {
  const navigate = useNavigate();
  // const [searchQuery, setSearchQuery] = useState("정문에서 15분 이내, 헬스장 가까운 원룸");

  return (
    <div className="relative h-screen w-full bg-[#FDFCF8]">
      {/* 지도 영역 */}
      <div className="h-full w-full bg-gradient-to-br from-[#E8E6DD]/20 to-[#D8D7F5]/20 flex items-center justify-center">
        <div className="text-center">
          <Map className="mx-auto mb-2 h-12 w-12 text-[#6B6847]" />
          <div className="text-lg font-semibold text-[#4A4530]">지도 영역</div>
          <div className="mt-1 text-sm text-[#8B8850]">실제로는 인터랙티브 지도가 표시됩니다</div>
        </div>
      </div>

      {/* 좌측 하단 검색 결과 패널 */}
      <PropertyListPanel />

      {/* 우측 AI 검색 패널 */}
      <AIPanelScreen />

      {/* 하단 컨트롤 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 rounded-full bg-white px-5 py-3 shadow-xl border-2 border-[#EEECCA]">
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