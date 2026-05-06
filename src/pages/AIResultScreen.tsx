import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Sparkles,
  Heart,
  CheckCircle2,
  Ruler,
  Footprints,
  Map,
} from "lucide-react";
import { properties } from "../data/dummyProperties";

const AI_SEARCH_COMPLETED_KEY = "rooming_ai_search_completed";

export default function AIResultScreen() {
  const navigate = useNavigate();

  const [selectedPropertyId, setSelectedPropertyId] = useState(
    properties[0]?.id ?? null
  );
  const [myPropertyIds, setMyPropertyIds] = useState<number[]>([]);

  const selectedProperty =
    properties.find((property) => property.id === selectedPropertyId) ??
    properties[0];

  const isMySelected = selectedProperty
    ? myPropertyIds.includes(selectedProperty.id)
    : false;

  const handleToggleMy = () => {
    if (!selectedProperty) return;

    setMyPropertyIds((prev) =>
      prev.includes(selectedProperty.id)
        ? prev.filter((id) => id !== selectedProperty.id)
        : [...prev, selectedProperty.id]
    );
  };

  const handleExitResult = () => {
    // result screen에서 빠져나온 뒤에만 채팅 기록 등록
    sessionStorage.setItem(AI_SEARCH_COMPLETED_KEY, "true");
    navigate("/map");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* 상단 헤더 */}
      <header className="shrink-0 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-3 pt-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-foreground" />
              AI 추천 결과
            </h1>

            <p className="mt-1 text-sm text-text-tertiary">
              조건에 맞는 {properties.length}개의 매물을 추천했어요
            </p>
          </div>

          <button
            type="button"
            onClick={handleExitResult}
            className="flex items-center gap-2.5 rounded-2xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-green-800"
          >
            <Map className="h-5 w-5" />
            지도에서 확인하기
          </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-6 px-6 pb-6 pt-3 lg:grid-cols-[1fr_360px]">
        {/* 왼쪽 상세보기 카드 */}
        {selectedProperty && (
          <section className="flex min-h-0 min-w-0 flex-col rounded-3xl border border-border bg-card shadow-sm">
            <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
                {/* 이미지 + 제목 오버레이 영역 */}
                <div>
                  <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-border/50 to-purple-300/50">
                    {selectedProperty.image ? (
                      <img
                        src={selectedProperty.image}
                        alt={selectedProperty.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Home className="h-24 w-24 text-text-secondary" />
                    )}

                    {/* 이미지 하단 제목 오버레이 */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-foreground/65 via-foreground/35 to-transparent px-5 pb-5 pt-16">
                      <div className="mb-2">
                        <span className="rounded-full border border-card/50 bg-card/90 px-3 py-1 text-xs font-bold text-purple-800">
                          AI 추천 매물
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-primary-foreground drop-shadow-sm">
                        {selectedProperty.title}
                      </h2>

                      <p className="mt-1 text-xl font-bold text-green-300 drop-shadow-sm">
                        {selectedProperty.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <SimpleInfoBadge
                      icon={<Ruler className="h-3.5 w-3.5" />}
                      text={selectedProperty.area}
                    />

                    <SimpleInfoBadge
                      icon={<Footprints className="h-3.5 w-3.5" />}
                      text={`도보 ${selectedProperty.distance}`}
                    />
                  </div>
                </div>

                {/* 설명 영역 */}
                <div className="flex flex-col gap-4">
                  <div className="rounded-3xl border border-border bg-background p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent" />

                      <h3 className="text-lg font-bold text-foreground">
                        추천 이유
                      </h3>
                    </div>

                    <p className="break-keep text-sm leading-7 text-text-secondary">
                      이 매물은 학교와의 거리, 생활 인프라, 가격 조건이 균형 있게
                      맞는 매물이에요.
                    </p>

                    <p className="mt-3 break-keep text-sm leading-7 text-text-secondary">
                      특히{" "}
                      <strong className="text-foreground">
                        {selectedProperty.description}
                      </strong>
                      라는 점에서 생활 편의성이 높다고 볼 수 있어요.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-beige-300 bg-green-300/30 p-5">
                    <p className="text-sm font-bold text-foreground">
                      한 줄 요약
                    </p>

                    <p className="mt-2 break-keep text-sm leading-6 text-text-secondary">
                      학교 근처에서 생활 편의성과 예산 조건을 함께 고려할 때 우선
                      검토하기 좋은 매물이에요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 오른쪽 영역: 추천 매물 리스트 + MY 선택 카드 */}
        <aside className="flex min-h-0 flex-col gap-4">
          {/* 추천 매물 리스트 카드 */}
          <section className="flex min-h-0 flex-1 flex-col rounded-3xl border border-border bg-card shadow-sm">
            <div className="shrink-0 px-5 pb-3 pt-5">
              <h2 className="text-lg font-bold text-foreground">추천 매물</h2>

              <p className="mt-1 text-sm text-text-tertiary">
                매물을 선택하면 왼쪽에서 자세히 볼 수 있어요
              </p>
            </div>

            <div className="mx-5 h-px shrink-0 bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
              <div className="space-y-3">
                {properties.map((property, index) => {
                  const isSelected = property.id === selectedProperty?.id;
                  const isMy = myPropertyIds.includes(property.id);

                  return (
                    <button
                      key={property.id}
                      type="button"
                      onClick={() => setSelectedPropertyId(property.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${isSelected
                          ? "border-primary bg-muted"
                          : "border-border bg-card hover:border-accent"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1 flex items-center gap-1.5">
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                              TOP {index + 1}
                            </span>

                            {isMy && (
                              <span className="rounded-full border border-purple-300 bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                                MY
                              </span>
                            )}
                          </div>

                          <h3 className="truncate text-base font-bold text-foreground">
                            {property.title}
                          </h3>

                          <p className="mt-1 text-lg font-bold text-accent">
                            {property.price}
                          </p>

                          <p className="mt-1 line-clamp-1 text-xs text-text-tertiary">
                            {property.description}
                          </p>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* MY 설명 버튼 카드 */}
          <section className="shrink-0 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground">
                이 매물을 MY 매물로 선택할까요?
              </p>

              <p className="mt-1 text-sm leading-5 text-text-tertiary">
                선택한 매물은 저장되어 다시 확인할 수 있어요.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleMy}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-bold shadow-sm transition ${isMySelected
                  ? "bg-secondary text-primary-foreground hover:bg-purple-700"
                  : "border border-purple-300 bg-card text-purple-800 hover:bg-purple-100"
                }`}
            >
              <Heart
                className={`h-5 w-5 ${isMySelected ? "fill-white" : ""}`}
              />

              {isMySelected ? "MY 선택됨" : "MY로 선택"}
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
}

type SimpleInfoBadgeProps = {
  icon: React.ReactNode;
  text?: string;
};

function SimpleInfoBadge({ icon, text }: SimpleInfoBadgeProps) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-text-secondary">
      {icon}
      {text}
    </span>
  );
}