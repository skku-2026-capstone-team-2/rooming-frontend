import { X } from "lucide-react";
import { formatTradeTypeLabel } from "../api/mappers/propertyMapper";
import PropertyImagePlaceholder from "./PropertyImagePlaceholder";
import type { PropertyCardView } from "../types";

type PropertyDetailModalProps = {
  isOpen: boolean;
  property: PropertyCardView | null;
  onClose: () => void;
  onClickDetail?: () => void;
  onClick3D?: () => void;
  onClickInfra?: () => void;
};

export default function PropertyDetailModal({
  isOpen,
  property,
  onClose,
  onClickDetail,
  onClick3D,
  onClickInfra,
}: PropertyDetailModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4 pl-[180px]">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-4 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-20 rounded-lg bg-card p-2 text-text-tertiary transition hover:bg-card hover:text-foreground"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 매물 사진 + 정보 오버레이 */}
        <div className="relative mb-3 h-52 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-border/30 to-purple-300/30">
          {property.imageUrl ? (
            <img
              src={property.imageUrl}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <PropertyImagePlaceholder size="md" />
          )}

          {/* 하단 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/65 via-foreground/35 to-transparent px-4 pb-3 pt-12">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="rounded-full border border-card/40 bg-card/90 px-2.5 py-0.5 text-[11px] font-semibold text-purple-800">
                AI 추천
              </span>
              <span className="rounded-full border border-card/40 bg-card/90 px-2.5 py-0.5 text-[11px] font-semibold text-text-tertiary">
                {formatTradeTypeLabel(property.tradeType)}
              </span>
            </div>

            <h2 className="pr-8 text-lg font-bold text-primary-foreground">
              {property.title}
            </h2>

            {property.description && (
              <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-primary-foreground/85">
                {property.description}
              </p>
            )}
          </div>
        </div>

        {/* 가격 + 기본 정보 요약 */}
        <div className="mb-4 rounded-2xl border border-beige-300 bg-green-300/70 px-4 py-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-accent">
                보증금 / 월세
              </p>
              <p className="mt-0.5 text-xl font-bold text-text-secondary">
                {property.priceLabel}
              </p>
            </div>

            {property.routeDurationLabel && (
              <p className="shrink-0 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-text-tertiary">
                {property.routePlaceName
                  ? `${property.routePlaceName}까지`
                  : "목적지까지"}{" "}
                {property.routeDurationLabel}
              </p>
            )}
          </div>

          {property.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {property.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-card/80 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <CompactInfo
              label="거래"
              value={formatTradeTypeLabel(property.tradeType)}
            />
            <CompactInfo label="3D" value={property.has3DModel ? "가능" : "없음"} />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClickInfra}
              className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-md transition hover:bg-purple-700 hover:shadow-lg"
            >
              인프라 보기
            </button>

            <button
              type="button"
              onClick={onClick3D}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-green-800 hover:shadow-lg"
            >
              3D 보기
            </button>
          </div>

          <button
            type="button"
            onClick={onClickDetail}
            className="w-full rounded-xl bg-transparent px-4 py-2.5 text-sm font-semibold text-secondary transition hover:bg-purple-100"
          >
            매물 상세 보기
          </button>
        </div>
      </div>
    </div>
  );
}

function CompactInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/80 px-3 py-2">
      <p className="text-[10px] font-medium text-accent">{label}</p>
      <p className="mt-0.5 truncate text-xs font-semibold text-text-secondary">
        {value}
      </p>
    </div>
  );
}
