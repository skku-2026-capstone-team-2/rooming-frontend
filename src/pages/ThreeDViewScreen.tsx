import { createElement, useEffect, useState } from "react";
import type { ElementType, HTMLAttributes } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Box, RotateCw, Ruler, Sun, ZoomIn } from "lucide-react";

import { useProperty3D } from "../hooks/queries/propertyQueries";

type ViewMode = "normal" | "floor";
type ScriptStatus = "loading" | "ready" | "error";

const SPLINE_VIEWER_SCRIPT_SRC =
  "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
const SPLINE_VIEWER_SCRIPT_SELECTOR = `script[src="${SPLINE_VIEWER_SCRIPT_SRC}"]`;
const SPLINE_SCENE_FILE = "scene.splinecode";

export default function ThreeDViewScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("normal");

  const propertyId = Number(searchParams.get("propertyId"));
  const isValidId = !!searchParams.get("propertyId") && !Number.isNaN(propertyId);

  // propertyId가 유효할 때만 3D 데이터를 조회한다. (mock 토글·mapper는 훅 내부에서 재사용)
  const { data: model, isPending, isError } = useProperty3D(
    propertyId,
    isValidId
  );

  const isLoading = isValidId && isPending;
  // 3D 모델 노출 가능 여부. id가 없거나 에러/없음이면 빈 상태로 본다.
  const hasModel = isValidId && !isError && (model?.available ?? false);
  const isNormalMode = viewMode === "normal";

  return (
    <div className="relative h-screen w-full bg-green-900">
      <div className="h-full w-full bg-gradient-to-br from-green-900 to-green-900">
        {isNormalMode ? (
          isLoading ? (
            <ViewerMessage text="3D 모델을 불러오는 중이에요..." />
          ) : hasModel ? (
            <SplineModelViewer modelUrl={model!.modelUrl!} />
          ) : (
            <Empty3DState
              isError={isValidId && isError}
              previewImageUrl={model?.previewImageUrl ?? null}
            />
          )
        ) : (
          <img
            src="/images/dummy-floor-plan.png"
            alt="평면도 뷰어"
            className="h-full w-full bg-white object-contain"
          />
        )}
      </div>

      {isNormalMode && hasModel && (
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

      {isNormalMode && hasModel && (
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

function SplineModelViewer({ modelUrl }: { modelUrl: string }) {
  const normalizedUrl = modelUrl.trim();

  if (isSplineSceneUrl(normalizedUrl)) {
    return <SplineSceneViewer url={normalizedUrl} />;
  }

  return (
    <iframe
      src={normalizedUrl}
      title="3D room viewer"
      className="h-full w-full border-none"
      allow="autoplay; fullscreen; xr-spatial-tracking"
      allowFullScreen
    />
  );
}

function SplineSceneViewer({ url }: { url: string }) {
  const [scriptStatus, setScriptStatus] = useState<ScriptStatus>(() =>
    isSplineViewerDefined() ? "ready" : "loading"
  );

  useEffect(() => {
    let isMounted = true;

    setScriptStatus(isSplineViewerDefined() ? "ready" : "loading");

    loadSplineViewerScript()
      .then(() => {
        if (isMounted) setScriptStatus("ready");
      })
      .catch(() => {
        if (isMounted) setScriptStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const splineViewerProps: HTMLAttributes<HTMLElement> & { url: string } = {
    url,
    className: "h-full w-full",
    style: { display: "block", height: "100%", width: "100%" },
  };

  return (
    <div className="relative h-full w-full">
      {scriptStatus === "error" ? (
        <ViewerMessage text="3D 뷰어를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." />
      ) : (
        createElement("spline-viewer", splineViewerProps)
      )}

      {scriptStatus === "loading" && (
        <div className="absolute inset-0 bg-green-900">
          <ViewerMessage text="3D 뷰어를 준비하는 중이에요..." />
        </div>
      )}
    </div>
  );
}

function isSplineSceneUrl(modelUrl: string): boolean {
  const lowerUrl = modelUrl.toLowerCase();

  if (
    lowerUrl.includes(`/${SPLINE_SCENE_FILE}`) ||
    lowerUrl.endsWith(".splinecode")
  ) {
    return true;
  }

  try {
    return new URL(modelUrl).hostname === "prod.spline.design";
  } catch {
    return lowerUrl.includes("prod.spline.design");
  }
}

function isSplineViewerDefined(): boolean {
  return (
    typeof window !== "undefined" &&
    "customElements" in window &&
    window.customElements.get("spline-viewer") != null
  );
}

function loadSplineViewerScript(): Promise<void> {
  if (isSplineViewerDefined()) return Promise.resolve();

  const existingScript = document.querySelector<HTMLScriptElement>(
    SPLINE_VIEWER_SCRIPT_SELECTOR
  );

  if (existingScript?.dataset.loaded === "true") {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    const handleError = () => reject();

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.type = "module";
      script.async = true;
      script.src = SPLINE_VIEWER_SCRIPT_SRC;
      document.head.appendChild(script);
    }
  });
}

function ViewerMessage({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-sm font-medium text-green-300">{text}</p>
    </div>
  );
}

function Empty3DState({
  isError,
  previewImageUrl,
}: {
  isError: boolean;
  previewImageUrl: string | null;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-green-800 bg-green-900/95 p-8 text-center shadow-xl backdrop-blur-sm">
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt="3D 미리보기"
            className="mb-5 h-40 w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-800 bg-green-900">
            <Box className="h-7 w-7 text-green-300" />
          </div>
        )}

        <h2 className="text-lg font-bold text-primary-foreground">
          {isError ? "3D 모델을 불러오지 못했어요" : "3D 모델이 없는 매물이에요"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-muted">
          {isError
            ? "잠시 후 다시 시도해 주세요."
            : "이 매물은 아직 3D 모델이 준비되지 않았어요. 평면도 보기를 이용해 주세요."}
        </p>
      </div>
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
  Icon: ElementType;
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
