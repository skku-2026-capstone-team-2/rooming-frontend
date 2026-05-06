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
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4A4530]">관리자 대시보드</h1>
            <p className="mt-2 text-[#6B6847]">매물 등록 및 관리</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-[#D8D7F5] bg-white px-5 py-3 text-base font-semibold text-[#8B89DD] hover:bg-[#F8F8FF] transition-all"
            >
              사용자 화면으로
            </button>
            <button className="rounded-xl bg-[#4A4530] px-5 py-3 text-base font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg">
              + 새 매물 등록
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* 좌측: 매물 목록 */}
          <div className="rounded-2xl border border-[#E8E6DD] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#4A4530]">매물 목록</h3>
              <span className="rounded-full bg-[#F8F8FF] px-3 py-1 text-xs font-semibold text-[#8B89DD] border border-[#E8E7FF]">
                {properties.length}개
              </span>
            </div>

            <div className="space-y-2">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${selectedProperty.id === property.id
                      ? "border-[#BDB96A] bg-[#FDFCF8] shadow-md"
                      : "border-[#E8E6DD] bg-white hover:bg-[#FDFCF8] hover:border-[#BDB96A]"
                    }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#6B6847]">{property.title}</span>
                    <StatusBadge status={property.status} />
                  </div>
                  <div className="text-sm text-[#BDB96A] font-medium">{property.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 우측: 매물 관리 폼 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-[#4A4530]">기본 정보</h3>
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
            <div className="rounded-2xl border border-[#D8D7F5] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-[#5A58AA]">위치 정보</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField label="주소" value="서울특별시 종로구 성균관로" color="lavender" />
                </div>
                <FormField label="위도" value="37.5894" color="lavender" />
                <FormField label="경도" value="126.9978" color="lavender" />
              </div>
            </div>

            {/* 미디어 자산 */}
            <div className="rounded-2xl border border-[#E8DBFF] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-[#8E3BA8]">이미지 / 3D 자산</h3>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#B857D9]">매물 사진</label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-[#E8DBFF] bg-[#FFF8FF] text-xs text-[#B857D9] hover:border-[#B857D9] hover:bg-[#FFEBFF] cursor-pointer transition"
                    >
                      사진 {i}
                    </div>
                  ))}
                </div>
                <button className="mt-3 rounded-xl border border-[#E8DBFF] bg-white px-4 py-2 text-sm font-semibold text-[#B857D9] hover:bg-[#FFF8FF] transition-all">
                  + 사진 추가
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#B857D9]">3D 모델 URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/3d-model.glb"
                  className="w-full rounded-xl border border-[#E8DBFF] bg-white px-4 py-3 text-sm text-[#6B6847] placeholder-[#B8B69F] focus:border-[#B857D9] focus:outline-none focus:ring-2 focus:ring-[#B857D9]/10"
                />
              </div>
            </div>

            {/* 상태 관리 */}
            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-[#4A4530]">상태 관리</h3>
              <div className="flex gap-3">
                <select className="flex-1 rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm font-medium text-[#BDB96A] focus:border-[#BDB96A] focus:outline-none focus:ring-2 focus:ring-[#BDB96A]/10">
                  <option>공개</option>
                  <option>대기</option>
                  <option>비공개</option>
                </select>
                <button className="rounded-xl bg-[#4A4530] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg">
                  저장
                </button>
                <button className="rounded-xl border border-[#E8DBFF] bg-white px-6 py-3 text-sm font-semibold text-[#B857D9] hover:bg-[#FFF8FF] transition-all">
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
    "공개": "bg-[#F8F8FF] text-[#5A58AA] border border-[#E8E7FF]",
    "대기": "bg-[#FDFCF8] text-[#8B8850] border border-[#F0EFE8]",
    "비공개": "bg-[#FFF8FF] text-[#8E3BA8] border border-[#F0E5FF]",
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
    tan: "border-[#E8E6DD] focus:border-[#BDB96A] focus:ring-[#BDB96A]/10",
    lavender: "border-[#D8D7F5] focus:border-[#8B89DD] focus:ring-[#8B89DD]/10",
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#6B6847]">{label}</label>
      <input
        type="text"
        defaultValue={value}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${disabled
            ? "border-[#E8E6DD] bg-[#FDFCF8] text-[#B8B69F]"
            : `bg-white text-[#6B6847] ${colorClasses[color as keyof typeof colorClasses]}`
          }`}
      />
    </div>
  );
}