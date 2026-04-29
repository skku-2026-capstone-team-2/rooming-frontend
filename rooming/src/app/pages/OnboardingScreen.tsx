import { useState } from "react";
import { useNavigate } from "react-router";
import PreferenceBoard from "../components/PreferenceBoard";

// ─── Section 헤더 공통 컴포넌트 ───────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#B8B69F]">
      {children}
    </p>
  );
}

// ─── OnboardingScreen ─────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* ── 페이지 헤더 ── */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            {/* <span className="h-1.5 w-6 rounded-full bg-[#BDB96A]" /> */}
            {/* <span className="h-1.5 w-3 rounded-full bg-[#BDB96A]/40" /> */}
            {/* <span className="h-1.5 w-1.5 rounded-full bg-[#BDB96A]/20" /> */}
          </div>
          <h1 className="text-2xl font-bold text-[#3A3520]">장소 & 선호 조건 설정</h1>
          <p className="mt-1.5 text-sm text-[#9B9872]">
            자주 가는 장소를 등록하고, 원하는 주거 조건을 선택하세요
          </p>
        </div>

        <div className="space-y-8">

          {/* ── 1. 장소 검색 ── */}
          <div>
            <SectionLabel>장소 검색</SectionLabel>
            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-5 shadow-sm">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="장소를 검색하세요 (예: 성균관대 정문)"
                className="w-full rounded-xl border border-[#E8E6DD] bg-[#FDFCF8] px-4 py-3 text-sm text-[#4A4530] placeholder-[#C8C6AF] focus:border-[#BDB96A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BDB96A]/15 transition-all"
              />
            </div>
          </div>

          {/* ── 2. 등록된 장소 ── */}
          <div>
            <SectionLabel>등록된 장소</SectionLabel>
            <div className="rounded-2xl border border-[#E8E6DD] bg-white shadow-sm overflow-hidden">
              {/* 통학 기준 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EFE8]">
                <div>
                  <p className="text-xs font-medium text-[#B8B69F]">통학 기준 장소</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#4A4530]">성균관대 정문</p>
                </div>
                <button className="rounded-lg border border-[#E8E6DD] px-3 py-1.5 text-xs font-medium text-[#8B8850] hover:border-[#BDB96A] hover:text-[#6B6847] transition-all">
                  변경
                </button>
              </div>
              {/* 생활 기준 */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-xs font-medium text-[#B8B69F]">생활 기준 장소</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#4A4530]">스타벅스 성대점</p>
                </div>
                <button className="rounded-lg border border-[#E8E6DD] px-3 py-1.5 text-xs font-medium text-[#8B8850] hover:border-[#BDB96A] hover:text-[#6B6847] transition-all">
                  변경
                </button>
              </div>
            </div>
          </div>

          {/* ── 3. 선호 조건 ── */}
          <div>
            <SectionLabel>선호 조건</SectionLabel>
            <PreferenceBoard />
          </div>

          {/* ── 네비게이션 ── */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 rounded-xl border border-[#E8E6DD] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B6847] hover:bg-[#FDFCF8] hover:border-[#D8D6CD] transition-all"
            >
              <span>←</span> 이전
            </button>
            <button
              onClick={() => navigate("/map")}
              className="flex items-center gap-1.5 rounded-xl bg-[#4A4530] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg"
            >
              다음 <span>→</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
