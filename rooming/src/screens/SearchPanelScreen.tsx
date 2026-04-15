import AppShell from "../components/AppShell";
import Card from "../components/Card";

export default function SearchPanelScreen() {
  return (
    <AppShell title="S-03 우측 AI 패널 / 자연어 검색 패널">
      <div className="space-y-4">
        <Card title="자연어 입력창">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            원하는 조건을 자연어로 입력하세요
          </div>
          <button className="mt-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
            추천 시작
          </button>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="이전 조건 요약">
            <div className="text-sm text-slate-600">학교 정문 기준</div>
            <div className="text-sm text-slate-600">도보 15분 이내</div>
            <div className="text-sm text-slate-600">헬스장, 편의점 선호</div>
          </Card>

          <Card title="새로운 장소 추천">
            <div className="text-sm text-slate-600">캠퍼스 근처 카페 거리</div>
            <div className="text-sm text-slate-600">도서관 인접 구역</div>
            <div className="text-sm text-slate-600">헬스장 밀집 구역</div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}