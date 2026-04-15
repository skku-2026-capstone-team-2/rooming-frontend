import AppShell from "../components/AppShell";
import Card from "../components/Card";

export default function PropertyDetailScreen() {
  return (
    <AppShell title="S-05 매물 상세 모달">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex h-[260px] items-center justify-center rounded-3xl bg-slate-200 text-sm text-slate-500">
            사진 영역
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
              3D 보기
            </button>
            <button className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">
              인프라 보기
            </button>
            <button className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">
              추천 이유 보기
            </button>
          </div>
        </div>

        <Card title="매물 정보">
          <div className="text-sm text-slate-600">보증금 / 월세: 500 / 55</div>
          <div className="text-sm text-slate-600">관리비: 5</div>
          <div className="text-sm text-slate-600">면적: 23.1㎡</div>
          <div className="text-sm text-slate-600">구조: 원룸</div>
          <div className="text-sm text-slate-600">정문까지 도보 12분</div>
        </Card>
      </div>
    </AppShell>
  );
}