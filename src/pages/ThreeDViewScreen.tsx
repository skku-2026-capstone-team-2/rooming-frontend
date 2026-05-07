import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, RotateCw, Ruler, Sun, ZoomIn } from "lucide-react";

type ViewMode = "normal" | "floor";

const SPLINE_VIEWER_URL =
  "https://my.spline.design/visionosiconsin3d-bgOTCJ1k5Mwy3fuy2T18tQAz/";

export default function ThreeDViewScreen() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("normal");

  const isNormalMode = viewMode === "normal";

  return (
    <div className="relative h-screen w-full bg-green-900">
      <div className="h-full w-full bg-gradient-to-br from-green-900 to-green-900">
        {isNormalMode ? (
          <iframe
            src={SPLINE_VIEWER_URL}
            title="3D room viewer"
            className="h-full w-full border-none"
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />
        ) : (
          <img
            src="/images/dummy-floor-plan.png"
            alt="평면도 뷰어"
            className="h-full w-full bg-white object-contain"
          />
        )}
      </div>

      {isNormalMode && (
        <div className="absolute bottom-6 left-6 z-10 w-[240px] space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3">
              <div className="rounded-2xl border border-green-800 bg-green-900/95 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-3 text-base font-bold text-primary-foreground">
                  공간 정보
                </h3>

                <div className="space-y-2 text-xs">
                  <InfoItem label="면적" value="23.1㎡" />
                  <InfoItem label="구조" value="원룸" />
                  <InfoItem label="천장 높이" value="2.4m" />
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="rounded-2xl border border-purple-900 bg-green-900/95 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-3 text-base font-bold text-purple-400">
                  공간 구성
                </h3>

                <div className="space-y-2 text-xs text-purple-500">
                  <div>방 1개</div>
                  <div>욕실 1개</div>
                  <div>주방 일체형</div>
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="rounded-2xl border border-primary bg-green-900/95 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-3 text-base font-bold text-green-300">
                  가구 배치
                </h3>

                <div className="space-y-2 text-xs text-accent">
                  <div>침대</div>
                  <div>책상 & 의자</div>
                  <div>옷장</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
      <span className="text-xs font-semibold text-primary-foreground">
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
