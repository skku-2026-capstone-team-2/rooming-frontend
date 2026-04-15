import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Tag from "../components/Tag";

export default function InfraSearchScreen() {
  return (
    <AppShell title="S-06 인프라 / 검색 모달">
      <div className="space-y-4">
        <Card title="인프라 카테고리 선택">
          <div className="flex flex-wrap gap-2">
            <Tag text="편의점" />
            <Tag text="카페" />
            <Tag text="헬스장" />
            <Tag text="약국" />
          </div>
        </Card>

        <Card title="반경 조건 / 추가 검색">
          <div className="text-sm text-slate-600">반경 300m / 500m / 1km</div>
          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            목록에 없는 인프라 검색창
          </div>
          <button className="mt-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
            선택 결과 반영
          </button>
        </Card>
      </div>
    </AppShell>
  );
}