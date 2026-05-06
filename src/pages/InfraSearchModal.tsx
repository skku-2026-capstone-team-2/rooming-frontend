import { useState, type ElementType } from "react";
import { useNavigate } from "react-router";
import {
  Store,
  Coffee,
  Dumbbell,
  Pill,
  UtensilsCrossed,
  Shirt,
  Hospital,
  ShoppingCart,
  Building2,
  BookOpen,
} from "lucide-react";

type InfraCategory = {
  id: string;
  name: string;
  Icon: ElementType;
};

const infraCategories: InfraCategory[] = [
  { id: "convenience", name: "편의점", Icon: Store },
  { id: "cafe", name: "카페", Icon: Coffee },
  { id: "gym", name: "헬스장", Icon: Dumbbell },
  { id: "pharmacy", name: "약국", Icon: Pill },
  { id: "restaurant", name: "음식점", Icon: UtensilsCrossed },
  { id: "laundry", name: "세탁소", Icon: Shirt },
  { id: "hospital", name: "병원", Icon: Hospital },
  { id: "mart", name: "마트", Icon: ShoppingCart },
  { id: "bank", name: "은행", Icon: Building2 },
  { id: "bookstore", name: "서점", Icon: BookOpen },
];

export default function InfraSearchModal() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "convenience",
    "gym",
  ]);
  const [radius, setRadius] = useState(500);
  const [customSearch, setCustomSearch] = useState("");

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">인프라 검색</h1>
          <p className="mt-2 text-text-secondary">
            원하는 생활 인프라를 선택하고 조건을 설정하세요
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-foreground">
              인프라 카테고리
            </h3>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {infraCategories.map((category) => (
                <CategoryButton
                  key={category.id}
                  Icon={category.Icon}
                  label={category.name}
                  selected={selectedCategories.includes(category.id)}
                  onClick={() => toggleCategory(category.id)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-foreground">
              검색 반경
            </h3>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={radius}
                onChange={(event) => setRadius(Number(event.target.value))}
                className="flex-1"
              />

              <div className="w-24 rounded-xl border border-border bg-background px-4 py-2 text-center text-sm font-semibold text-text-secondary">
                {radius}m
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-300 bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-purple-800">
              직접 검색
            </h3>

            <input
              type="text"
              placeholder="검색어를 입력하세요 (예: 스타벅스, 이마트24)"
              value={customSearch}
              onChange={(event) => setCustomSearch(event.target.value)}
              className="w-full rounded-xl border border-purple-300 bg-card px-4 py-3 text-sm text-text-secondary placeholder:text-text-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/10"
            />
          </div>

          <div className="rounded-2xl border border-accent-purple-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-accent-purple">
              선택된 조건
            </h3>

            <div className="space-y-2 text-sm text-accent-purple">
              <div>• 선택한 카테고리: {selectedCategories.length}개</div>
              <div>• 검색 반경: {radius}m</div>
              {customSearch && <div>• 직접 검색: {customSearch}</div>}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold text-text-secondary transition-all hover:bg-background"
          >
            취소
          </button>

          <button
            type="button"
            onClick={() => navigate("/infra-view")}
            className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 hover:shadow-lg"
          >
            검색 결과 보기
          </button>
        </div>
      </div>
    </div>
  );
}

type CategoryButtonProps = {
  Icon: ElementType;
  label: string;
  selected?: boolean;
  onClick: () => void;
};

function CategoryButton({
  Icon,
  label,
  selected = false,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${selected
          ? "border-accent bg-background text-text-tertiary shadow-sm"
          : "border-border bg-card text-text-muted hover:border-accent hover:bg-background"
        }`}
    >
      <Icon className="mx-auto h-5 w-5" />
      <div className="mt-1">{label}</div>
    </button>
  );
}