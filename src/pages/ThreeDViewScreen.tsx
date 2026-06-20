import {
  createElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ElementType, HTMLAttributes } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Box,
  Image as ImageIcon,
  RotateCw,
  ZoomIn,
} from "lucide-react";

import {
  useProperty,
  useProperty3D,
  usePropertyImages,
} from "../hooks/queries/propertyQueries";
import {
  formatFloorLabel,
  formatRoomTypeLabel,
} from "../api/mappers/propertyMapper";

type ViewMode = "normal" | "photo";
type SplineViewerStatus =
  | "script-loading"
  | "scene-loading"
  | "ready"
  | "error";

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

  // 공간 정보 패널은 서버 매물 상세에서 가져올 수 있는 값만 표시한다.
  // (천장 높이/공간 구성/가구 배치 등 서버에 없는 항목은 노출하지 않음)
  const { data: detail } = useProperty(propertyId, isValidId);

  // "사진" 보기용 매물 사진. imageOrder 순으로 정렬해 URL 목록으로 변환한다.
  const { data: imagesData } = usePropertyImages(propertyId, isValidId);
  const photoUrls = useMemo(() => {
    const images = imagesData?.images ?? [];
    return [...images]
      .sort((a, b) => a.imageOrder - b.imageOrder)
      .map((image) => image.imageUrl);
  }, [imagesData]);
  const spaceInfoItems = useMemo(() => {
    if (!detail) return [];
    const items: { label: string; value: string }[] = [];
    if (detail.roomType) {
      items.push({ label: "구조", value: formatRoomTypeLabel(detail.roomType) });
    }
    if (detail.floorInfo) {
      items.push({ label: "층", value: formatFloorLabel(detail.floorInfo) });
    }
    return items;
  }, [detail]);

  const isLoading = isValidId && isPending;
  // 3D 모델 노출 가능 여부. id가 없거나 에러/없음이면 빈 상태로 본다.
  const hasModel = isValidId && !isError && (model?.available ?? false);
  const isNormalMode = viewMode === "normal";

  // 회전/확대·축소 조작 안내 토스트. 일정 시간 후 자동으로 사라진다.
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(
      () => setToastMessage(null),
      2500
    );
  }, []);
  useEffect(
    () => () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    },
    []
  );

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
          <PropertyPhotoViewer photoUrls={photoUrls} />
        )}
      </div>

      {isNormalMode && hasModel && spaceInfoItems.length > 0 && (
        <div className="absolute bottom-6 left-6 z-10 w-[240px]">
          <div className="rounded-2xl border border-green-800 bg-green-900/95 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="mb-3 text-base font-bold text-primary-foreground">
              공간 정보
            </h3>

            <div className="space-y-2 text-xs">
              {spaceInfoItems.map((item) => (
                <InfoItem key={item.label} label={item.label} value={item.value} />
              ))}
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
            <ViewButton
              Icon={RotateCw}
              label="회전"
              onClick={() => showToast("마우스로 드래그해 회전할 수 있어요.")}
            />
            <ViewButton
              Icon={ZoomIn}
              label="확대/축소"
              onClick={() =>
                showToast("휠 또는 트랙패드로 확대·축소할 수 있어요.")
              }
            />
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
          text="사진 보기"
          active={viewMode === "photo"}
          onClick={() => setViewMode("photo")}
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

      {toastMessage && (
        <div className="pointer-events-none absolute left-1/2 top-6 z-30 -translate-x-1/2 rounded-full border border-green-700 bg-green-900/95 px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl backdrop-blur-sm">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

function SplineModelViewer({ modelUrl }: { modelUrl: string }) {
  const normalizedUrl = modelUrl.trim();

  if (isSplineSceneUrl(normalizedUrl)) {
    return <SplineSceneViewer key={normalizedUrl} url={normalizedUrl} />;
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

function PropertyPhotoViewer({ photoUrls }: { photoUrls: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 사진 목록이 바뀌면 선택 인덱스를 안전 범위로 보정한다.
  const activeIndex = Math.min(selectedIndex, Math.max(photoUrls.length - 1, 0));
  const hasMultiplePhotos = photoUrls.length > 1;

  if (photoUrls.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-3xl border border-green-800 bg-green-900/95 p-8 text-center shadow-xl backdrop-blur-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-800 bg-green-900">
            <ImageIcon className="h-7 w-7 text-green-300" />
          </div>
          <h2 className="text-lg font-bold text-primary-foreground">
            등록된 사진이 없어요
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            이 매물은 아직 등록된 사진이 없어요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-green-900 p-6 pb-24">
      <div className="flex max-h-[calc(100vh-7.5rem)] max-w-full items-center justify-center gap-3">
        <img
          src={photoUrls[activeIndex]}
          alt={`매물 사진 ${activeIndex + 1}`}
          className={`h-auto w-auto rounded-2xl object-contain shadow-xl ${
            hasMultiplePhotos
              ? "max-h-[calc(100vh-7.5rem)] max-w-[calc(100vw-8.75rem)]"
              : "max-h-[calc(100vh-7.5rem)] max-w-[calc(100vw-3rem)]"
          }`}
        />

        {hasMultiplePhotos && (
          <div className="flex max-h-[calc(100vh-7.5rem)] w-16 shrink-0 flex-col gap-2 overflow-y-auto">
            {photoUrls.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${index === activeIndex
                  ? "border-background"
                  : "border-green-800 opacity-70 hover:opacity-100"
                  }`}
              >
                <img
                  src={url}
                  alt={`매물 사진 썸네일 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SplineSceneViewer({ url }: { url: string }) {
  const viewerRef = useRef<HTMLElement | null>(null);
  const [viewerStatus, setViewerStatus] = useState<SplineViewerStatus>(() =>
    isSplineViewerDefined() ? "scene-loading" : "script-loading"
  );

  useEffect(() => {
    let isMounted = true;

    loadSplineViewerScript()
      .then(() => {
        if (isMounted) {
          setViewerStatus((status) =>
            status === "script-loading" ? "scene-loading" : status
          );
        }
      })
      .catch(() => {
        if (isMounted) setViewerStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  // load/error 리스너는 useLayoutEffect(커밋 단계, paint 이전)로 붙인다.
  // useEffect(paint 이후)로 붙이면, 스크립트·씬이 이미 캐시된 재방문 시
  // spline-viewer가 리스너 등록 전에 'load'를 발생시켜 이벤트를 놓치고
  // scene-loading 상태에 영구히 머물러 "로딩이 오래 걸린다" 메시지가 남는 문제가 있다.
  useLayoutEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => setViewerStatus("ready");
    const handleError = () => setViewerStatus("error");

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
    };
  }, [url]);

  const splineViewerProps: HTMLAttributes<HTMLElement> & {
    ref: typeof viewerRef;
    url: string;
    "loading-anim-type": string;
  } = {
    ref: viewerRef,
    url,
    "loading-anim-type": "spinner-small-light",
    className: "h-full w-full",
    style: { display: "block", height: "100%", width: "100%" },
  };

  return (
    <div className="relative h-full w-full">
      {createElement("spline-viewer", splineViewerProps)}

      {viewerStatus === "script-loading" && (
        <div className="absolute inset-0 bg-green-900">
          <ViewerMessage text="3D 뷰어를 준비하는 중이에요..." />
        </div>
      )}

      {viewerStatus === "error" && (
        <div className="absolute inset-0 bg-green-900">
          <ViewerMessage text="3D 뷰어를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." />
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
            : "이 매물은 아직 3D 모델이 준비되지 않았어요. 사진 보기를 이용해 주세요."}
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
  onClick,
}: {
  Icon: ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
