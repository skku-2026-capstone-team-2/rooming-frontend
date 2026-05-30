import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Bus,
  Home,
  Loader2,
  MapPin,
  Plus,
  School,
  Search,
  TrainFront,
  X,
} from "lucide-react";
import PreferenceBoard from "../components/PreferenceBoard";
import { useOnboardingDraft } from "../hooks/useOnboardingDraft";
import {
  PLACE_CATEGORY_LABELS,
  REQUIRED_PLACE_CATEGORY,
  toRecommendationPreferences,
  toTargetPlaceCreateRequest,
  type OnboardingPlaceDraft,
} from "../api/mappers/onboardingMapper";
import type { PlaceCategory } from "../types";

type PlaceSearchResult = {
  placeName: string;
  roadAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

const MAX_PLACE_COUNT = 3;

const placeTypeOptions: {
  type: PlaceCategory;
  label: string;
  icon: ReactNode;
  required?: boolean;
}[] = [
    {
      type: "SCHOOL",
      label: PLACE_CATEGORY_LABELS.SCHOOL,
      icon: <School className="h-4 w-4" />,
      required: true,
    },
    {
      type: "HOME",
      label: PLACE_CATEGORY_LABELS.HOME,
      icon: <Home className="h-4 w-4" />,
    },
    {
      type: "WORK_PLACE",
      label: PLACE_CATEGORY_LABELS.WORK_PLACE,
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      type: "SUBWAY_STATION",
      label: PLACE_CATEGORY_LABELS.SUBWAY_STATION,
      icon: <TrainFront className="h-4 w-4" />,
    },
    {
      type: "BUS_TERMINAL",
      label: PLACE_CATEGORY_LABELS.BUS_TERMINAL,
      icon: <Bus className="h-4 w-4" />,
    },
    {
      type: "ETC",
      label: PLACE_CATEGORY_LABELS.ETC,
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

// TODO: 실제 API 연결 시 이 함수만 fetch로 교체하면 됨
async function searchPlacesByKeyword(
  keyword: string
): Promise<PlaceSearchResult[]> {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) return [];

  // 실제 API 연결 예시
  // const response = await fetch(
  //   `/api/places/search?keyword=${encodeURIComponent(trimmedKeyword)}`
  // );
  //
  // const result = await response.json();
  //
  // if (!result.success) {
  //   throw new Error(result.message || "장소 검색에 실패했습니다.");
  // }
  //
  // return result.data.places;

  await new Promise((resolve) => setTimeout(resolve, 400));

  return [
    {
      placeName: trimmedKeyword,
      roadAddress: "경기 수원시 장안구 서부로 2066",
      location: {
        latitude: 37.2945,
        longitude: 126.9748,
      },
    },
    {
      placeName: `${trimmedKeyword} 정문`,
      roadAddress: "서울 종로구 성균관로 25-2",
      location: {
        latitude: 37.5882,
        longitude: 126.9936,
      },
    },
  ];
}

export default function OnboardingScreen() {
  const navigate = useNavigate();

  // 화면 이동·새로고침 시 유지되는 입력(주요 장소·선호 조건)은 draft 훅에서 관리한다.
  const { places, preferences, setPlaces, setPreferences } =
    useOnboardingDraft();
  const [placeType, setPlaceType] = useState<PlaceCategory>(
    REQUIRED_PLACE_CATEGORY
  );

  // 검색 보조용 일시 상태(유지하지 않음).
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(
    null
  );

  const [memo, setMemo] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const canAddMorePlace = places.length < MAX_PLACE_COUNT;
  const isUniversityRegistered = places.some(
    (place) => place.category === REQUIRED_PLACE_CATEGORY
  );

  const togglePreference = (label: string) => {
    setPreferences((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleSearchPlace = async () => {
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      setIsSearching(true);
      setSelectedPlace(null);

      const results = await searchPlacesByKeyword(keyword);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      alert("장소 검색에 실패했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (place: PlaceSearchResult) => {
    setSelectedPlace(place);
  };

  const handleAddPlace = () => {
    if (!canAddMorePlace) return;

    if (!selectedPlace) {
      alert("검색 결과에서 장소를 선택해주세요.");
      return;
    }

    if (placeType === REQUIRED_PLACE_CATEGORY && isUniversityRegistered) {
      alert("학교 건물은 한 개만 등록할 수 있습니다.");
      return;
    }

    const newPlace: OnboardingPlaceDraft = {
      category: placeType,
      placeName: selectedPlace.placeName,
      roadAddress: selectedPlace.roadAddress,
      location: selectedPlace.location,
      memo: memo.trim(),
    };

    setPlaces((prev) => [...prev, newPlace]);

    setKeyword("");
    setSearchResults([]);
    setSelectedPlace(null);
    setMemo("");

    setPlaceType(isUniversityRegistered ? "HOME" : REQUIRED_PLACE_CATEGORY);
  };

  const handleRemovePlace = (index: number) => {
    setPlaces((prev) => prev.filter((_, placeIndex) => placeIndex !== index));
  };

  const handleNext = () => {
    if (!isUniversityRegistered) {
      alert("학교 건물은 필수로 등록해야 합니다.");
      return;
    }

    // 주요 장소 → target-place 요청 payload, 선호 조건 → recommendation preferences로 변환.
    // (실제 API 호출은 후속 이슈 #19에서 연결한다.)
    const targetPlaceRequests = places.map(toTargetPlaceCreateRequest);
    const recommendationPreferences = toRecommendationPreferences(preferences);

    console.log("POST target-place payloads", targetPlaceRequests);
    console.log("recommendation preferences", recommendationPreferences);

    navigate("/map");
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-6 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-5 shrink-0">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Onboarding
          </p>

          <h1 className="text-2xl font-bold text-green-800">
            주요 장소를 등록해주세요
          </h1>

          <p className="mt-1.5 text-sm text-text-tertiary">
            장소를 직접 입력하지 않고 검색 결과에서 선택해 등록합니다. 학교
            건물은 필수이며, 최대 3개까지 등록할 수 있어요.
          </p>
        </div>

        {/* 본문 */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* 왼쪽: 장소 검색 및 등록 */}
          <section className="flex min-h-0 flex-col rounded-3xl border border-beige-300 bg-green-300/55 p-5 shadow-md">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-green-800">
                  장소 검색 등록
                </h2>
                <p className="mt-1 text-sm text-text-tertiary">
                  장소 타입을 고른 뒤, 키워드로 장소를 검색하세요.
                </p>
              </div>

              <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-text-tertiary">
                {places.length} / {MAX_PLACE_COUNT}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {/* 장소 타입 */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  장소 타입
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {placeTypeOptions.map((option) => {
                    const isSelected = placeType === option.type;
                    const isUniversityDisabled =
                      option.type === REQUIRED_PLACE_CATEGORY &&
                      isUniversityRegistered;

                    return (
                      <button
                        key={option.type}
                        type="button"
                        disabled={isUniversityDisabled}
                        onClick={() => setPlaceType(option.type)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-beige-300 bg-card text-text-secondary hover:border-accent"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </span>

                        {option.required && (
                          <span className="text-[10px] font-bold">필수</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 장소 검색 */}
              <div className="rounded-2xl border border-beige-300 bg-card/90 p-4 shadow-sm">
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  장소 검색
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchPlace();
                      }
                    }}
                    placeholder="예: 성균관대학교 자연과학캠퍼스"
                    className="min-w-0 flex-1 rounded-xl border border-beige-300 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-ring/15"
                  />

                  <button
                    type="button"
                    onClick={handleSearchPlace}
                    disabled={isSearching}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-beige-200"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    검색
                  </button>
                </div>

                {/* 검색 결과 */}
                <div className="mt-4 space-y-2">
                  {searchResults.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-beige-300 bg-background/80 px-4 py-6 text-center">
                      <p className="text-sm font-semibold text-text-muted">
                        검색 결과가 여기에 표시됩니다.
                      </p>
                    </div>
                  ) : (
                    searchResults.map((place) => {
                      const isSelected =
                        selectedPlace?.placeName === place.placeName &&
                        selectedPlace?.roadAddress === place.roadAddress;

                      return (
                        <button
                          key={`${place.placeName}-${place.roadAddress}`}
                          type="button"
                          onClick={() => handleSelectPlace(place)}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${isSelected
                            ? "border-primary bg-green-300/50 shadow-sm"
                            : "border-beige-300 bg-background/90 hover:border-accent"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-green-300/60 text-text-secondary"
                                }`}
                            >
                              <MapPin className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-green-800">
                                {place.placeName}
                              </p>
                              <p className="mt-1 truncate text-xs text-text-tertiary">
                                {place.roadAddress}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* 선택된 장소 */}
                {selectedPlace && (
                  <div className="mt-4 rounded-xl border border-beige-300 bg-green-300/45 p-4">
                    <p className="mb-2 text-xs font-bold text-text-muted">
                      선택된 장소
                    </p>

                    <p className="text-sm font-bold text-green-800">
                      {selectedPlace.placeName}
                    </p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      {selectedPlace.roadAddress}
                    </p>
                  </div>
                )}

                {/* 메모 */}
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    메모
                  </label>

                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 학교 정문 기준, 본가 기준, 알바 끝나는 장소"
                    className="w-full rounded-xl border border-beige-300 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-ring/15"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddPlace}
                  disabled={!canAddMorePlace || !selectedPlace}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-beige-200"
                >
                  <Plus className="h-4 w-4" />
                  선택한 장소 등록
                </button>
              </div>

              {/* 등록된 장소 */}
              <div className="mt-5 space-y-3">
                {places.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-beige-200 bg-card px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-text-muted">
                      아직 등록된 장소가 없어요.
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      학교 건물을 먼저 등록해주세요.
                    </p>
                  </div>
                ) : (
                  places.map((place, index) => {
                    const option = placeTypeOptions.find(
                      (item) => item.type === place.category
                    );

                    return (
                      <div
                        key={`${place.category}-${place.placeName}-${index}`}
                        className="rounded-2xl border border-border bg-card p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-text-secondary">
                              {option?.icon}
                            </div>

                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <p className="text-xs font-bold text-text-muted">
                                  {option?.label}
                                </p>

                                {place.category === REQUIRED_PLACE_CATEGORY && (
                                  <span className="rounded-full bg-green-300/40 px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                                    필수 등록
                                  </span>
                                )}
                              </div>

                              <p className="truncate text-sm font-bold text-green-800">
                                {place.placeName}
                              </p>

                              <p className="mt-1 truncate text-xs text-text-tertiary">
                                {place.roadAddress}
                              </p>

                              {place.memo && (
                                <p className="mt-2 rounded-lg bg-background px-3 py-2 text-xs text-text-secondary">
                                  {place.memo}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePlace(index)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-muted transition-all hover:bg-muted hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* 오른쪽: 선호 조건 */}
          <section className="flex min-h-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-5 shrink-0">
              <h2 className="text-lg font-bold text-green-800">
                기본 선호 조건
              </h2>

              <p className="mt-1 text-sm text-text-tertiary">
                예산, 거리, 생활 인프라 등 추천에 반영할 조건을 선택하세요.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <PreferenceBoard
                selected={preferences}
                onToggle={togglePreference}
              />
            </div>
          </section>
        </div>

        {/* 네비게이션 */}
        <div className="mt-5 flex shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-beige-200 hover:bg-background"
          >
            뒤로가기
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 hover:shadow-lg"
          >
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
}
