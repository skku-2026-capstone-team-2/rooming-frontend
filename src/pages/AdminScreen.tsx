import { useState } from "react";
import { useNavigate } from "react-router";

const properties = [
  { id: 101, title: "매물 #101", status: "공개", price: "500/55" },
  { id: 102, title: "매물 #102", status: "대기", price: "700/60" },
  { id: 103, title: "매물 #103", status: "공개", price: "1000/65" },
  { id: 104, title: "매물 #104", status: "비공개", price: "800/58" },
];

export default function AdminScreen() {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">관리자 대시보드</h1>
            <p className="mt-2 text-text-secondary">매물 등록 및 관리</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-purple-300 bg-card px-5 py-3 text-base font-semibold text-secondary hover:bg-purple-100 transition-all"
            >
              사용자 화면으로
            </button>
            <button className="rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground hover:bg-green-800 transition-all shadow-md hover:shadow-lg">
              + 새 매물 등록
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* 좌측: 매물 목록 */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">매물 목록</h3>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-secondary border border-purple-200">
                {properties.length}개
              </span>
            </div>

            <div className="space-y-2">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${selectedProperty.id === property.id
                      ? "border-accent bg-background shadow-md"
                      : "border-border bg-card hover:bg-background hover:border-accent"
                    }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-text-secondary">{property.title}</span>
                    <StatusBadge status={property.status} />
                  </div>
                  <div className="text-sm text-accent font-medium">{property.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 우측: 매물 관리 폼 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-foreground">기본 정보</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="매물명" value="성대 정문 도보권 원룸" />
                <FormField label="매물 ID" value={`#${selectedProperty.id}`} disabled />
                <FormField label="보증금 (만원)" value="500" />
                <FormField label="월세 (만원)" value="55" />
                <FormField label="관리비 (만원)" value="5" />
                <FormField label="면적 (㎡)" value="23.1" />
                <FormField label="구조" value="원룸" />
                <FormField label="층수" value="3/5" />
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="rounded-2xl border border-purple-300 bg-card p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-purple-800">위치 정보</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField label="주소" value="서울특별시 종로구 성균관로" color="lavender" />
                </div>
                <FormField label="위도" value="37.5894" color="lavender" />
                <FormField label="경도" value="126.9978" color="lavender" />
              </div>
            </div>

            {/* 미디어 자산 */}
            <div className="rounded-2xl border border-accent-purple-border bg-card p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-accent-purple">이미지 / 3D 자산</h3>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-accent-purple-light">매물 사진</label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-accent-purple-border bg-accent-purple-bg text-xs text-accent-purple-light hover:border-accent-purple-light hover:bg-accent-purple-pale cursor-pointer transition"
                    >
                      사진 {i}
                    </div>
                  ))}
                </div>
                <button className="mt-3 rounded-xl border border-accent-purple-border bg-card px-4 py-2 text-sm font-semibold text-accent-purple-light hover:bg-accent-purple-bg transition-all">
                  + 사진 추가
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-accent-purple-light">3D 모델 URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/3d-model.glb"
                  className="w-full rounded-xl border border-accent-purple-border bg-card px-4 py-3 text-sm text-text-secondary placeholder:text-text-muted focus:border-accent-purple-light focus:outline-none focus:ring-2 focus:ring-accent-purple-light/10"
                />
              </div>
            </div>

            {/* 상태 관리 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-foreground">상태 관리</h3>
              <div className="flex gap-3">
                <select className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/10">
                  <option>공개</option>
                  <option>대기</option>
                  <option>비공개</option>
                </select>
                <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-green-800 transition-all shadow-md hover:shadow-lg">
                  저장
                </button>
                <button className="rounded-xl border border-accent-purple-border bg-card px-6 py-3 text-sm font-semibold text-accent-purple-light hover:bg-accent-purple-bg transition-all">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    "공개": "bg-purple-100 text-purple-800 border border-purple-200",
    "대기": "bg-background text-text-tertiary border border-beige-400",
    "비공개": "bg-accent-purple-bg text-accent-purple border border-accent-purple-lighter",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  );
}

function FormField({
  label,
  value,
  disabled = false,
  color = "tan",
}: {
  label: string;
  value: string;
  disabled?: boolean;
  color?: string;
}) {
  const colorClasses = {
    tan: "border-border focus:border-accent focus:ring-ring/10",
    lavender: "border-purple-300 focus:border-secondary focus:ring-secondary/10",
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-text-secondary">{label}</label>
      <input
        type="text"
        defaultValue={value}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${disabled
            ? "border-border bg-background text-text-muted"
            : `bg-card text-text-secondary ${colorClasses[color as keyof typeof colorClasses]}`
          }`}
      />
    </div>
  );
}