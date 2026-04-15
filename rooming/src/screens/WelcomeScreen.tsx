import AppShell from "../components/AppShell";

export default function WelcomeScreen() {
  return (
    <AppShell title="S-00 웰컴 / 로그인">
      <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
        <div className="text-5xl font-bold text-emerald-700">SKKU-Zip</div>
        <div className="mt-4 text-xl font-semibold text-slate-900">
          AI 기반 3D 자취방 탐색 서비스
        </div>
        <div className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          학교 근처 매물, 생활 인프라, 3D 공간 정보를 한 번에 확인해보세요.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
            일반 사용자 로그인
          </button>
          <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
            관리자 로그인
          </button>
        </div>
      </div>
    </AppShell>
  );
}