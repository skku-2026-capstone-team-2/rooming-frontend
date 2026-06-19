import { useNavigate } from "react-router";
import { Heart, Sparkles } from "lucide-react";
import type { ListMode } from "../utils/propertyListItems";
import type { PropertyCardView } from "../types";

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
  const isRecommendedMode = listMode === "recommended";
  const isFavoritesMode = listMode === "favorites";

  // 노출 여부 게이트는 상위(MainMapScreen)가 URL view로 판단해 properties로 전달한다.
  const visibleProperties = properties;
  const hasSearchResult = properties.length > 0;

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
            <PropertyCard
              key={`${listMode}-${property.recommendationId ?? property.propertyId}`}
              property={property}
              isFavoriteMode={isFavoritesMode}
            />
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
        {isRecommendedMode ? (
          <>
            AI 검색이 완료되면 이 영역에
            <br />
            추천 매물이 표시됩니다.
          </>
        ) : (
          <>
            저장(MY)한 매물이 아직 없어요.
            <br />
            추천 결과에서 MY로 담아보세요.
          </>
        )}
      </p>
    </div>
  );
}

type PropertyCardProps = {
  property: PropertyCardView;
  isFavoriteMode: boolean;
};

function PropertyCard({ property, isFavoriteMode }: PropertyCardProps) {
  const navigate = useNavigate();
  const detailParams = new URLSearchParams();

  if (property.recommendationId != null) {
    detailParams.set("recommendationId", String(property.recommendationId));
  }

  const detailQuery = detailParams.toString();
  const detailPath = `/property/${property.propertyId}${
    detailQuery ? `?${detailQuery}` : ""
  }`;

  return (
    <button
      type="button"
      onClick={() => navigate(detailPath)}
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
        <div className="mt-1 whitespace-normal break-keep rounded-lg bg-muted px-2 py-1 text-[11px] leading-4 text-text-secondary">
          {property.description}
        </div>
      )}
    </button>
  );
}
