import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, Sparkles } from "lucide-react";
import { properties, type Property } from "../data/dummyProperties";
import { favoriteListDummyData, type FavoriteItem } from "../data/dummyFavorites";

type ListMode = "recommended" | "favorites";

export default function PropertyListPanel() {
  const navigate = useNavigate();
  const [listMode, setListMode] = useState<ListMode>("recommended");

  const recommendedProperties = properties.slice(0, 3);
  const favoriteProperties = favoriteListDummyData.data.slice(0, 3);

  const isRecommendedMode = listMode === "recommended";
  const isFavoritesMode = listMode === "favorites";

  return (
    <div className="absolute bottom-5 left-5 z-10 flex max-h-[60vh] w-[280px] flex-col rounded-2xl border border-[#E8E6DD] bg-white/95 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#4A4530]">
            {isRecommendedMode ? "추천 매물" : "MY 매물"}
          </h3>
          <p className="mt-0.5 text-[11px] text-[#8B8850]">
            {isRecommendedMode
              ? "AI가 조건에 맞는 매물을 추천했어요"
              : "이전에 저장한 매물 목록이에요"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(isRecommendedMode ? "/results" : "/favorites")}
          className="text-xs font-medium text-[#8B89DD] hover:text-[#6B67BB]"
        >
          전체보기
        </button>
      </div>

      {/* 추천 / 찜한 장소 목록 토글 */}
      <div className="mb-3 grid shrink-0 grid-cols-2 gap-1 rounded-xl bg-[#F8F7F1] p-1">
        <button
          type="button"
          onClick={() => setListMode("recommended")}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition ${isRecommendedMode
            ? "bg-white text-[#4A4530] shadow-sm"
            : "text-[#8B8850] hover:bg-white/70"
            }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          추천
        </button>

        <button
          type="button"
          onClick={() => setListMode("favorites")}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition ${isFavoritesMode
            ? "bg-white text-[#4A4530] shadow-sm"
            : "text-[#8B8850] hover:bg-white/70"
            }`}
        >
          <Heart className="h-3.5 w-3.5" />
          MY
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {isRecommendedMode &&
          recommendedProperties.map((property) => (
            <RecommendedPropertyCard key={property.id} property={property} />
          ))}

        {isFavoritesMode &&
          favoriteProperties.map((favorite) => (
            <FavoritePropertyCard
              key={favorite.favoriteId}
              favorite={favorite}
            />
          ))}
      </div>
    </div>
  );
}

type RecommendedPropertyCardProps = {
  property: Property;
};
function RecommendedPropertyCard({ property }: RecommendedPropertyCardProps) {
  const navigate = useNavigate();

  const firstReason =
    property.description ?? property.distance ?? "조건에 맞는 추천 매물이에요";

  return (
    <button
      type="button"
      onClick={() => navigate(`/property/${property.id}`)}
      className="w-full rounded-xl border border-[#EEECCA] bg-white p-3 text-left shadow-sm transition hover:border-[#C1BFFF] hover:bg-[#F5F5FF]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold text-[#6B6847]">
          {property.title}
        </div>

        <span className="shrink-0 rounded-full bg-[#F5F5FF] px-2 py-0.5 text-[10px] font-semibold text-[#8B89DD]">
          <Sparkles className="h-3 w-3" />
        </span>
      </div>

      <div className="mt-1 text-xs font-medium text-[#BDB96A]">
        {property.price}
      </div>

      <div className="mt-0.5 text-[11px] text-[#8B8850]">
        {property.area ?? "면적 정보 없음"} · {property.distance ?? "거리 정보 없음"}
      </div>

      <div className="mt-1 line-clamp-1 rounded-lg bg-[#F8F7F1] px-2 py-1 text-[11px] text-[#6B6847]">
        {firstReason}
      </div>
    </button>
  );
}

type FavoritePropertyCardProps = {
  favorite: FavoriteItem;
};

function FavoritePropertyCard({ favorite }: FavoritePropertyCardProps) {
  const navigate = useNavigate();

  const { snapshot } = favorite;

  const depositText = formatPriceToManwon(snapshot.price.depositAmount);
  const monthlyRentText = formatPriceToManwon(snapshot.price.monthlyRent);
  const matchPercent = Math.round(snapshot.matchScore * 100);
  const firstReason = snapshot.matchReasons[0];

  return (
    <button
      type="button"
      onClick={() => navigate(`/property/${snapshot.propertyId}`)}
      className="w-full rounded-xl border border-[#EEECCA] bg-white p-3 text-left shadow-sm transition hover:border-[#C1BFFF] hover:bg-[#F5F5FF]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold text-[#6B6847]">
          {snapshot.title}
        </div>

        <span className="shrink-0 rounded-full bg-[#FFF4F4] px-2 py-0.5 text-[10px] font-semibold text-[#D87070]">
          <Heart className="h-3 w-3" />
        </span>
      </div>

      <div className="mt-1 text-xs font-medium text-[#BDB96A]">
        보증금 {depositText} / 월세 {monthlyRentText}
      </div>

      <div className="mt-0.5 text-[11px] text-[#8B8850]">
        {snapshot.areaM2}㎡ · 매칭 {matchPercent}%
      </div>

      {firstReason && (
        <div className="mt-1 line-clamp-1 rounded-lg bg-[#F8F7F1] px-2 py-1 text-[11px] text-[#6B6847]">
          {firstReason}
        </div>
      )}
    </button>
  );
}

function formatPriceToManwon(value: number) {
  return `${Math.floor(value / 10000)}만`;
}