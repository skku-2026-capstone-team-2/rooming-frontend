import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
  id: string;
  label: string;
  options: string[];
};

// ─── Hardcoded label data ─────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: "transport",
    label: "거리/교통",
    options: [
      "캠퍼스 도보 10분 이내",
      "버스 정류장 가까움",
      "지하철역 가까움",
      "주차 가능",
    ],
  },
  {
    id: "cost",
    label: "비용",
    options: [
      "월세 30만원 이하",
      "월세 40만원 이하",
      "월세 50만원 이하",
      "월세 60만원 이하",
      "월세 70만원 이하",
      "관리비 포함",
      "보증금 500만원 이하",
      "보증금 1,000만원 이하",
      "보증금 2,000만원 이하",
      "보증금 3,000만원 이하",
      "보증금 5,000만원 이하",
    ],
  },
  {
    id: "living",
    label: "주거 환경",
    options: [
      "햇빛 잘 드는 방 (남향)",
      "층수 높음 선호",
      "신축/리모델링",
      "조용한 환경",
      "반려동물 가능",
    ],
  },
  {
    id: "amenity",
    label: "편의시설",
    options: [
      "편의점 가까움",
      "마트/슈퍼 가까움",
      "카페 가까움",
      "헬스장 가까움",
      "병원/약국 가까움",
      "세탁소 가까움",
    ],
  },
  {
    id: "safety",
    label: "보안/안전",
    options: [
      "CCTV 설치",
      "여성 전용 건물",
      "도어락 설치",
      "1층 아님",
    ],
  },
  {
    id: "facility",
    label: "옵션/시설",
    options: [
      "에어컨 포함",
      "세탁기 포함",
      "냉장고 포함",
      "인터넷 포함",
      "가스레인지",
      "인덕션",
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PreferenceBoard() {
  const [activeCategory, setActiveCategory] = useState("transport");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const currentOptions =
    CATEGORIES.find((c) => c.id === activeCategory)?.options ?? [];

  const countFor = (cat: Category) =>
    cat.options.filter((o) => selected.has(o)).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-300 bg-card shadow-sm">
      {/* Header */}
      <div className="hidden">
        <span className="text-lg font-semibold text-purple-800">선호 조건</span>
        {selected.size > 0 && (
          <span className="rounded-full bg-purple-800 px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
            {selected.size}개 선택
          </span>
        )}
      </div>

      <div className="flex min-h-[340px]">
        {/* Sidebar */}
        <nav className="w-28 shrink-0 border-r border-purple-200 bg-purple-100/80 py-3">
          {CATEGORIES.map((cat) => {
            const count = countFor(cat);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative w-full px-3 py-2.5 text-left text-[13px] font-semibold transition-colors duration-150 ${isActive
                  ? "bg-card text-purple-800"
                  : "text-purple-500 hover:text-purple-800"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-purple-800" />
                )}
                {cat.label}
                {count > 0 && (
                  <span className="ml-1 inline-block rounded-full bg-purple-800/15 px-1.5 text-[10px] font-bold text-purple-800">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Options */}
        <div className="flex-1 p-4">
          {selected.size > 0 && (
            <div className="mb-3 flex justify-end">
              <span className="rounded-full bg-purple-800 px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                {selected.size}개 선택
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {currentOptions.map((label) => {
              const isSelected = selected.has(label);
              return (
                <button
                  key={label}
                  onClick={() => toggle(label)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-all duration-150 ${isSelected
                    ? "border-purple-800 bg-purple-800 text-secondary-foreground shadow-sm"
                    : "border-purple-200 bg-purple-100 text-purple-800 hover:border-purple-800/50 hover:bg-purple-50"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected tags */}
      {selected.size > 0 && (
        <div className="border-t border-purple-200 bg-purple-100 px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {Array.from(selected).map((label) => (
              <span
                key={label}
                className="flex items-center gap-1 rounded-full bg-purple-800/10 px-2.5 py-0.5 text-xs font-medium text-purple-800"
              >
                {label}
                <button
                  onClick={() => toggle(label)}
                  className="ml-0.5 leading-none text-purple-800/50 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
