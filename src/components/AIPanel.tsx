import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Home,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const AI_SEARCH_COMPLETED_KEY = "rooming_ai_search_completed";
const AI_SEARCH_QUERY_KEY = "rooming_ai_search_query";

const aiResult = {
  userPrompt:
    "학교까지 20분 이내이고 보증금 1000만원 이하, 헬스장이 가깝고 BHC가 가까운 원룸 추천해줘",
  summaryText:
    "추천 결과를 종합하면 1번 매물은 학교까지 도보 11분이며, 아르바이트 장소와 가깝고 헬스장, BHC 접근성이 좋습니다.",
  recommendedPropertyNames: ["스테이원룸 101호", "캠퍼스빌 203호", "헬스장 근처 투룸", "카페거리 원룸"],
  topProperty: {
    id: 1,
    title: "스테이원룸 101호",
    depositAmount: 10000000,
    monthlyRent: 450000,
    maintenanceFee: 50000,
    areaM2: 23.5,
    matchScore: 0.94,
    matchReasons: [
      "학교까지 도보 11분",
      "아르바이트 장소까지 대중교통 17분",
      "헬스장 도보 4분",
      "BHC 도보 6분",
    ],
    hasProperty3D: true,
  },
};

export default function AIPanel() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [hasAIResult, setHasAIResult] = useState(false);

  useEffect(() => {
    const savedQuery = sessionStorage.getItem(AI_SEARCH_QUERY_KEY);
    const isCompleted =
      sessionStorage.getItem(AI_SEARCH_COMPLETED_KEY) === "true";

    if (savedQuery) {
      setQuery(savedQuery);
    }

    setHasAIResult(isCompleted);
  }, []);

  const handleSearch = () => {
    const finalQuery = query.trim() || aiResult.userPrompt;

    sessionStorage.setItem(AI_SEARCH_QUERY_KEY, finalQuery);

    // 검색하기 직후에는 아직 채팅 기록 등록 X
    sessionStorage.setItem(AI_SEARCH_COMPLETED_KEY, "false");

    navigate("/ai-result");
  };

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col gap-4 border-l border-border bg-card px-5 py-5 shadow-lg">
      {/* AI 검색 입력 영역 */}
      <section className="relative shrink-0 rounded-3xl border-2 border-primary bg-card p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Sparkles className="h-4 w-4 shrink-0" />
              AI 검색 조건 입력
            </div>

            <p className="mt-1 break-keep text-[11px] leading-4 text-text-tertiary">
              원하는 조건을 문장으로 입력해보세요
            </p>
          </div>

          {/* Tip hover 버튼 */}
          <div className="group relative shrink-0">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-accent-purple-border bg-accent-purple-bg text-accent-purple transition hover:bg-accent-purple-lighter"
              aria-label="검색 팁 보기"
            >
              <Lightbulb className="h-3.5 w-3.5" />
            </button>

            <div className="pointer-events-none absolute right-0 top-9 z-30 w-[230px] translate-y-1 rounded-2xl border border-accent-purple-border bg-card p-3 text-accent-purple opacity-0 shadow-xl transition-all duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold">
                <Lightbulb className="h-3.5 w-3.5" />
                Tip
              </div>

              <ul className="ml-4 list-disc space-y-1 text-[11px] leading-4">
                <li className="break-keep">
                  AI가 조건을 분석해 매칭률이 높은 매물을 추천합니다
                </li>
                <li className="break-keep">
                  추천 결과는 화면 좌측 하단 목록 및 지도에 표시됩니다
                </li>
              </ul>
            </div>
          </div>
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 학교까지 20분 이내, 보증금 1000만원 이하, 헬스장과 BHC 가까운 원룸"
          className="w-full resize-none rounded-2xl border border-beige-300 bg-background px-3 py-3 text-xs leading-5 text-foreground placeholder:text-text-muted shadow-inner focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/10"
          rows={4}
        />

        <button
          type="button"
          onClick={handleSearch}
          className="mt-3 w-full rounded-2xl bg-primary px-3 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg"
        >
          검색하기
        </button>
      </section>

      {/* AI 추천 결과 영역 */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {hasAIResult ? <AIResultContent /> : <EmptyAIResult />}
      </div>
    </aside>
  );
}

function EmptyAIResult() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background px-5 py-8 text-center">

      <h3 className="text-sm font-bold text-foreground">
        아직 등록된 채팅 기록이 없어요
      </h3>

      <p className="mt-2 break-keep text-xs leading-5 text-text-tertiary">
        검색이 완료되면 이 영역에
        <br />
        AI 분석 기록이 표시됩니다.
      </p>
    </div>
  );
}

function AIResultContent() {
  const savedQuery =
    sessionStorage.getItem(AI_SEARCH_QUERY_KEY) || aiResult.userPrompt;

  return (
    <div className="space-y-5">
      {/* 채팅 기록 */}
      <section>
        <div className="sticky top-0 z-10 mb-2 bg-card/95 py-1 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground">채팅 기록</h3>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="mb-2 text-[11px] font-semibold text-text-muted">
            내가 입력한 조건
          </div>

          <p className="break-keep rounded-xl bg-background px-3 py-2 text-xs leading-5 text-foreground">
            {savedQuery}
          </p>
        </div>
      </section>

      {/* AI 분석 요약 */}
      <section>
        <div className="sticky top-0 z-10 mb-2 bg-card/95 py-1 backdrop-blur-sm">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            AI 분석 요약
          </h3>
        </div>

        <div className="rounded-xl border border-purple-300 bg-purple-100 px-3 py-2.5 text-xs leading-5 text-purple-800">
          <p className="break-keep">{aiResult.summaryText}</p>
        </div>
      </section>

      {/* 추천 매물 */}
      <section>
        <div className="sticky top-0 z-10 mb-2 bg-card/95 py-1 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground">추천 매물</h3>
        </div>

        <ul className="space-y-1.5">
          {aiResult.recommendedPropertyNames.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {index + 1}
                </span>

                <span className="min-w-0 break-keep font-medium">{name}</span>
              </div>

              {index === 0 && (
                <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-text-tertiary">
                  BEST
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 1순위 매칭 근거 */}
      <section>
        <div className="sticky top-0 z-10 mb-2 bg-card/95 py-1 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground">
            1순위 매칭 근거
          </h3>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <Home className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 break-keep">
                  {aiResult.topProperty.title}
                </span>
              </div>

              <p className="mt-1 text-[11px] leading-4 text-text-tertiary">
                보증금 {formatPrice(aiResult.topProperty.depositAmount)} · 월세{" "}
                {formatPrice(aiResult.topProperty.monthlyRent)}
              </p>
            </div>

            <div className="shrink-0 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
              {Math.round(aiResult.topProperty.matchScore * 100)}%
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2 text-[11px]">
            <InfoChip label="면적" value={`${aiResult.topProperty.areaM2}㎡`} />

            <InfoChip
              label="관리비"
              value={formatPrice(aiResult.topProperty.maintenanceFee)}
            />
          </div>

          <ul className="space-y-1.5">
            {aiResult.topProperty.matchReasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2 text-xs leading-5 text-text-secondary"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                <span className="break-keep">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background px-2.5 py-2">
      <div className="text-[10px] font-medium text-text-muted">{label}</div>

      <div className="mt-0.5 break-keep font-semibold text-foreground">
        {value}
      </div>
    </div>
  );
}

function formatPrice(value: number) {
  if (value >= 10000) {
    return `${Math.floor(value / 10000).toLocaleString()}만원`;
  }

  return `${value.toLocaleString()}원`;
}
