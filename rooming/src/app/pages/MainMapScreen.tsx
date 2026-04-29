import { useState } from "react";
import { useNavigate } from "react-router";
import { Map } from "lucide-react";

export default function MainMapScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("정문에서 15분 이내, 헬스장 가까운 원룸");

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

      {/* 좌측 검색 결과 패널 */}
      <div className="absolute bottom-6 left-6 z-10 w-[320px] rounded-2xl border border-[#E8E6DD] bg-white/95 backdrop-blur-sm p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#4A4530]">추천 매물</h3>
          <button
            onClick={() => navigate("/results")}
            className="text-sm font-medium text-[#8B89DD] hover:text-[#6B67BB]"
          >
            전체보기
          </button>
        </div>

        <div className="space-y-3">
          <PropertyCard title="성대 정문 도보권 원룸" price="500 / 55" distance="도보 12분" />
          <PropertyCard title="혜화역 인근 투룸" price="1000 / 70" distance="도보 15분" />
        </div>

        <div className="mt-5 rounded-xl bg-[#F8F8FF] p-4 border border-[#E8E7FF]">
          <div className="mb-3 text-sm font-semibold text-[#5A58AA]">이전 조건 요약</div>
          <div className="space-y-2 text-sm text-[#5A58AA]">
            <div>• 통학 15분 이내</div>
            <div>• 헬스장 선호</div>
            <div>• 원룸</div>
          </div>
        </div>
      </div>

      {/* 우측 AI 검색 패널 */}
      <div className="absolute right-6 top-6 z-10 w-[340px] rounded-2xl border border-[#E8E6DD] bg-white/95 backdrop-blur-sm p-5 shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-[#4A4530]">AI 검색</h3>
        <input
          type="text"
          placeholder="자연어로 조건을 입력하세요..."
          className="w-full rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm text-[#6B6847] placeholder-[#B8B69F] focus:border-[#BDB96A] focus:outline-none focus:ring-2 focus:ring-[#BDB96A]/10"
        />
        <button
          onClick={() => navigate("/ai-search")}
          className="mt-3 w-full rounded-xl bg-[#4A4530] px-4 py-3 text-sm font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg"
        >
          AI 검색하기
        </button>
      </div>

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

function MapPin({ className, label }: { className: string; label: string }) {
  return (
    <div
      className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-bold shadow-xl ${className}`}
    >
      {label}
    </div>
  );
}

function PropertyCard({
  title,
  price,
  distance,
}: {
  title: string;
  price: string;
  distance: string;
}) {
  return (
    <button
      className="w-full rounded-2xl border-2 border-[#EEECCA] bg-white p-4 text-left transition hover:border-[#C1BFFF] hover:bg-[#F5F5FF] shadow-sm"
    >
      <div className="font-semibold text-[#6B6847]">{title}</div>
      <div className="mt-1 text-sm text-[#BDB96A] font-medium">{price}</div>
      <div className="mt-1 text-xs text-[#8B8850]">{distance}</div>
    </button>
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