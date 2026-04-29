import { useState } from "react";
import { useNavigate } from "react-router";
import { Store, Coffee, Dumbbell, Pill, UtensilsCrossed, Shirt, Hospital, ShoppingCart, Building2, BookOpen } from "lucide-react";

const infraCategories = [
  { id: "convenience", name: "편의점", Icon: Store },
  { id: "cafe", name: "카페", Icon: Coffee },
  { id: "gym", name: "헬스장", Icon: Dumbbell },
  { id: "pharmacy", name: "약국", Icon: Pill },
  { id: "restaurant", name: "식당", Icon: UtensilsCrossed },
  { id: "laundry", name: "세탁소", Icon: Shirt },
  { id: "hospital", name: "병원", Icon: Hospital },
  { id: "mart", name: "마트", Icon: ShoppingCart },
];

export default function InfraSearchModal() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["convenience", "gym"]);
  const [radius, setRadius] = useState(500);
  const [customSearch, setCustomSearch] = useState("");

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4A4530]">인프라 검색</h1>
          <p className="mt-2 text-[#6B6847]">원하는 생활 인프라를 선택하고 조건을 설정하세요</p>
        </div>

        <div className="space-y-6">
          {/* 카테고리 선택 */}
          <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#4A4530]">인프라 카테고리</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <CategoryButton Icon={Store} label="편의점" selected />
              <CategoryButton Icon={Coffee} label="카페" selected />
              <CategoryButton Icon={Dumbbell} label="헬스장" />
              <CategoryButton Icon={Pill} label="약국" />
              <CategoryButton Icon={Hospital} label="병원" />
              <CategoryButton Icon={UtensilsCrossed} label="음식점" />
              <CategoryButton Icon={Building2} label="은행" />
              <CategoryButton Icon={BookOpen} label="서점" />
            </div>
          </div>

          {/* 반경 설정 */}
          <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#4A4530]">검색 반경</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="flex-1"
              />
              <div className="w-24 rounded-xl border border-[#E8E6DD] bg-[#FDFCF8] px-4 py-2 text-center text-sm font-semibold text-[#6B6847]">
                {radius}m
              </div>
            </div>
          </div>

          {/* 직접 검색 */}
          <div className="rounded-2xl border border-[#D8D7F5] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#5A58AA]">직접 검색</h3>
            <input
              type="text"
              placeholder="검색어를 입력하세요 (예: 스타벅스, 이마트24)"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D8D7F5] bg-white px-4 py-3 text-sm text-[#6B6847] placeholder-[#B8B69F] focus:border-[#8B89DD] focus:outline-none focus:ring-2 focus:ring-[#8B89DD]/10"
            />
          </div>

          {/* 선택된 조건 요약 */}
          <div className="rounded-2xl border border-[#E8DBFF] bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-[#8E3BA8]">선택된 조건</h3>
            <div className="space-y-2 text-sm text-[#8E3BA8]">
              <div>
                • 선택한 카테고리: {selectedCategories.length}개
              </div>
              <div>• 검색 반경: {radius}m</div>
              {customSearch && <div>• 직접 검색: {customSearch}</div>}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate("/map")}
            className="rounded-xl border border-[#E8E6DD] bg-white px-6 py-3 text-base font-semibold text-[#6B6847] hover:bg-[#FDFCF8] transition-all"
          >
            취소
          </button>
          <button
            onClick={() => navigate("/infra-view")}
            className="rounded-xl bg-[#4A4530] px-6 py-3 text-base font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg"
          >
            검색 결과 보기
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryButton({
  Icon,
  label,
  selected = false,
}: {
  Icon: React.ElementType;
  label: string;
  selected?: boolean;
}) {
  return (
    <button
      className={`rounded-xl px-4 py-3 text-sm font-medium transition-all border ${selected
          ? "border-[#BDB96A] bg-[#FDFCF8] text-[#8B8850] shadow-sm"
          : "border-[#E8E6DD] bg-white text-[#B8B69F] hover:bg-[#FDFCF8] hover:border-[#BDB96A]"
        }`}
    >
      <Icon className="mx-auto h-5 w-5" />
      <div className="mt-1">{label}</div>
    </button>
  );
}