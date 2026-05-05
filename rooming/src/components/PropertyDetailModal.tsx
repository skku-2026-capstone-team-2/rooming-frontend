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
  onClick3D?: () => void;
  onClickInfra?: () => void;
};

export default function PropertyDetailModal({
  isOpen,
  property,
  onClose,
  onClick3D,
  onClickInfra,
}: PropertyDetailModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#E8E6DD] bg-white p-5 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-[#8B8850] shadow-sm transition hover:bg-white hover:text-[#4A4530]"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 매물 사진 + 정보 오버레이 */}
        <div className="relative mb-4 flex h-60 items-center justify-center overflow-hidden rounded-2xl border border-[#E8E6DD] bg-gradient-to-br from-[#E8E6DD]/30 to-[#D8D7F5]/30">
          <div className="text-center">
            <Home className="mx-auto mb-3 h-16 w-16 text-[#6B6847]" />
            <p className="text-sm font-medium text-[#6B6847]">매물 사진 영역</p>
          </div>

          {/* 하단 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/35 to-transparent px-5 pb-4 pt-14">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-[#5A58AA]">
                AI 추천
              </span>
              <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-[#8B8850]">
                원룸
              </span>
            </div>

            <h2 className="pr-10 text-xl font-bold text-white">
              {property.title}
            </h2>

            {property.description && (
              <p className="mt-1 line-clamp-1 text-sm leading-6 text-white/85">
                {property.description}
              </p>
            )}
          </div>
        </div>

        {/* 보증금 / 월세 */}
        <div className="mb-4 rounded-2xl border border-[#EEECCA] bg-[#FDFBD4] px-4 py-3">
          <p className="text-sm font-medium text-[#BDB96A]">보증금 / 월세</p>
          <p className="mt-1 text-2xl font-bold text-[#6B6847]">
            {property.price}
          </p>
        </div>

        {/* 간단 상세 정보 */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <SimpleInfo label="면적" value={property.area ?? "23.1㎡"} />
          <SimpleInfo label="층수" value="3/5층" />
          <SimpleInfo label="관리비" value="5만원" />
          <SimpleInfo label="거리" value={property.distance ?? "정문 도보 12분"} />
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClickInfra}
            className="rounded-xl border border-[#D8D7F5] bg-white px-4 py-3 text-sm font-semibold text-[#8B89DD] transition hover:bg-[#F8F8FF]"
          >
            인프라 보기
          </button>

          <button
            type="button"
            onClick={onClick3D}
            className="rounded-xl bg-[#4A4530] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#3A3520] hover:shadow-lg"
          >
            3D 보기
          </button>
        </div>
      </div>
    </div>
  );
}

function SimpleInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E8E6DD] bg-[#FDFCF8] px-4 py-3">
      <p className="text-xs font-medium text-[#BDB96A]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#6B6847]">{value}</p>
    </div>
  );
}