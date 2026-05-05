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

type InfraCategoryFloatingButtonsProps = {
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
};

const infraCategories = [
  { id: "cafe", label: "카페", icon: <Coffee className="h-3.5 w-3.5" /> },
  { id: "gym", label: "헬스장", icon: <Dumbbell className="h-3.5 w-3.5" /> },
  {
    id: "store",
    label: "편의점",
    icon: <ShoppingCart className="h-3.5 w-3.5" />,
  },
  { id: "bus", label: "버스", icon: <Bus className="h-3.5 w-3.5" /> },
];

const radiusOptions = [
  { label: "300m", value: 300 },
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
];

export default function InfraSearchWidget({ onApply }: InfraSearchWidgetProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRadius, setSelectedRadius] = useState(500);
  const [customKeyword, setCustomKeyword] = useState("");

  const applySearch = (
    nextCategories: string[],
    nextRadius: number,
    nextKeyword: string
  ) => {
    const result = {
      categories: nextCategories,
      radius: nextRadius,
      customKeyword: nextKeyword.trim(),
    };

    onApply?.(result);
    console.log("인프라 검색 조건 반영:", result);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const nextCategories = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      applySearch(nextCategories, selectedRadius, customKeyword);

      return nextCategories;
    });
  };

  const handleRadiusChange = (radius: number) => {
    setSelectedRadius(radius);
    applySearch(selectedCategories, radius, customKeyword);
  };

  const handleApply = () => {
    applySearch(selectedCategories, selectedRadius, customKeyword);
  };

  return (
    <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-start gap-3">
      <div className="pointer-events-auto w-[260px] rounded-2xl border border-[#E8E6DD] bg-white/95 p-4 shadow-md backdrop-blur-sm">
        <section className="mb-3">
          <div className="mb-2 text-xs font-semibold text-[#6B6847]">
            검색 반경 선택
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {radiusOptions.map((option) => {
              const isSelected = selectedRadius === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRadiusChange(option.value)}
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
            검색 인프라 입력
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
          type="button"
          onClick={handleApply}
          className="w-full rounded-xl bg-[#4A4530] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3D3928]"
        >
          인프라 검색하기
        </button>
      </div>

      <InfraCategoryFloatingButtons
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />
    </div>
  );
}

function InfraCategoryFloatingButtons({
  selectedCategories,
  onToggleCategory,
}: InfraCategoryFloatingButtonsProps) {
  return (
    <div className="pointer-events-auto bg-transparent px-3 py-2.5">
      <div className="flex items-center gap-2">
        {infraCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggleCategory(category.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition ${isSelected
                ? "border-[#4A4530] bg-[#4A4530] text-white"
                : "border-[#EEECCA] bg-white text-[#8B8850] hover:border-[#C1BFFF] hover:bg-[#F5F5FF]"
                }`}
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center">
                {category.icon}
              </span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}