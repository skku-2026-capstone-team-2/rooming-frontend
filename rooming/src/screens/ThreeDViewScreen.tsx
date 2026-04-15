import AppShell from "../components/AppShell";
import Card from "../components/Card";

export default function ThreeDViewScreen() {
  return (
    <AppShell title="S-08 3D 보기 탭/화면">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="flex min-h-[460px] items-center justify-center rounded-[24px] border border-slate-200 bg-slate-900 text-center text-slate-200">
          <div>
            <div className="text-lg font-semibold">3D Viewer Placeholder</div>
            <div className="mt-2 text-sm text-slate-400">회전 / 확대 / 축소 영역</div>
          </div>
        </div>

        <Card title="공간 정보">
          <div className="text-sm text-slate-600">원룸 + 욕실 + 주방</div>
          <div className="text-sm text-slate-600">창문 위치 표시</div>
          <div className="text-sm text-slate-600">출입문 위치 표시</div>
          <div className="text-sm text-slate-600">가구 배치 확인 가능</div>
        </Card>
      </div>
    </AppShell>
  );
}