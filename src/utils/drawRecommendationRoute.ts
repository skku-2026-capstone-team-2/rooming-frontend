/**
 * 추천 경로(`GET /api/v1/recommendations/{id}/route`)의 geometry를 Tmap 지도에 그린다.
 *
 * - 백엔드가 내려준 구간별 좌표(`pathList[].points`)를 구간 유형별 색으로 폴리라인 표시한다.
 * - Tmap 보행자 경로 API(`drawPedestrianRoute`)는 사용자가 지도에서 직접 그리는 경로용이고,
 *   이 유틸은 추천 응답에 포함된 "저장된 경로"를 그대로 시각화하는 역할로 구분된다.
 * - 그린 좌표 개수를 반환하므로, 0이면 호출부에서 fallback(직선/요약 라벨)을 띄울 수 있다.
 */

import type { RecommendationRoutePath, RouteSubPathType } from "../types";
import { createDistanceLabelHTML } from "./createDistanceLabelHTML";

type DrawRecommendationRouteParams = {
  map: TmapMap;
  path: RecommendationRoutePath;
  /** 구간 유형별 폴리라인 색. 미지정 유형은 기본색. */
  colorByType?: Partial<Record<RouteSubPathType, string>>;
  defaultColor?: string;
};

const SUBPATH_TYPE_LABEL: Record<RouteSubPathType, string> = {
  SUBWAY: "지하철",
  BUS: "버스",
  WALK: "도보",
  UNKNOWN: "이동",
};

/**
 * 경로 geometry를 그린다.
 * @returns 그린 좌표 총 개수 (0이면 표시할 geometry가 없음)
 */
export function drawRecommendationRoute({
  map,
  path,
  colorByType,
  defaultColor = "#6B67BB",
}: DrawRecommendationRouteParams): number {
  const tmap = window.Tmapv2;
  if (!map || !tmap) return 0;

  let drawnPointCount = 0;

  path.pathList.forEach((subPath) => {
    const points = subPath.points ?? [];
    if (points.length < 2) return;

    const latLngs = points.map(
      (point) => new tmap.LatLng(point.latitude, point.longitude)
    );
    const strokeColor = colorByType?.[subPath.type] ?? defaultColor;

    const polyline = new tmap.Polyline({
      path: latLngs,
      strokeColor,
      strokeWeight: 5,
      strokeOpacity: 0.9,
      // 도보 구간은 점선으로 구분
      strokeStyle: subPath.type === "WALK" ? "dash" : "solid",
      map,
    });

    drawnPointCount += latLngs.length;

    const label = `${SUBPATH_TYPE_LABEL[subPath.type]} ${subPath.time}분`;
    const middlePosition = latLngs[Math.floor(latLngs.length / 2)];

    let labelMarker: TmapMarker | null = null;

    polyline.addListener("mouseenter", () => {
      if (labelMarker) return;
      labelMarker = new tmap.Marker({
        position: middlePosition,
        map,
        iconHTML: createDistanceLabelHTML(label),
        iconSize: new tmap.Size(72, 28),
        iconAnchor: new tmap.Point(36, 14),
      });
    });

    polyline.addListener("mouseleave", () => {
      if (!labelMarker) return;
      labelMarker.setMap(null);
      labelMarker = null;
    });
  });

  return drawnPointCount;
}
