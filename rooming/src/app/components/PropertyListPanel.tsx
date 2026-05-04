import { useNavigate } from "react-router";

export default function PropertyListPanel() {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-5 left-5 z-10 w-[260px] rounded-2xl border border-[#E8E6DD] bg-white/95 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#4A4530]">매물 목록</h3>
        <button
          onClick={() => navigate("/results")}
          className="text-xs font-medium text-[#8B89DD] hover:text-[#6B67BB]"
        >
          전체보기
        </button>
      </div>

      <div className="space-y-2.5">
        <PropertyCard
          title="성대 정문 도보권 원룸"
          price="500 / 55"
          distance="도보 12분"
        />
        <PropertyCard
          title="혜화역 인근 투룸"
          price="1000 / 70"
          distance="도보 15분"
        />
      </div>

      <div className="mt-4 rounded-xl border border-[#E8E7FF] bg-[#F8F8FF] p-3">
        <div className="mb-2 text-xs font-semibold text-[#5A58AA]">
          최근 저장 조건
        </div>
        <div className="space-y-1.5 text-xs text-[#5A58AA]">
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
    <button className="w-full rounded-xl border border-[#EEECCA] bg-white p-3 text-left shadow-sm transition hover:border-[#C1BFFF] hover:bg-[#F5F5FF]">
      <div className="text-sm font-semibold text-[#6B6847]">{title}</div>
      <div className="mt-0.5 text-xs font-medium text-[#BDB96A]">{price}</div>
      <div className="mt-0.5 text-[11px] text-[#8B8850]">{distance}</div>
    </button>
  );
}