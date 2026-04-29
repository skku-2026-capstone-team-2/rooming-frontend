import { useState } from "react";
import { useNavigate } from "react-router";

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState(["정문", "도서관", "헬스장"]);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4A4530]">주요 장소 등록</h1>
          <p className="mt-2 text-[#6B6847]">자주 가는 장소를 등록하고 선호 조건을 설정하세요</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-semibold text-[#4A4530]">주요 장소 검색</div>
            <input
              type="text"
              placeholder="장소를 검색하세요 (예: 성균관대 정문)"
              className="w-full rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm text-[#6B6847] placeholder-[#B8B69F] focus:border-[#BDB96A] focus:outline-none focus:ring-2 focus:ring-[#BDB96A]/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
              <div className="mb-4 text-lg font-semibold text-[#4A4530]">등록 장소</div>
              <div className="space-y-3">
                <div className="rounded-xl bg-[#FDFCF8] p-4 border border-[#F0EFE8]">
                  <div className="text-sm font-medium text-[#8B8850]">통학 기준 장소</div>
                  <div className="mt-1 text-base font-semibold text-[#6B6847]">성균관대 정문</div>
                </div>
                <div className="rounded-xl bg-[#FDFCF8] p-4 border border-[#F0EFE8]">
                  <div className="text-sm font-medium text-[#8B8850]">생활 기준 장소</div>
                  <div className="mt-1 text-base font-semibold text-[#6B6847]">스타벅스 성대점</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D8D7F5] bg-white p-6 shadow-sm">
              <div className="mb-4 text-lg font-semibold text-[#5A58AA]">선호 조건</div>
              <div className="space-y-3">
                <div className="rounded-xl bg-[#F8F8FF] p-4 text-base text-[#5A58AA] border border-[#E8E7FF]">월세 60 이하</div>
                <div className="rounded-xl bg-[#F8F8FF] p-4 text-base text-[#5A58AA] border border-[#E8E7FF]">편의점 가까움</div>
                <div className="rounded-xl bg-[#F8F8FF] p-4 text-base text-[#5A58AA] border border-[#E8E7FF]">헬스장 선호</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-[#E8E6DD] bg-white px-6 py-3 text-base font-semibold text-[#6B6847] hover:bg-[#FDFCF8] transition-all"
            >
              이전
            </button>
            <button
              onClick={() => navigate("/map")}
              className="rounded-xl bg-[#4A4530] px-6 py-3 text-base font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}