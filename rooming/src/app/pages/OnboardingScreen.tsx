import { useState } from "react";
import { useNavigate } from "react-router";
import PreferenceBoard from "../components/PreferenceBoard";

// ─── OnboardingScreen ─────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="h-screen overflow-hidden bg-[#FDFCF8]">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-6 py-6">
        {/* ── 페이지 헤더 ── */}
        <div className="mb-5 shrink-0">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#B8B69F]">
            Onboarding
          </p>
          <h1 className="text-2xl font-bold text-[#3A3520]">
            원하는 방을 찾기 위한 조건을 알려주세요
          </h1>
          <p className="mt-1.5 text-sm text-[#9B9872]">
            자주 가는 장소와 생활 선호도를 바탕으로 맞춤 매물을 추천해드릴게요.
          </p>
        </div>

        {/* ── 본문 2단 레이아웃 ── */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* ───────────────── 왼쪽: 장소 설정 ───────────────── */}
          <section className="min-h-0 rounded-3xl border border-[#E8E6DD] bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#3A3520]">장소 설정</h2>
              <p className="mt-1 text-sm text-[#9B9872]">
                학교, 자주 가는 카페, 편의시설 등 기준이 되는 장소를 등록하세요.
              </p>
            </div>

            {/* 장소 검색 */}
            <div>
              <label
                htmlFor="place-search"
                className="mb-2 block text-sm font-semibold text-[#4A4530]"
              >
                기준 장소 검색
              </label>
              <input
                id="place-search"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="예: 성균관대 정문, 스타벅스 성대점"
                className="w-full rounded-xl border border-[#E8E6DD] bg-[#FDFCF8] px-4 py-2.5 text-sm text-[#4A4530] placeholder-[#C8C6AF] transition-all focus:border-[#BDB96A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BDB96A]/15"
              />
            </div>

            {/* 등록된 장소 */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[#FDFCF8] px-4 py-3.5">
                <div>
                  <p className="text-xs font-medium text-[#B8B69F]">통학 기준</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#4A4530]">
                    성균관대 정문
                  </p>
                </div>

                <button className="rounded-lg border border-[#E8E6DD] bg-white px-3 py-1.5 text-xs font-medium text-[#8B8850] transition-all hover:border-[#BDB96A] hover:text-[#6B6847]">
                  변경
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#FDFCF8] px-4 py-3.5">
                <div>
                  <p className="text-xs font-medium text-[#B8B69F]">생활 기준</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#4A4530]">
                    스타벅스 성대점
                  </p>
                </div>

                <button className="rounded-lg border border-[#E8E6DD] bg-white px-3 py-1.5 text-xs font-medium text-[#8B8850] transition-all hover:border-[#BDB96A] hover:text-[#6B6847]">
                  변경
                </button>
              </div>
            </div>
          </section>

          {/* ───────────────── 오른쪽: 선호 조건 ───────────────── */}
          <section className="min-h-0 overflow-hidden rounded-3xl border border-[#E8E6DD] bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#3A3520]">
                선호 조건 설정
              </h2>
              <p className="mt-1 text-sm text-[#9B9872]">
                예산, 거리, 생활 인프라 등 중요하게 생각하는 조건을 선택하세요.
              </p>
            </div>

            <div className="min-h-0">
              <PreferenceBoard />
            </div>
          </section>
        </div>

        {/* ── 네비게이션 ── */}
        <div className="mt-5 flex shrink-0 items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 rounded-xl border border-[#E8E6DD] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B6847] transition-all hover:border-[#D8D6CD] hover:bg-[#FDFCF8]"
          >
            뒤로가기
          </button>

          <button
            onClick={() => navigate("/map")}
            className="flex items-center gap-1.5 rounded-xl bg-[#4A4530] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#3A3520] hover:shadow-lg"
          >
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
}