import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Sparkles,
  Heart,
  CheckCircle2,
  Footprints,
  MapPin,
  Map,
} from "lucide-react";

import {
  loadSearchRequest,
  setSearchCompleted,
} from "../utils/recommendationSearch";
import { useRecommendationSearch } from "../hooks/queries/recommendationQueries";
import {
  formatRouteDurationLabel,
  formatWalkingLabel,
  mapRecommendationToCardView,
} from "../api/mappers/recommendationMapper";
import CenteredMessage from "../components/CenteredMessage";
import PropertyImagePlaceholder from "../components/PropertyImagePlaceholder";

export default function AIResultScreen() {
  const navigate = useNavigate();

  const request = useMemo(() => loadSearchRequest(), []);
  const { data, isPending, isError } = useRecommendationSearch(request);

  const results = useMemo(() => data?.results ?? [], [data]);

  // 로컬 MY 선택: API favorite 값을 기본으로 두고, 토글 시 로컬에서 뒤집어 표시한다.
  // (실제 찜 추가/삭제 API 연동은 #24)
  const [toggledFavorites, setToggledFavorites] = useState<Set<number>>(
    new Set()
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedResult =
    results.find((r) => r.recommendationId === selectedId) ??
    results[0] ??
    null;
  const selectedCard = selectedResult
    ? mapRecommendationToCardView(selectedResult)
    : null;

  const isFavorite = (recommendationId: number, apiFavorite: boolean) =>
    toggledFavorites.has(recommendationId) ? !apiFavorite : apiFavorite;

  const handleToggleMy = () => {
    if (!selectedResult) return;
    setToggledFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(selectedResult.recommendationId)) {
        next.delete(selectedResult.recommendationId);
      } else {
        next.add(selectedResult.recommendationId);
      }
      return next;
    });
  };

  const handleExitResult = () => {
    // 결과 화면을 빠져나온 뒤에만 지도 화면에 추천 결과를 노출한다.
    setSearchCompleted(true);
    navigate("/map");
  };

  // 검색 입력이 없으면 검색을 유도한다.
  if (!request) {
    return (
      <CenteredMessage
        title="검색 조건이 없어요"
        description="지도 화면의 AI 검색에서 원하는 조건을 입력해 주세요."
        onBack={() => navigate("/map")}
      />
    );
  }

  if (isPending) {
    return (
      <CenteredMessage
        title="AI가 추천 매물을 찾고 있어요"
        description="조건을 분석해 매칭률이 높은 매물을 추천하는 중이에요."
      />
    );
  }

  if (isError) {
    return (
      <CenteredMessage
        title="추천 결과를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
        onBack={() => navigate("/map")}
      />
    );
  }

  if (!selectedResult || !selectedCard) {
    return (
      <CenteredMessage
        title="추천 매물이 없어요"
        description="다른 조건으로 다시 검색해 보세요."
        onBack={() => navigate("/map")}
      />
    );
  }

  const selectedRouteLabel = formatRouteDurationLabel(
    selectedResult.firstTargetPlaceRoute
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* 상단 헤더 */}
      <header className="shrink-0 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-3 pt-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-foreground" />
              AI 추천 결과
            </h1>

            <p className="mt-1 text-sm text-text-tertiary">
              조건에 맞는 {results.length}개의 매물을 추천했어요
            </p>
          </div>

          <button
            type="button"
            onClick={handleExitResult}
            className="flex items-center gap-2.5 rounded-2xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-green-800"
          >
            <Map className="h-5 w-5" />
            지도에서 확인하기
          </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-6 px-6 pb-6 pt-3 lg:grid-cols-[1fr_360px]">
        {/* 왼쪽 상세보기 카드 */}
        <section className="flex min-h-0 min-w-0 flex-col rounded-3xl border border-border bg-card shadow-sm">
          <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
              {/* 이미지(placeholder) + 제목 오버레이 영역 */}
              <div>
                <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-border/50 to-purple-300/50">
                  <PropertyImagePlaceholder size="xl" />

                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-foreground/65 via-foreground/35 to-transparent px-5 pb-5 pt-16">
                    <div className="mb-2">
                      <span className="rounded-full border border-card/50 bg-card/90 px-3 py-1 text-xs font-bold text-purple-800">
                        AI 추천 매물
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-primary-foreground drop-shadow-sm">
                      {selectedCard.title}
                    </h2>

                    <p className="mt-1 text-xl font-bold text-green-300 drop-shadow-sm">
                      {selectedCard.priceLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <SimpleInfoBadge
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    text={selectedCard.areaLabel}
                  />

                  {selectedRouteLabel && (
                    <SimpleInfoBadge
                      icon={<Footprints className="h-3.5 w-3.5" />}
                      text={`정문까지 ${selectedRouteLabel}`}
                    />
                  )}
                </div>
              </div>

              {/* 설명 영역 */}
              <div className="flex flex-col gap-4">
                <div className="rounded-3xl border border-border bg-background p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-bold text-foreground">
                      추천 이유
                    </h3>
                  </div>

                  <p className="break-keep text-sm leading-7 text-text-secondary">
                    {selectedResult.explanation ??
                      "이 매물에 대한 추천 이유 정보가 없어요."}
                  </p>
                </div>

                {selectedResult.infrastructures.length > 0 && (
                  <div className="rounded-3xl border border-beige-300 bg-green-300/30 p-5">
                    <p className="mb-2 text-sm font-bold text-foreground">
                      주요 인프라
                    </p>

                    <ul className="space-y-1.5">
                      {selectedResult.infrastructures.map((infra) => (
                        <li
                          key={infra.infrastructureId}
                          className="flex items-center justify-between gap-2 text-sm text-text-secondary"
                        >
                          <span className="break-keep">
                            {infra.name ?? "이름 미상"}
                          </span>
                          <span className="shrink-0 font-semibold text-foreground">
                            {formatWalkingLabel(infra.walkingMinutes) ?? "-"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 오른쪽 영역: 추천 매물 리스트 + MY 선택 카드 */}
        <aside className="flex min-h-0 flex-col gap-4">
          <section className="flex min-h-0 flex-1 flex-col rounded-3xl border border-border bg-card shadow-sm">
            <div className="shrink-0 px-5 pb-3 pt-5">
              <h2 className="text-lg font-bold text-foreground">추천 매물</h2>

              <p className="mt-1 text-sm text-text-tertiary">
                매물을 선택하면 왼쪽에서 자세히 볼 수 있어요
              </p>
            </div>

            <div className="mx-5 h-px shrink-0 bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
              <div className="space-y-3">
                {results.map((result, index) => {
                  const isSelected =
                    result.recommendationId ===
                    selectedResult.recommendationId;
                  const isMy = isFavorite(
                    result.recommendationId,
                    result.favorite
                  );
                  const card = mapRecommendationToCardView(result);

                  return (
                    <button
                      key={result.recommendationId}
                      type="button"
                      onClick={() => setSelectedId(result.recommendationId)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${isSelected
                          ? "border-primary bg-muted"
                          : "border-border bg-card hover:border-accent"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1 flex items-center gap-1.5">
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                              TOP {index + 1}
                            </span>

                            {isMy && (
                              <span
                                style={{
                                  borderColor: "var(--token-color-my)",
                                  backgroundColor:
                                    "color-mix(in srgb, var(--token-color-my) 10%, var(--token-color-transparent))",
                                  color: "var(--token-color-my)",
                                }}
                                className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                              >
                                MY
                              </span>
                            )}
                          </div>

                          <h3 className="truncate text-base font-bold text-foreground">
                            {card.title}
                          </h3>

                          <p className="mt-1 text-lg font-bold text-accent">
                            {card.priceLabel}
                          </p>

                          {card.explanation && (
                            <p className="mt-1 line-clamp-1 text-xs text-text-tertiary">
                              {card.explanation}
                            </p>
                          )}
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* MY 설명 버튼 카드 */}
          <section className="shrink-0 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground">
                이 매물을 MY 매물로 선택할까요?
              </p>

              <p className="mt-1 text-sm leading-5 text-text-tertiary">
                선택한 매물은 저장되어 다시 확인할 수 있어요.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleMy}
              style={{
                borderColor: "var(--token-color-my)",
                backgroundColor: isFavorite(
                  selectedResult.recommendationId,
                  selectedResult.favorite
                )
                  ? "var(--token-color-my)"
                  : "var(--token-color-white)",
                color: isFavorite(
                  selectedResult.recommendationId,
                  selectedResult.favorite
                )
                  ? "var(--token-color-text-white)"
                  : "var(--token-color-my)",
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-base font-bold shadow-sm transition"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite(
                  selectedResult.recommendationId,
                  selectedResult.favorite
                )
                  ? "fill-current"
                  : ""
                  }`}
              />

              {isFavorite(
                selectedResult.recommendationId,
                selectedResult.favorite
              )
                ? "MY 선택됨"
                : "MY로 선택"}
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
}

type SimpleInfoBadgeProps = {
  icon: React.ReactNode;
  text?: string;
};

function SimpleInfoBadge({ icon, text }: SimpleInfoBadgeProps) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-text-secondary">
      {icon}
      {text}
    </span>
  );
}

