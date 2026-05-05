import { useNavigate } from "react-router";
import { Home, RotateCw, ZoomIn, Ruler, Sun } from "lucide-react";

export default function ThreeDViewScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-[#1A1812]">
      {/* 3D 뷰어 영역 */}
      <div className="h-full w-full bg-gradient-to-br from-[#2A2820] to-[#1A1812] flex items-center justify-center">
        <div className="text-center">
          <Home className="mx-auto mb-4 h-20 w-20 text-[#FDFCF8]" />
          <div className="text-xl font-semibold text-[#FDFCF8]">3D 뷰어 영역</div>
          <div className="mt-2 text-sm text-[#B8B69F]">실제로는 3D 모델이 표시됩니다</div>
        </div>
      </div>

      {/* 좌측 하단 컨트롤 패널 */}
      <div className="absolute bottom-6 left-6 z-10 space-y-4 w-[340px]">
        <div className="grid grid-cols-3 gap-3">
          {/* 공간 정보 */}
          <div className="col-span-3">
            <div className="rounded-2xl border border-[#3A3830] bg-[#2A2820]/95 backdrop-blur-sm p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-[#FDFCF8]">공간 정보</h3>
              <div className="space-y-2 text-sm">
                <InfoItem label="면적" value="23.1㎡" />
                <InfoItem label="구조" value="원룸" />
                <InfoItem label="천장 높이" value="2.4m" />
              </div>
            </div>
          </div>

          {/* 공간 구성 */}
          <div className="col-span-3">
            <div className="rounded-2xl border border-[#4A4858] bg-[#2A2820]/95 backdrop-blur-sm p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-[#D4D2FF]">공간 구성</h3>
              <div className="space-y-2 text-sm text-[#C1BFFF]">
                <div>• 방 1개</div>
                <div>• 화장실 1개</div>
                <div>• 주방 (일자형)</div>
              </div>
            </div>
          </div>

          {/* 가구 배치 */}
          <div className="col-span-3">
            <div className="rounded-2xl border border-[#4A4530] bg-[#2A2820]/95 backdrop-blur-sm p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-[#D4D2A0]">가구 배치</h3>
              <div className="space-y-2 text-sm text-[#BDB96A]">
                <div>• 침대 (싱글)</div>
                <div>• 책상 & 의자</div>
                <div>• 옷장</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 우측 상단 제어 버튼 */}
      <div className="absolute right-6 top-6 z-10 rounded-2xl border border-[#3A3830] bg-[#2A2820]/95 backdrop-blur-sm p-5 shadow-xl">
        <h4 className="mb-3 text-sm font-bold text-[#FDFCF8]">뷰 컨트롤</h4>
        <div className="space-y-2">
          <ViewButton Icon={RotateCw} label="회전" />
          <ViewButton Icon={ZoomIn} label="확대/축소" />
          <ViewButton Icon={Ruler} label="측정 모드" />
          <ViewButton Icon={Sun} label="조명 변경" />
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 rounded-full border border-[#3A3830] bg-[#2A2820] px-5 py-3 shadow-xl">
        <NavButton text="일반 보기" />
        <NavButton text="투시도" active />
        <NavButton text="평면도" />
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={() => navigate("/property-detail")}
        className="absolute left-6 top-6 z-10 rounded-xl border border-[#3A3830] bg-[#2A2820] px-5 py-3 text-base font-semibold text-[#FDFCF8] hover:bg-[#3A3830] transition-all"
      >
        ← 매물 상세로
      </button>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#1A1812] px-3 py-2 border border-[#3A3830]">
      <span className="text-xs text-[#B8B69F]">{label}</span>
      <span className="text-sm font-semibold text-[#FDFCF8]">{value}</span>
    </div>
  );
}

function ViewButton({ Icon, label }: { Icon: React.ElementType; label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-xl bg-[#2A2820] border border-[#8B8850]/20 px-4 py-2 text-sm font-medium text-[#FDFBD4] hover:bg-[#3A3830] transition w-full">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function NavButton({ text, active }: { text: string; active?: boolean }) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-[#3A3830] text-[#FDFCF8]" : "bg-[#2A2820] text-[#B8B69F]"
        } hover:bg-[#3A3830] hover:text-[#FDFCF8] transition-all`}
    >
      {text}
    </button>
  );
}