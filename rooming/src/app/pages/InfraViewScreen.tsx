import { useNavigate } from "react-router";
import { Map, Store, Coffee, Dumbbell, Pill } from "lucide-react";

export default function InfraViewScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-[#FDFCF8]">
      {/* 지도 영역 */}
      <div className="h-full w-full bg-gradient-to-br from-[#E8E6DD]/20 to-[#D8D7F5]/20 flex items-center justify-center">
        <div className="text-center">
          <Map className="mx-auto mb-2 h-12 w-12 text-[#6B6847]" />
          <div className="text-lg font-semibold text-[#4A4530]">인프라 지도 영역</div>
          <div className="mt-1 text-sm text-[#8B8850]">선택한 인프라가 지도에 표시됩니다</div>
        </div>
      </div>

      {/* 좌측 하단 인프라 정보 패널 */}
      <div className="absolute bottom-6 left-6 z-10 w-[380px] rounded-2xl border border-[#E8E6DD] bg-white/95 backdrop-blur-sm p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-[#4A4530]">생활권 인프라</h3>

        <div className="mb-5 rounded-xl bg-[#FDFCF8] p-4 border border-[#F0EFE8]">
          <div className="mb-2 text-sm font-semibold text-[#8B8850]">선택한 매물 기준</div>
          <div className="text-base font-bold text-[#6B6847]">성대 정문 도보권 원룸</div>
          <div className="mt-1 text-sm text-[#8B8850]">보증금 500 / 월세 55</div>
        </div>

        <div className="space-y-3">
          <InfraItem Icon={Store} category="편의점" count={3} distance="도보 2분" color="bg-[#F8F8FF] text-[#5A58AA] border-[#E8E7FF]" />
          <InfraItem Icon={Coffee} category="카페" count={5} distance="도보 5분" color="bg-[#F8F8FF] text-[#5A58AA] border-[#E8E7FF]" />
          <InfraItem Icon={Dumbbell} category="헬스장" count={1} distance="도보 3분" color="bg-[#F8F8FF] text-[#5A58AA] border-[#E8E7FF]" />
          <InfraItem Icon={Pill} category="약국" count={2} distance="도보 7분" color="bg-[#FFF8FF] text-[#8E3BA8] border-[#F0E5FF]" />
        </div>

        <button
          onClick={() => navigate("/property-detail")}
          className="mt-5 w-full rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm font-semibold text-[#6B6847] hover:bg-[#FDFCF8] transition-all"
        >
          매물 상세로 돌아가기
        </button>
      </div>

      {/* 우측 상단 필터 */}
      <div className="absolute right-6 top-6 z-10 rounded-2xl border border-[#E8E6DD] bg-white/95 backdrop-blur-sm p-5 shadow-lg">
        <h4 className="mb-3 text-sm font-bold text-[#4A4530]">인프라 필터</h4>
        <div className="space-y-2">
          <FilterToggle label="편의점" active />
          <FilterToggle label="카페" active />
          <FilterToggle label="헬스장" active />
          <FilterToggle label="약국" />
        </div>
      </div>
    </div>
  );
}

function InfraItem({
  Icon,
  category,
  count,
  distance,
  color,
}: {
  Icon: React.ElementType;
  category: string;
  count: number;
  distance: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#FDFBD4] p-3 border border-[#EEECCA]">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#6B6847]" />
        <div>
          <div className="text-sm font-semibold text-[#6B6847]">{category}</div>
          <div className="text-xs text-[#8B8850]">{count}개 시설</div>
        </div>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-medium border ${color}`}>
        {distance}
      </span>
    </div>
  );
}

function FilterToggle({ label, active }: { label: string; active: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" defaultChecked={active} className="h-4 w-4 rounded accent-[#BDB96A]" />
      <span className="text-lg">{label}</span>
    </label>
  );
}