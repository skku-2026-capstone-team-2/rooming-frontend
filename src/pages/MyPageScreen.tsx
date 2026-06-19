import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Heart,
  Loader2,
  MapPin,
  Route,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  mapRecommendationToCardView,
  type RecommendationCardMapperOptions,
} from "../api/mappers/recommendationMapper";
import {
  useDeleteRecommendation,
  useFavorites,
  useRecommendations,
  useToggleFavorite,
} from "../hooks/queries/recommendationQueries";
import { useTargetPlaces } from "../hooks/queries/targetPlaceQueries";
import { useSeekerProfile } from "../hooks/queries/userQueries";
import type {
  PlaceCategory,
  RecommendationResult,
  TargetPlaceResponseItem,
} from "../types";

const PLACE_CATEGORY_LABEL: Record<PlaceCategory, string> = {
  SCHOOL: "학교",
  WORK_PLACE: "직장",
  HOME: "집",
  SUBWAY_STATION: "지하철역",
  BUS_TERMINAL: "버스 터미널",
  ETC: "기타",
};

export default function MyPageScreen() {
  const navigate = useNavigate();
  const profileQuery = useSeekerProfile();
  const targetPlacesQuery = useTargetPlaces();
  const recommendationsQuery = useRecommendations();
  const favoritesQuery = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();
  const deleteRecommendationMutation = useDeleteRecommendation();

  const targetPlaceById = useMemo(
    () =>
      new Map(
        (targetPlacesQuery.data?.targetPlaces ?? []).map((place) => [
          place.targetPlaceId,
          place,
        ])
      ),
    [targetPlacesQuery.data]
  );
  const recommendationMapperOptions = useMemo<RecommendationCardMapperOptions>(
    () => ({ targetPlaceById }),
    [targetPlaceById]
  );

  const favoriteRecommendationIds = useMemo(
    () =>
      new Set(
        (favoritesQuery.data?.results ?? []).map(
          (recommendation) => recommendation.recommendationId
        )
      ),
    [favoritesQuery.data]
  );

  const allRecommendations = recommendationsQuery.data?.results ?? [];
  const favoriteRecommendations = favoritesQuery.data?.results ?? [];

  const handleToggleFavorite = (recommendation: RecommendationResult) => {
    const isFavorite =
      favoriteRecommendationIds.has(recommendation.recommendationId) ||
      recommendation.favorite;

    toggleFavoriteMutation.mutate({
      recommendationId: recommendation.recommendationId,
      favorite: !isFavorite,
    });
  };

  const handleDeleteRecommendation = (recommendationId: number) => {
    deleteRecommendationMutation.mutate(recommendationId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/map")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-text-secondary transition hover:bg-muted"
              aria-label="지도 화면으로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-foreground">마이페이지</h1>
              <p className="mt-1 text-sm text-text-tertiary">
                내 장소와 추천 결과를 한곳에서 확인해요.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/map")}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-green-800"
          >
            지도 보기
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <RecommendationSection
            title="MY 매물"
            description="MY에 저장한 추천 매물을 다시 확인할 수 있어요."
            recommendations={favoriteRecommendations}
            isLoading={favoritesQuery.isPending}
            emptyText="MY에 저장한 매물이 없어요."
            mapperOptions={recommendationMapperOptions}
            favoriteRecommendationIds={favoriteRecommendationIds}
            pendingFavoriteId={
              toggleFavoriteMutation.isPending
                ? toggleFavoriteMutation.variables?.recommendationId ?? null
                : null
            }
            pendingDeleteId={null}
            onToggleFavorite={handleToggleFavorite}
            onDeleteRecommendation={null}
          />

          <RecommendationSection
            title="추천 기록"
            description="AI 추천으로 저장된 매물 기록이에요."
            recommendations={allRecommendations}
            isLoading={recommendationsQuery.isPending}
            emptyText="아직 추천 기록이 없어요."
            mapperOptions={recommendationMapperOptions}
            favoriteRecommendationIds={favoriteRecommendationIds}
            pendingFavoriteId={
              toggleFavoriteMutation.isPending
                ? toggleFavoriteMutation.variables?.recommendationId ?? null
                : null
            }
            pendingDeleteId={
              deleteRecommendationMutation.isPending
                ? deleteRecommendationMutation.variables ?? null
                : null
            }
            onToggleFavorite={handleToggleFavorite}
            onDeleteRecommendation={handleDeleteRecommendation}
          />
        </div>

        <aside className="space-y-6">
          <ProfileSection
            isLoading={profileQuery.isPending}
            isError={profileQuery.isError}
            name={profileQuery.data?.name}
            email={profileQuery.data?.email}
          />

          <TargetPlacesSection
            isLoading={targetPlacesQuery.isPending}
            places={targetPlacesQuery.data?.targetPlaces ?? []}
          />
        </aside>
      </main>
    </div>
  );
}

function ProfileSection({
  isLoading,
  isError,
  name,
  email,
}: {
  isLoading: boolean;
  isError: boolean;
  name?: string;
  email?: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-300 text-green-900">
          <UserRound className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">내 정보</h2>
          <p className="text-xs text-text-tertiary">Seeker 계정</p>
        </div>
      </div>

      {isLoading ? (
        <InlineLoading text="내 정보를 불러오는 중이에요." />
      ) : isError ? (
        <p className="text-sm text-destructive">
          내 정보를 불러오지 못했어요.
        </p>
      ) : (
        <div className="space-y-3">
          <InfoRow label="이름" value={name ?? "이름 없음"} />
          <InfoRow label="이메일" value={email ?? "이메일 없음"} />
        </div>
      )}
    </section>
  );
}

function TargetPlacesSection({
  isLoading,
  places,
}: {
  isLoading: boolean;
  places: TargetPlaceResponseItem[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-800">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">주요 장소</h2>
          <p className="text-xs text-text-tertiary">
            추천 기준으로 사용하는 장소예요.
          </p>
        </div>
      </div>

      {isLoading ? (
        <InlineLoading text="주요 장소를 불러오는 중이에요." />
      ) : places.length === 0 ? (
        <EmptyState text="등록된 주요 장소가 없어요." />
      ) : (
        <div className="space-y-3">
          {places.map((place) => (
            <div
              key={place.targetPlaceId}
              className="rounded-xl border border-border bg-background px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-keep text-sm font-bold text-foreground">
                    {place.placeName}
                  </p>
                  {place.roadAddress && (
                    <p className="mt-1 break-keep text-xs leading-5 text-text-tertiary">
                      {place.roadAddress}
                    </p>
                  )}
                  {place.memo && (
                    <p className="mt-2 break-keep text-xs text-text-secondary">
                      {place.memo}
                    </p>
                  )}
                </div>

                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                  {PLACE_CATEGORY_LABEL[place.category]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RecommendationSection({
  title,
  description,
  recommendations,
  isLoading,
  emptyText,
  mapperOptions,
  favoriteRecommendationIds,
  pendingFavoriteId,
  pendingDeleteId,
  onToggleFavorite,
  onDeleteRecommendation,
}: {
  title: string;
  description: string;
  recommendations: RecommendationResult[];
  isLoading: boolean;
  emptyText: string;
  mapperOptions: RecommendationCardMapperOptions;
  favoriteRecommendationIds: ReadonlySet<number>;
  pendingFavoriteId: number | null;
  pendingDeleteId: number | null;
  onToggleFavorite: (recommendation: RecommendationResult) => void;
  onDeleteRecommendation: ((recommendationId: number) => void) | null;
}) {
  const recommendationGroups = useMemo(
    () => groupRecommendationsByProperty(recommendations),
    [recommendations]
  );
  const hasDuplicateRecommendations =
    recommendations.length > recommendationGroups.length;

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-text-tertiary">{description}</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-text-secondary">
          {hasDuplicateRecommendations
            ? `${recommendationGroups.length}개 매물 · ${recommendations.length}개 기록`
            : `${recommendations.length}개`}
        </span>
        <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-semibold text-text-secondary">
          {recommendations.length}개
        </span>
      </div>

      <div className="border-t border-border px-5 py-5">
        {isLoading ? (
          <InlineLoading text={`${title}을 불러오는 중이에요.`} />
        ) : recommendations.length === 0 ? (
          <EmptyState text={emptyText} />
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {recommendationGroups.map((group) => (
              <RecommendationGroupCard
                key={group.propertyId}
                group={group}
                mapperOptions={mapperOptions}
                favoriteRecommendationIds={favoriteRecommendationIds}
                pendingFavoriteId={pendingFavoriteId}
                pendingDeleteId={pendingDeleteId}
                onToggleFavorite={onToggleFavorite}
                onDeleteRecommendation={onDeleteRecommendation}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type RecommendationGroup = {
  propertyId: number;
  recommendations: RecommendationResult[];
};

function groupRecommendationsByProperty(
  recommendations: RecommendationResult[]
): RecommendationGroup[] {
  const groupByPropertyId = new Map<number, RecommendationResult[]>();

  recommendations.forEach((recommendation) => {
    const group = groupByPropertyId.get(recommendation.propertyId);
    if (group) {
      group.push(recommendation);
    } else {
      groupByPropertyId.set(recommendation.propertyId, [recommendation]);
    }
  });

  return Array.from(groupByPropertyId.entries()).map(
    ([propertyId, groupedRecommendations]) => ({
      propertyId,
      recommendations: groupedRecommendations,
    })
  );
}

function RecommendationGroupCard({
  group,
  mapperOptions,
  favoriteRecommendationIds,
  pendingFavoriteId,
  pendingDeleteId,
  onToggleFavorite,
  onDeleteRecommendation,
}: {
  group: RecommendationGroup;
  mapperOptions: RecommendationCardMapperOptions;
  favoriteRecommendationIds: ReadonlySet<number>;
  pendingFavoriteId: number | null;
  pendingDeleteId: number | null;
  onToggleFavorite: (recommendation: RecommendationResult) => void;
  onDeleteRecommendation: ((recommendationId: number) => void) | null;
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const primaryRecommendation = group.recommendations[0];
  const primaryCard = mapRecommendationToCardView(
    primaryRecommendation,
    mapperOptions
  );
  const hasFavoriteRecommendation = group.recommendations.some(
    (recommendation) =>
      favoriteRecommendationIds.has(recommendation.recommendationId) ||
      recommendation.favorite
  );
  const detailPath = `/property/${primaryRecommendation.propertyId}?recommendationId=${primaryRecommendation.recommendationId}`;
  const infraPath = `/infra-view?propertyId=${primaryRecommendation.propertyId}&recommendationId=${primaryRecommendation.recommendationId}`;
  return (
    <article className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full border border-accent-purple-border bg-accent-purple-bg px-2.5 py-1 text-[11px] font-bold text-accent-purple ${group.recommendations.length > 1 ? "" : "hidden"
                }`}
            >
              여러 조건에서 {group.recommendations.length}번 추천됨
            </span>
            {hasFavoriteRecommendation && (
              <span
                style={{
                  borderColor: "var(--token-color-my)",
                  color: "var(--token-color-my)",
                }}
                className="rounded-full border bg-card px-2.5 py-1 text-[11px] font-bold"
              >
                MY
              </span>
            )}
          </div>

          <h3 className="break-keep text-base font-bold text-foreground">
            {primaryCard.title}
          </h3>
          <p className="mt-1 text-sm font-bold text-accent">
            {primaryCard.priceLabel}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
        <Route className="h-4 w-4 shrink-0 text-text-tertiary" />
        <span className="break-keep">
          {primaryCard.routePlaceName && primaryCard.routeDurationLabel
            ? `${primaryCard.routePlaceName}까지 ${primaryCard.routeDurationLabel}`
            : primaryCard.routeDurationLabel ?? "경로 정보 없음"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(detailPath)}
          className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-muted"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          상세
        </button>

        <button
          type="button"
          onClick={() => navigate(infraPath)}
          className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-muted"
        >
          <MapPin className="h-3.5 w-3.5" />
          인프라
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-card"
        >
          추천 기록 {isExpanded ? "접기" : "보기"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {group.recommendations.map((recommendation, index) => (
            <div key={recommendation.recommendationId}>
              <p className="mb-2 text-xs font-semibold text-text-tertiary">
                추천 기록 {index + 1}
              </p>
              <RecommendationCard
                recommendation={recommendation}
                mapperOptions={mapperOptions}
                isFavorite={
                  favoriteRecommendationIds.has(
                    recommendation.recommendationId
                  ) || recommendation.favorite
                }
                favoritePending={
                  pendingFavoriteId === recommendation.recommendationId
                }
                deletePending={
                  pendingDeleteId === recommendation.recommendationId
                }
                onToggleFavorite={onToggleFavorite}
                onDeleteRecommendation={onDeleteRecommendation}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function RecommendationCard({
  recommendation,
  mapperOptions,
  isFavorite,
  favoritePending,
  deletePending,
  onToggleFavorite,
  onDeleteRecommendation,
}: {
  recommendation: RecommendationResult;
  mapperOptions: RecommendationCardMapperOptions;
  isFavorite: boolean;
  favoritePending: boolean;
  deletePending: boolean;
  onToggleFavorite: (recommendation: RecommendationResult) => void;
  onDeleteRecommendation: ((recommendationId: number) => void) | null;
}) {
  const navigate = useNavigate();
  const card = mapRecommendationToCardView(recommendation, mapperOptions);
  const detailPath = `/property/${recommendation.propertyId}?recommendationId=${recommendation.recommendationId}`;
  const infraPath = `/infra-view?propertyId=${recommendation.propertyId}&recommendationId=${recommendation.recommendationId}`;

  return (
    <article className="rounded-xl border border-border bg-card p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
              추천
            </span>
            {isFavorite && (
              <span
                style={{
                  borderColor: "var(--token-color-my)",
                  color: "var(--token-color-my)",
                }}
                className="rounded-full border bg-card px-2.5 py-1 text-[11px] font-bold"
              >
                MY
              </span>
            )}
          </div>

          <h3 className="hidden break-keep text-base font-bold text-foreground">
            {card.title}
          </h3>
          <p className="hidden mt-1 text-sm font-bold text-accent">
            {card.priceLabel}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-text-secondary">
        <div className="hidden items-center gap-2">
          <Route className="h-4 w-4 shrink-0 text-text-tertiary" />
          <span className="break-keep">
            {card.routePlaceName && card.routeDurationLabel
              ? `${card.routePlaceName}까지 ${card.routeDurationLabel}`
              : card.routeDurationLabel ?? "경로 정보 없음"}
          </span>
        </div>

        <p className="break-keep rounded-lg bg-background px-3 py-2 text-xs leading-5 text-text-tertiary">
          {card.explanation ?? "이 추천 기록에는 설명이 없어요."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-3">
        <button
          type="button"
          onClick={() => navigate(detailPath)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-muted"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          상세
        </button>

        <button
          type="button"
          onClick={() => navigate(infraPath)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-muted"
        >
          <MapPin className="h-3.5 w-3.5" />
          인프라
        </button>

        <button
          type="button"
          disabled={favoritePending}
          onClick={() => onToggleFavorite(recommendation)}
          style={
            isFavorite
              ? {
                borderColor: "var(--token-color-my)",
                color: "var(--token-color-my)",
              }
              : undefined
          }
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
        >
          {favoritePending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`} />
          )}
          {isFavorite ? "MY 해제" : "MY 추가"}
        </button>

        {onDeleteRecommendation && (
          <button
            type="button"
            disabled={deletePending}
            onClick={() =>
              onDeleteRecommendation(recommendation.recommendationId)
            }
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-card px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deletePending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            삭제
          </button>
        )}
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="text-xs font-semibold text-text-tertiary">{label}</p>
      <p className="mt-1 break-keep text-sm font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

function InlineLoading({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-tertiary">
      <Loader2 className="h-4 w-4 animate-spin" />
      {text}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-text-tertiary">
      {text}
    </div>
  );
}
