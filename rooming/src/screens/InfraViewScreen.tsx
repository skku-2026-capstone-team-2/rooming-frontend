import AppShell from "../components/AppShell";
import MapPin from "../components/MapPin";

export default function InfraViewScreen() {
  return (
    <AppShell title="S-07 인프라 보기 화면">
      <div className="relative min-h-[500px] overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
        <MapPin className="left-[45%] top-[45%] bg-emerald-600 text-white" label="₩" />
        <MapPin className="left-[28%] top-[32%] bg-emerald-100 text-emerald-700" label="C" />
        <MapPin className="left-[62%] top-[25%] bg-emerald-100 text-emerald-700" label="G" />
        <MapPin className="left-[55%] top-[62%] bg-emerald-100 text-emerald-700" label="P" />

        <div className="absolute bottom-4 left-4 w-[320px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg">
          <div className="mb-2 text-sm font-semibold text-slate-900">생활권 정보</div>
          <div className="text-sm text-slate-600">매물 위치 핀 및 가격 표시</div>
          <div className="text-sm text-slate-600">인프라 핀 표시</div>
          <div className="text-sm text-slate-600">주요 장소와의 거리 표시</div>
        </div>
      </div>
    </AppShell>
  );
}