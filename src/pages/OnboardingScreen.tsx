import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Home,
  Loader2,
  MapPin,
  Plus,
  School,
  Search,
  X,
} from "lucide-react";
import PreferenceBoard from "../components/PreferenceBoard";

type PlaceType = "UNIVERSITY" | "HOME" | "WORK" | "CUSTOM";

type PlaceSearchResult = {
  placeName: string;
  roadAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

type UserPlacePayload = {
  placeType: PlaceType;
  placeName: string;
  roadAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  memo: string;
  isActive: boolean;
};

const MAX_PLACE_COUNT = 3;

const placeTypeOptions: {
  type: PlaceType;
  label: string;
  icon: ReactNode;
  required?: boolean;
}[] = [
    {
      type: "UNIVERSITY",
      label: "학교 건물",
      icon: <School className="h-4 w-4" />,
      required: true,
    },
    {
      type: "HOME",
      label: "본가",
      icon: <Home className="h-4 w-4" />,
    },
    {
      type: "WORK",
      label: "아르바이트",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      type: "CUSTOM",
      label: "기타",
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

  const [places, setPlaces] = useState<UserPlacePayload[]>([]);
  const [placeType, setPlaceType] = useState<PlaceType>("UNIVERSITY");

  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(
    null
  );

  const [memo, setMemo] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const canAddMorePlace = places.length < MAX_PLACE_COUNT;
  const isUniversityRegistered = places.some(
    (place) => place.placeType === "UNIVERSITY"
  );

  const selectedTypeOption = placeTypeOptions.find(
    (option) => option.type === placeType
  );

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

    if (placeType === "UNIVERSITY" && isUniversityRegistered) {
      alert("학교 건물은 한 개만 등록할 수 있습니다.");
      return;
    }

    const newPlace: UserPlacePayload = {
      placeType,
      placeName: selectedPlace.placeName,
      roadAddress: selectedPlace.roadAddress,
      location: selectedPlace.location,
      memo: memo.trim(),
      isActive: true,
    };

    setPlaces((prev) => [...prev, newPlace]);

    setKeyword("");
    setSearchResults([]);
    setSelectedPlace(null);
    setMemo("");

    setPlaceType(isUniversityRegistered ? "HOME" : "UNIVERSITY");
  };

  const handleRemovePlace = (index: number) => {
    setPlaces((prev) => prev.filter((_, placeIndex) => placeIndex !== index));
  };

  const handleNext = () => {
    if (!isUniversityRegistered) {
      alert("학교 건물은 필수로 등록해야 합니다.");
      return;
    }

    console.log("POST /users/me/user-places", places);
    navigate("/map");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FDFCF8]">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-6 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-5 shrink-0">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#B8B69F]">
            Onboarding
          </p>

          <h1 className="text-2xl font-bold text-[#3A3520]">
            주요 장소를 등록해주세요
          </h1>

          <p className="mt-1.5 text-sm text-[#9B9872]">
            장소를 직접 입력하지 않고 검색 결과에서 선택해 등록합니다. 학교
            건물은 필수이며, 최대 3개까지 등록할 수 있어요.
          </p>
        </div>

        {/* 본문 */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* 왼쪽: 장소 검색 및 등록 */}
          <section className="flex min-h-0 flex-col rounded-3xl border border-[#E8E6DD] bg-white p-5 shadow-sm">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#3A3520]">
                  장소 검색 등록
                </h2>
                <p className="mt-1 text-sm text-[#9B9872]">
                  장소 타입을 고른 뒤, 키워드로 장소를 검색하세요.
                </p>
              </div>

              <span className="rounded-full bg-[#F8F7F1] px-3 py-1.5 text-xs font-bold text-[#8B8850]">
                {places.length} / {MAX_PLACE_COUNT}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {/* 장소 타입 */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-[#4A4530]">
                  장소 타입
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {placeTypeOptions.map((option) => {
                    const isSelected = placeType === option.type;
                    const isUniversityDisabled =
                      option.type === "UNIVERSITY" && isUniversityRegistered;

                    return (
                      <button
                        key={option.type}
                        type="button"
                        disabled={isUniversityDisabled}
                        onClick={() => setPlaceType(option.type)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${isSelected
                          ? "border-[#4A4530] bg-[#4A4530] text-white"
                          : "border-[#E8E6DD] bg-[#FDFCF8] text-[#6B6847] hover:border-[#BDB96A]"
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
              <div className="rounded-2xl border border-[#E8E6DD] bg-[#FDFCF8] p-4">
                <label className="mb-2 block text-sm font-semibold text-[#4A4530]">
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
                    className="min-w-0 flex-1 rounded-xl border border-[#E8E6DD] bg-white px-4 py-2.5 text-sm text-[#4A4530] placeholder-[#C8C6AF] outline-none transition-all focus:border-[#BDB96A] focus:ring-2 focus:ring-[#BDB96A]/15"
                  />

                  <button
                    type="button"
                    onClick={handleSearchPlace}
                    disabled={isSearching}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#4A4530] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3A3520] disabled:cursor-not-allowed disabled:bg-[#D8D6CD]"
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
                    <div className="rounded-xl border border-dashed border-[#D8D6CD] bg-white px-4 py-6 text-center">
                      <p className="text-sm font-semibold text-[#B8B69F]">
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
                            ? "border-[#4A4530] bg-white shadow-sm"
                            : "border-[#E8E6DD] bg-white hover:border-[#BDB96A]"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isSelected
                                ? "bg-[#4A4530] text-white"
                                : "bg-[#F8F7F1] text-[#8B8850]"
                                }`}
                            >
                              <MapPin className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#3A3520]">
                                {place.placeName}
                              </p>
                              <p className="mt-1 truncate text-xs text-[#9B9872]">
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
                  <div className="mt-4 rounded-xl bg-white p-4">
                    <p className="mb-2 text-xs font-bold text-[#B8B69F]">
                      선택된 장소
                    </p>

                    <p className="text-sm font-bold text-[#3A3520]">
                      {selectedPlace.placeName}
                    </p>
                    <p className="mt-1 text-xs text-[#9B9872]">
                      {selectedPlace.roadAddress}
                    </p>
                  </div>
                )}

                {/* 메모 */}
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-[#4A4530]">
                    메모
                  </label>

                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 학교 정문 기준, 본가 기준, 알바 끝나는 장소"
                    className="w-full rounded-xl border border-[#E8E6DD] bg-white px-4 py-2.5 text-sm text-[#4A4530] placeholder-[#C8C6AF] outline-none transition-all focus:border-[#BDB96A] focus:ring-2 focus:ring-[#BDB96A]/15"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddPlace}
                  disabled={!canAddMorePlace || !selectedPlace}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A4530] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#3A3520] disabled:cursor-not-allowed disabled:bg-[#D8D6CD]"
                >
                  <Plus className="h-4 w-4" />
                  선택한 장소 등록
                </button>
              </div>

              {/* 등록된 장소 */}
              <div className="mt-5 space-y-3">
                {places.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#D8D6CD] bg-white px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-[#B8B69F]">
                      아직 등록된 장소가 없어요.
                    </p>
                    <p className="mt-1 text-xs text-[#C8C6AF]">
                      학교 건물을 먼저 등록해주세요.
                    </p>
                  </div>
                ) : (
                  places.map((place, index) => {
                    const option = placeTypeOptions.find(
                      (item) => item.type === place.placeType
                    );

                    return (
                      <div
                        key={`${place.placeType}-${place.placeName}-${index}`}
                        className="rounded-2xl border border-[#E8E6DD] bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F7F1] text-[#6B6847]">
                              {option?.icon}
                            </div>

                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <p className="text-xs font-bold text-[#B8B69F]">
                                  {option?.label}
                                </p>

                                {place.placeType === "UNIVERSITY" && (
                                  <span className="rounded-full bg-[#F0F4DF] px-2 py-0.5 text-[10px] font-bold text-[#6B6847]">
                                    필수 등록
                                  </span>
                                )}
                              </div>

                              <p className="truncate text-sm font-bold text-[#3A3520]">
                                {place.placeName}
                              </p>

                              <p className="mt-1 truncate text-xs text-[#9B9872]">
                                {place.roadAddress}
                              </p>

                              {place.memo && (
                                <p className="mt-2 rounded-lg bg-[#FDFCF8] px-3 py-2 text-xs text-[#6B6847]">
                                  {place.memo}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePlace(index)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#B8B69F] transition-all hover:bg-[#F8F7F1] hover:text-[#4A4530]"
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
          <section className="flex min-h-0 flex-col rounded-3xl border border-[#E8E6DD] bg-white p-5 shadow-sm">
            <div className="mb-5 shrink-0">
              <h2 className="text-lg font-bold text-[#3A3520]">
                기본 선호 조건
              </h2>

              <p className="mt-1 text-sm text-[#9B9872]">
                예산, 거리, 생활 인프라 등 추천에 반영할 조건을 선택하세요.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <PreferenceBoard />
            </div>
          </section>
        </div>

        {/* 네비게이션 */}
        <div className="mt-5 flex shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl border border-[#E8E6DD] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B6847] transition-all hover:border-[#D8D6CD] hover:bg-[#FDFCF8]"
          >
            뒤로가기
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-[#4A4530] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#3A3520] hover:shadow-lg"
          >
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
}