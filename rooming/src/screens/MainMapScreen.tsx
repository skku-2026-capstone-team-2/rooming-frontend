import AppShell from "../components/AppShell";
import MapPin from "../components/MapPin";
import Tag from "../components/Tag";

export default function MainMapScreen() {
  return (
    <AppShell title="S-02 메인 지도 화면">
      <div className="relative min-h-[500px] overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="absolute bottom-4 left-4 z-10 w-[280px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg">
          <div className="mb-3 text-sm font-semibold text-slate-900">검색 결과 패널</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            성대 정문 도보권 원룸
          </div>
        </div>

        <div className="absolute right-4 top-4 z-10 w-[300px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg">
          <div className="mb-3 text-sm font-semibold text-slate-900">AI 검색 패널</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            “정문에서 15분 이내, 헬스장 가까운 원룸”
          </div>
          <button className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
            추천 시작
          </button>
        </div>

        <MapPin className="left-[28%] top-[20%] bg-emerald-600 text-white" label="₩" />
        <MapPin className="left-[56%] top-[42%] bg-emerald-600 text-white" label="₩" />
        <MapPin className="left-[35%] top-[55%] bg-emerald-100 text-emerald-700" label="G" />
        <MapPin className="left-[68%] top-[30%] bg-emerald-100 text-emerald-700" label="C" />

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap gap-2 rounded-full bg-white/95 px-4 py-2 shadow">
          <Tag text="매물 마커" />
          <Tag text="인프라 마커" />
          <Tag text="On/Off 토글" />
        </div>
      </div>
    </AppShell>
  );
}