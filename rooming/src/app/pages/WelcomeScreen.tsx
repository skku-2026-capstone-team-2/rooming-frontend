import { useNavigate } from "react-router";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFCF8]">
      <div className="flex flex-col items-center text-center px-6">
        <div className="text-6xl font-bold text-[#4A4530]">rooming</div>
        <div className="mt-6 text-2xl font-semibold text-[#6B6847]">
          AI 기반 3D 자취방 탐색 서비스
        </div>
        <div className="mt-4 max-w-xl text-base leading-7 text-[#8B8850]">
          학교 근처 매물, 생활 인프라, 3D 공간 정보를 한 번에 확인해보세요.
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/onboarding")}
            className="rounded-xl bg-[#4A4530] px-7 py-4 text-base font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg"
          >
            일반 사용자 로그인
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-[#C1BFFF] bg-white px-7 py-4 text-base font-semibold text-[#8B89DD] hover:bg-[#F8F8FF] transition-all"
          >
            관리자 로그인
          </button>
        </div>
      </div>
    </div>
  );
}