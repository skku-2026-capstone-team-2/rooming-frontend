import { useState } from "react";
import { useNavigate } from "react-router";
import { RotateCw, ZoomIn, Ruler, Sun, ArrowLeft } from "lucide-react";

type ViewMode = "normal" | "floor";

export default function ThreeDViewScreen() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("normal");

  const isNormalMode = viewMode === "normal";

  const viewerImageSrc = isNormalMode
    ? "/images/dummy-3d.png"
    : "/images/dummy-floor-plan.png";

  return (
    <div className="relative h-screen w-full bg-green-900">
      {/* 3D / 평면도 뷰어 영역 */}
      <div className="h-full w-full bg-gradient-to-br from-green-900 to-green-900">
        <img
          src={viewerImageSrc}
          alt={isNormalMode ? "3D 뷰어" : "평면도 뷰어"}
          className={`h-full w-full ${isNormalMode ? "object-cover" : "object-contain bg-white"
            }`}
        />
      </div>

      {/* 좌측 하단 정보 패널 - 일반 보기에서만 표시 */}
      {isNormalMode && (
        <div className="absolute bottom-6 left-6 z-10 w-[340px] space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {/* 공간 정보 */}
            <div className="col-span-3">
              <div className="rounded-2xl border border-green-800 bg-green-900/95 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-bold text-primary-foreground">
                  공간 정보
                </h3>

                <div className="space-y-2 text-sm">
                  <InfoItem label="면적" value="23.1㎡" />
                  <InfoItem label="구조" value="원룸" />
                  <InfoItem label="천장 높이" value="2.4m" />
                </div>
              </div>
            </div>

            {/* 공간 구성 */}
            <div className="col-span-3">
              <div className="rounded-2xl border border-purple-900 bg-green-900/95 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-bold text-purple-400">
                  공간 구성
                </h3>

                <div className="space-y-2 text-sm text-purple-500">
                  <div>• 방 1개</div>
                  <div>• 화장실 1개</div>
                  <div>• 주방 (일자형)</div>
                </div>
              </div>
            </div>

            {/* 가구 배치 */}
            <div className="col-span-3">
              <div className="rounded-2xl border border-primary bg-green-900/95 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-bold text-green-300">
                  가구 배치
                </h3>

                <div className="space-y-2 text-sm text-accent">
                  <div>• 침대 (싱글)</div>
                  <div>• 책상 & 의자</div>
                  <div>• 옷장</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 우측 상단 제어 버튼 - 일반 보기에서만 표시 */}
      {isNormalMode && (
        <div className="absolute right-6 top-6 z-10 rounded-2xl border border-green-800 bg-green-900/95 p-5 shadow-xl backdrop-blur-sm">
          <h4 className="mb-3 text-sm font-bold text-primary-foreground">
            뷰 컨트롤
          </h4>

          <div className="space-y-2">
            <ViewButton Icon={RotateCw} label="회전" />
            <ViewButton Icon={ZoomIn} label="확대/축소" />
            <ViewButton Icon={Ruler} label="측정 모드" />
            <ViewButton Icon={Sun} label="조명 변경" />
          </div>
        </div>
      )}

      {/* 하단 보기 토글 */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full border border-green-800 bg-green-900 p-1.5 shadow-xl">
        <ViewModeToggleButton
          text="일반 보기"
          active={viewMode === "normal"}
          onClick={() => setViewMode("normal")}
        />

        <ViewModeToggleButton
          text="평면도"
          active={viewMode === "floor"}
          onClick={() => setViewMode("floor")}
        />
      </div>

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-2xl border border-green-800 bg-green-900 px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-green-800"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </button>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-green-800 bg-green-900 px-3 py-2">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-sm font-semibold text-primary-foreground">
        {value}
      </span>
    </div>
  );
}

function ViewButton({
  Icon,
  label,
}: {
  Icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-xl border border-green-500/20 bg-green-900 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-800"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function ViewModeToggleButton({
  text,
  active,
  onClick,
}: {
  text: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${active
        ? "bg-background text-green-900 shadow-sm"
        : "bg-transparent text-text-muted hover:bg-green-800 hover:text-primary-foreground"
        }`}
    >
      {text}
    </button>
  );
}