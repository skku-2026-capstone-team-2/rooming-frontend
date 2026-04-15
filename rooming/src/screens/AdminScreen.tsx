import AppShell from "../components/AppShell";
import Card from "../components/Card";

export default function AdminScreen() {
  return (
    <AppShell title="A-01 관리자(공급자) 화면">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card title="매물 목록">
          <div className="text-sm text-slate-600">매물 #101</div>
          <div className="text-sm text-slate-600">매물 #102</div>
          <div className="text-sm text-slate-600">매물 #103</div>
        </Card>

        <div className="space-y-4">
          <Card title="매물 등록 폼">
            <div className="text-sm text-slate-600">기본 정보 입력</div>
            <div className="text-sm text-slate-600">가격 / 주소 / 구조 입력</div>
            <div className="text-sm text-slate-600">상태 관리</div>
          </Card>

          <Card title="이미지 / 3D 자산 연결">
            <div className="text-sm text-slate-600">이미지 업로드</div>
            <div className="text-sm text-slate-600">3D 모델 URL 연결</div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}