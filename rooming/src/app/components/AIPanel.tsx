import { useState } from "react";
import { useNavigate } from "react-router";
import { Lightbulb } from "lucide-react";

export default function AIPanel() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <aside className="absolute bottom-6 right-6 top-6 z-20 flex w-[380px] flex-col rounded-3xl border border-[#E8E6DD] bg-white/95 px-5 py-5 shadow-xl backdrop-blur-sm">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-[#4A4530]">AI 자연어 검색</h2>
        <p className="mt-2 text-sm leading-6 text-[#6B6847]">
          원하는 조건을 자연어로 입력하면 AI가 최적의 매물을 추천합니다
        </p>
      </div>

      <div className="mt-auto min-h-0 space-y-4 overflow-y-auto pr-1">
        <div className="rounded-2xl border border-[#E8E6DD] bg-[#FDFCF8] p-4">
          <div className="mb-3 text-base font-semibold text-[#4A4530]">
            자연어 입력
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예시: 성균관대 정문에서 도보 15분 이내, 헬스장이랑 편의점 가까운 원룸, 월세 60 이하"
            className="w-full resize-none rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm leading-6 text-[#6B6847] placeholder-[#B8B69F] focus:border-[#BDB96A] focus:outline-none focus:ring-2 focus:ring-[#BDB96A]/10"
            rows={4}
          />

          <button
            onClick={() => navigate("/results")}
            className="mt-3 w-full rounded-xl bg-[#4A4530] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#3A3520] hover:shadow-lg"
          >
            검색하기
          </button>
        </div>

        <div className="rounded-2xl border border-[#E8E6DD] bg-white p-4 shadow-sm">
          <div className="mb-3 text-base font-semibold text-[#4A4530]">
            이전 조건 요약
          </div>
          <div className="space-y-2">
            <ConditionItem text="학교 정문 기준" color="tan" />
            <ConditionItem text="도보 15분 이내" color="tan" />
            <ConditionItem text="헬스장, 편의점 선호" color="tan" />
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8D7F5] bg-white p-4 shadow-sm">
          <div className="mb-3 text-base font-semibold text-[#5A58AA]">
            추천 장소
          </div>
          <div className="space-y-2">
            <ConditionItem text="캠퍼스 근처 카페 거리" color="lavender" />
            <ConditionItem text="도서관 인접 구역" color="lavender" />
            <ConditionItem text="헬스장 밀집 구역" color="lavender" />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8DBFF] bg-[#FCFAFF] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8E3BA8]">
            <Lightbulb className="h-4 w-4" />
            검색 팁
          </div>
          <ul className="space-y-1 text-sm leading-5 text-[#8E3BA8]">
            <li>• 구체적인 거리와 시간을 입력하면 더 정확해요</li>
            <li>• 여러 조건을 한 번에 입력해도 괜찮아요</li>
            <li>• ~~~ 실제 AI 구현에 따라 가이드 수정 ~~~</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

function ConditionItem({
  text,
  color,
}: {
  text: string;
  color: "tan" | "lavender";
}) {
  const colorClasses = {
    tan: "bg-[#FDFCF8] text-[#8B8850] border-[#F0EFE8]",
    lavender: "bg-[#F8F8FF] text-[#5A58AA] border-[#E8E7FF]",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-2 text-sm ${colorClasses[color]}`}
    >
      {text}
    </div>
  );
}