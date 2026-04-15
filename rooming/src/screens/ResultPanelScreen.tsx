import AppShell from "../components/AppShell";
import Tag from "../components/Tag";

export default function ResultPanelScreen() {
  return (
    <AppShell title="S-04 검색 결과 패널 / 추천 매물 리스트">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Tag text="추천순" />
          <Tag text="거리순" />
          <Tag text="가격순" />
          <Tag text="찜한 장소 토글" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-[160px] items-center justify-center rounded-2xl bg-slate-200 text-sm text-slate-500">
              매물 이미지
            </div>
            <div className="text-base font-bold text-slate-900">성대 정문 도보권 원룸</div>
            <div className="mt-1 text-sm font-medium text-emerald-700">500 / 55</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              정문까지 도보 12분, 헬스장·편의점 인접
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-[160px] items-center justify-center rounded-2xl bg-slate-200 text-sm text-slate-500">
              매물 이미지
            </div>
            <div className="text-base font-bold text-slate-900">도서관 인접 원룸</div>
            <div className="mt-1 text-sm font-medium text-emerald-700">1000 / 60</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              학업 중심 생활권, 조용한 환경
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}