import { useState } from "react";
import { useNavigate } from "react-router";
import { Lightbulb } from "lucide-react";

export default function AIPanelScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4A4530]">AI 자연어 검색</h1>
          <p className="mt-2 text-[#6B6847]">원하는 조건을 자연어로 입력하면 AI가 최적의 매물을 추천합니다</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-semibold text-[#4A4530]">자연어 입력</div>
            <textarea
              placeholder="예시: 성균관대 정문에서 도보 15분 이내, 헬스장이랑 편의점 가까운 원룸, 월세 60 이하"
              className="w-full rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm leading-6 text-[#6B6847] placeholder-[#B8B69F] focus:border-[#BDB96A] focus:outline-none focus:ring-2 focus:ring-[#BDB96A]/10"
              rows={4}
            />
            <button
              onClick={() => navigate("/results")}
              className="mt-4 w-full rounded-xl bg-[#4A4530] px-4 py-3 text-base font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg"
            >
              검색하기
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
              <div className="mb-4 text-lg font-semibold text-[#4A4530]">이전 조건 요약</div>
              <div className="space-y-3">
                <ConditionItem text="학교 정문 기준" color="tan" />
                <ConditionItem text="도보 15분 이내" color="tan" />
                <ConditionItem text="헬스장, 편의점 선호" color="tan" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#D8D7F5] bg-white p-6 shadow-sm">
              <div className="mb-4 text-lg font-semibold text-[#5A58AA]">추천 장소</div>
              <div className="space-y-3">
                <ConditionItem text="캠퍼스 근처 카페 거리" color="lavender" />
                <ConditionItem text="도서관 인접 구역" color="lavender" />
                <ConditionItem text="헬스장 밀집 구역" color="lavender" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DBFF] bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#8E3BA8]">
              <Lightbulb className="h-4 w-4" />
              검색 팁
            </div>
            <ul className="space-y-2 text-sm text-[#8E3BA8]">
              <li>• 구체적인 거리와 시간을 입력하면 더 정확한 결과를 얻을 수 있어요</li>
              <li>• 여러 조건을 한 번에 입력해도 괜찮아요</li>
              <li>• "조용한", "밝은" 같은 분위기 표현도 사용 가능해요</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate("/map")}
            className="rounded-xl border border-[#E8E6DD] bg-white px-6 py-3 text-base font-semibold text-[#6B6847] hover:bg-[#FDFCF8] transition-all"
          >
            지도로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

function ConditionItem({ text, color }: { text: string; color: string }) {
  const colorClasses = {
    tan: "bg-[#FDFCF8] text-[#8B8850] border-[#F0EFE8]",
    lavender: "bg-[#F8F8FF] text-[#5A58AA] border-[#E8E7FF]",
  };

  return (
    <div className={`rounded-2xl px-4 py-3 text-base border ${colorClasses[color as keyof typeof colorClasses]}`}>
      {text}
    </div>
  );
}