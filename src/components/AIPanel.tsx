import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import {
  DEFAULT_TOP_N,
  loadSearchPreferences,
  loadSearchRequest,
  saveSearchRequest,
  useSearchRequest,
} from "../utils/recommendationSearch";
import { useRecommendationSearch } from "../hooks/queries/recommendationQueries";
import { useTargetPlaces } from "../hooks/queries/targetPlaceQueries";
import {
  formatRouteDurationLabel,
  formatRoutePlaceDurationLabel,
  mapRecommendationToCardView,
} from "../api/mappers/recommendationMapper";

/** 입력이 비어 있을 때 사용하는 예시 검색어 (mock 흐름 데모용). */
const EXAMPLE_QUERY =
  "학교까지 20분 이내이고 보증금 1000만원 이하, 헬스장이 가깝고 BHC가 가까운 원룸 추천해줘";

export default function AIPanel() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  // 검색 기록 노출 여부는 "검색 요청이 저장되어 있는가"로 판단한다.
  const hasAIResult = useSearchRequest() != null;

  const handleSearch = () => {
    const finalQuery = query.trim() || EXAMPLE_QUERY;

    // AI 검색 입력 → RecommendationRequest로 변환해 저장.
    saveSearchRequest({
      query: finalQuery,
      preferences: loadSearchPreferences(),
      topN: DEFAULT_TOP_N,
    });

    setQuery("");
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
  const request = loadSearchRequest();
  const { data, isPending, isError } = useRecommendationSearch(request);
  const { data: targetPlaceData } = useTargetPlaces(request != null);

  const results = useMemo(() => data?.results ?? [], [data]);
  const targetPlaceById = useMemo(
    () =>
      new Map(
        (targetPlaceData?.targetPlaces ?? []).map((place) => [
          place.targetPlaceId,
          place,
        ])
      ),
    [targetPlaceData]
  );
  const recommendationMapperOptions = useMemo(
    () => ({ targetPlaceById }),
    [targetPlaceById]
  );
  const cards = useMemo(
    () =>
      results.map((result) =>
        mapRecommendationToCardView(result, recommendationMapperOptions)
      ),
    [results, recommendationMapperOptions]
  );
  const topResult = results[0] ?? null;
  const topCard = cards[0] ?? null;
  const topExplanation = topResult?.explanation?.trim() ?? "";
  const topRouteLabel = formatRouteDurationLabel(
    topResult?.firstTargetPlaceRoute ?? null
  );
  const topRoutePlaceLabel = formatRoutePlaceDurationLabel(
    topResult?.firstTargetPlaceRoute ?? null,
    topCard?.routePlaceName
  );

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
            {request?.query ?? "입력한 검색 조건이 없어요."}
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
          <p className="break-keep">
            {isPending
              ? "AI가 조건을 분석하고 있어요..."
              : isError
                ? "추천 결과를 불러오지 못했어요."
                : (data?.message ?? "추천 결과가 없어요.")}
          </p>
        </div>
      </section>

      {/* 추천 매물 */}
      <section>
        <div className="sticky top-0 z-10 mb-2 bg-card/95 py-1 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground">추천 매물</h3>
        </div>

        {cards.length > 0 ? (
          <ul className="space-y-1.5">
            {cards.map((card, index) => (
              <li
                key={card.recommendationId ?? card.propertyId}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {index + 1}
                  </span>

                  <span className="min-w-0 break-keep font-medium">
                    {card.title}
                  </span>
                </div>

                {index === 0 && (
                  <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-text-tertiary">
                    BEST
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-background px-3 py-3 text-center text-[11px] text-text-tertiary">
            {isPending ? "추천 결과를 불러오는 중..." : "표시할 추천 매물이 없어요."}
          </p>
        )}
      </section>

      {/* 1순위 매칭 근거 */}
      {topResult && (
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
                    {topCard?.title ?? `추천 매물 #${topResult.propertyId}`}
                  </span>
                </div>

                <p className="mt-1 text-[11px] leading-4 text-text-tertiary">
                  보증금 {formatPrice(topResult.property.depositAmount)} · 월세{" "}
                  {formatPrice(topResult.property.monthlyRent)}
                </p>
              </div>

              {topRouteLabel && (
                <div className="shrink-0 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                  {topRouteLabel}
                </div>
              )}
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2 text-[11px]">
              <InfoChip
                label="관리비"
                value={formatPrice(topResult.property.maintenanceFee)}
              />

              {topRoutePlaceLabel && (
                <InfoChip
                  label={topCard?.routePlaceName ? `${topCard.routePlaceName}까지` : "목적지까지"}
                  value={topRouteLabel ?? topRoutePlaceLabel}
                />
              )}
            </div>

            {topExplanation && (
              <p className="whitespace-pre-line break-keep text-xs leading-5 text-text-secondary">
                {topExplanation}
              </p>
            )}
          </div>
        </section>
      )}
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

function formatPrice(value: number | null) {
  if (value == null) return "정보 없음";
  if (value >= 10000) {
    return `${Math.floor(value / 10000).toLocaleString()}만원`;
  }

  return `${value.toLocaleString()}원`;
}
