import { Home, X } from "lucide-react";

type Property = {
  id: number;
  title: string;
  price: string;
  description?: string;
  area?: string;
  distance?: string;
  lat: number;
  lng: number;
};

type PropertyDetailModalProps = {
  isOpen: boolean;
  property: Property | null;
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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 px-4 pl-[180px]">
      <div className="relative w-full max-w-md rounded-3xl border border-[#E8E6DD] bg-white p-4 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full  p-2 text-[#8B8850] hover:text-[#4A4530]"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 매물 사진 + 정보 오버레이 */}
        <div className="relative mb-3 flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-[#E8E6DD] bg-gradient-to-br from-[#E8E6DD]/30 to-[#D8D7F5]/30">
          <div className="text-center">
            <Home className="mx-auto mb-2 h-14 w-14 text-[#6B6847]" />
            <p className="text-xs font-medium text-[#6B6847]">
              매물 사진 영역
            </p>
          </div>

          {/* 하단 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent px-4 pb-3 pt-12">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="rounded-full border border-white/40 bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#5A58AA]">
                AI 추천
              </span>
              <span className="rounded-full border border-white/40 bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#8B8850]">
                원룸
              </span>
            </div>

            <h2 className="pr-8 text-lg font-bold text-white">
              {property.title}
            </h2>

            {property.description && (
              <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-white/85">
                {property.description}
              </p>
            )}
          </div>
        </div>

        {/* 가격 + 기본 정보 요약 */}
        <div className="mb-4 rounded-2xl border border-[#EEECCA] bg-[#FDFBD4]/70 px-4 py-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[#BDB96A]">
                보증금 / 월세
              </p>
              <p className="mt-0.5 text-xl font-bold text-[#6B6847]">
                {property.price}
              </p>
            </div>

            <p className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#8B8850]">
              정문까지 {property.distance ?? "정문 도보 12분"}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <CompactInfo label="면적" value={property.area ?? "23.1㎡"} />
            <CompactInfo label="층수" value="3/5층" />
            <CompactInfo label="관리비" value="5만원" />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClickInfra}
              className="rounded-xl bg-[#8B89DD] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#7471CC] hover:shadow-lg"
            >
              인프라 보기
            </button>

            <button
              type="button"
              onClick={onClick3D}
              className="rounded-xl bg-[#4A4530] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#3A3520] hover:shadow-lg"
            >
              3D 보기
            </button>
          </div>

          <button
            type="button"
            onClick={onClickDetail}
            className="w-full rounded-xl bg-transparent px-4 py-2.5 text-sm font-semibold text-[#8B89DD] transition hover:bg-[#F8F8FF]"
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
    <div className="rounded-xl bg-white/80 px-3 py-2">
      <p className="text-[10px] font-medium text-[#BDB96A]">{label}</p>
      <p className="mt-0.5 truncate text-xs font-semibold text-[#6B6847]">
        {value}
      </p>
    </div>
  );
}