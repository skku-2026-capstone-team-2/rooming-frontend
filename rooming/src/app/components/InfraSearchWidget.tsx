import { useState } from "react";
import { Coffee, Dumbbell, ShoppingCart, Bus, Search } from "lucide-react";

type InfraSearchResult = {
  categories: string[];
  radius: number;
  customKeyword: string;
};

type InfraSearchWidgetProps = {
  onApply?: (result: InfraSearchResult) => void;
};

const infraCategories = [
  { id: "cafe", label: "카페", icon: <Coffee className="h-3.5 w-3.5" /> },
  { id: "gym", label: "헬스장", icon: <Dumbbell className="h-3.5 w-3.5" /> },
  { id: "mart", label: "편의점", icon: <ShoppingCart className="h-3.5 w-3.5" /> },
  { id: "bus", label: "버스", icon: <Bus className="h-3.5 w-3.5" /> },
];

const radiusOptions = [
  { label: "300m", value: 300 },
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
];

export default function InfraSearchWidget({ onApply }: InfraSearchWidgetProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "cafe",
    "gym",
  ]);
  const [selectedRadius, setSelectedRadius] = useState(500);
  const [customKeyword, setCustomKeyword] = useState("");

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleApply = () => {
    const result = {
      categories: selectedCategories,
      radius: selectedRadius,
      customKeyword: customKeyword.trim(),
    };

    onApply?.(result);
    console.log("인프라 검색 조건 반영:", result);
  };

  return (
    <div className="absolute left-5 top-5 z-20 w-[260px] rounded-2xl border border-[#E8E6DD] bg-white/95 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#4A4530]">인프라 검색</h3>
        {/* <p className="mt-1 text-xs text-[#8B8850]">
          원하는 생활 인프라를 지도에 표시해요.
        </p> */}
      </div>

      <section className="mb-3">
        <div className="mb-2 text-xs font-semibold text-[#6B6847]">
          카테고리
        </div>

        <div className="grid grid-cols-4 gap-2">
          {infraCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);

            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className="flex flex-col items-center gap-1 text-xs font-medium transition"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${isSelected
                    ? "border-[#4A4530] bg-[#4A4530] text-white shadow-sm"
                    : "border-[#EEECCA] bg-white text-[#8B8850] hover:border-[#C1BFFF] hover:bg-[#F5F5FF]"
                    }`}
                >
                  {category.icon}
                </span>

                <span
                  className={`text-[11px] ${isSelected ? "font-semibold text-[#4A4530]" : "text-[#8B8850]"
                    }`}
                >
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-3">
        <div className="mb-2 text-xs font-semibold text-[#6B6847]">
          검색 반경
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {radiusOptions.map((option) => {
            const isSelected = selectedRadius === option.value;

            return (
              <button
                key={option.value}
                onClick={() => setSelectedRadius(option.value)}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium transition ${isSelected
                  ? "bg-[#8B89DD] text-white shadow-sm"
                  : "bg-[#F8F8FF] text-[#5A58AA] hover:bg-[#E8E7FF]"
                  }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-3">
        <div className="mb-2 text-xs font-semibold text-[#6B6847]">
          직접 검색
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#EEECCA] bg-white px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-[#8B8850]" />
          <input
            value={customKeyword}
            onChange={(e) => setCustomKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApply();
              }
            }}
            placeholder="약국, 세탁소 등"
            className="w-full bg-transparent text-xs text-[#4A4530] outline-none placeholder:text-[#B8B47A]"
          />
        </div>
      </section>

      <button
        onClick={handleApply}
        className="w-full rounded-xl bg-[#4A4530] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3D3928]"
      >
        선택 결과 반영
      </button>
    </div>
  );
}