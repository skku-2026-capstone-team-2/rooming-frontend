import { useNavigate } from "react-router";

export default function PropertyListPanel() {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-6 left-6 z-10 w-[320px] rounded-2xl border border-[#E8E6DD] bg-white/95 p-5 shadow-lg backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#4A4530]">매물 목록</h3>
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

      <div className="mt-5 rounded-xl border border-[#E8E7FF] bg-[#F8F8FF] p-4">
        <div className="mb-3 text-sm font-semibold text-[#5A58AA]">
          최근 저장 조건
        </div>
        <div className="space-y-2 text-sm text-[#5A58AA]">
          <div>• 통학 15분 이내</div>
          <div>• 헬스장 선호</div>
          <div>• 원룸</div>
        </div>
      </div>
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
    <button className="w-full rounded-2xl border-2 border-[#EEECCA] bg-white p-4 text-left shadow-sm transition hover:border-[#C1BFFF] hover:bg-[#F5F5FF]">
      <div className="font-semibold text-[#6B6847]">{title}</div>
      <div className="mt-1 text-sm font-medium text-[#BDB96A]">{price}</div>
      <div className="mt-1 text-xs text-[#8B8850]">{distance}</div>
    </button>
  );
}