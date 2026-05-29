import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Heart, Sparkles } from "lucide-react";
import type { ListMode } from "../utils/propertyListItems";
import type { PropertyCardView } from "../types";

const AI_SEARCH_COMPLETED_KEY = "rooming_ai_search_completed";

type PropertyListPanelProps = {
  listMode: ListMode;
  properties: PropertyCardView[];
  onChangeListMode: (mode: ListMode) => void;
};

export default function PropertyListPanel({
  listMode,
  properties,
  onChangeListMode,
}: PropertyListPanelProps) {
  const [hasSearchResult, setHasSearchResult] = useState(false);

  const isRecommendedMode = listMode === "recommended";
  const isFavoritesMode = listMode === "favorites";

  useEffect(() => {
    const isCompleted =
      sessionStorage.getItem(AI_SEARCH_COMPLETED_KEY) === "true";

    setHasSearchResult(isCompleted);
  }, []);

  const visibleProperties = hasSearchResult ? properties : [];

  return (
    <div className="absolute bottom-5 left-5 z-10 flex max-h-[60vh] w-[260px] flex-col rounded-2xl border border-border bg-card/95 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {isRecommendedMode ? "추천 매물" : "MY 매물"}
          </h3>

          <p className="mt-0.5 text-[11px] text-text-tertiary">
            {hasSearchResult
              ? isRecommendedMode
                ? "AI가 조건에 맞는 매물을 추천했어요"
                : "이전에 저장한 매물 목록이에요"
              : "검색 완료 후 매물 목록이 표시돼요"}
          </p>
        </div>
      </div>

      <div className="mb-3 grid shrink-0 grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => onChangeListMode("recommended")}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition ${isRecommendedMode
            ? "bg-card text-foreground shadow-sm"
            : "text-text-tertiary hover:bg-card/70"
            }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          추천
        </button>

        <button
          type="button"
          onClick={() => onChangeListMode("favorites")}
          style={{
            color: isFavoritesMode
              ? "var(--token-color-my)"
              : "var(--token-color-text-tertiary)",
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition ${isFavoritesMode
            ? "bg-card shadow-sm"
            : "hover:bg-card/70"
            }`}
        >
          <Heart className="h-3.5 w-3.5" />
          MY
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {visibleProperties.length > 0 ? (
          visibleProperties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} />
          ))
        ) : (
          <EmptyPropertyList isRecommendedMode={isRecommendedMode} />
        )}
      </div>
    </div>
  );
}

type EmptyPropertyListProps = {
  isRecommendedMode: boolean;
};

function EmptyPropertyList({ isRecommendedMode }: EmptyPropertyListProps) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-3 py-5 text-center">

      <p className="text-xs font-semibold text-foreground">
        아직 표시할 매물이 없어요
      </p>

      <p className="mt-1 break-keep text-[11px] leading-4 text-text-tertiary">
        검색이 완료되면 이 영역에
        <br />
        매물 목록이 표시됩니다.
      </p>
    </div>
  );
}

type PropertyCardProps = {
  property: PropertyCardView;
};

function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();
  const isFavoriteMode = property.favorite === true;

  return (
    <button
      type="button"
      onClick={() => navigate(`/property/${property.propertyId}`)}
      className="w-full rounded-xl border border-beige-300 bg-card p-3 text-left shadow-sm transition hover:border-purple-500 hover:bg-purple-50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold text-text-secondary">
          {property.title}
        </div>

        <span
          style={
            isFavoriteMode
              ? {
                backgroundColor:
                  "color-mix(in srgb, var(--token-color-my) 10%, var(--token-color-transparent))",
                color: "var(--token-color-my)",
              }
              : undefined
          }
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${isFavoriteMode
            ? ""
            : "bg-purple-50 text-secondary"
            }`}
        >
          {isFavoriteMode ? (
            <Heart className="h-3 w-3" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
        </span>
      </div>

      <div className="mt-1 text-xs font-medium text-accent">
        {property.priceLabel}
      </div>

      <div className="mt-0.5 text-[11px] text-text-tertiary">
        {property.areaLabel}
        {property.routeDurationLabel ? ` · ${property.routeDurationLabel}` : ""}
      </div>

      {property.description && (
        <div className="mt-1 line-clamp-1 rounded-lg bg-muted px-2 py-1 text-[11px] text-text-secondary">
          {property.description}
        </div>
      )}
    </button>
  );
}
