/**
 * 추천 경로(`GET /api/v1/recommendations/{id}/route`)의 geometry를 Tmap 지도에 그린다.
 *
 * - 백엔드가 내려준 구간별 좌표(`pathList[].points`)를 폴리라인으로 표시한다.
 * - 전체 도보 경로는 하나의 폴리라인으로 병합해 총 도보 시간을 보여준다.
 * - 대중교통이 섞인 경로는 구간 유형별 색으로 나누어 표시한다.
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
  /** 시작점(매물) 좌표 - 비어있는 도보 구간 계산용 */
  propertyLat?: number;
  propertyLng?: number;
  /** 끝점(목적지) 좌표 - 비어있는 도보 구간 계산용 */
  destinationLat?: number;
  destinationLng?: number;
};

type EmptySegment = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

type DrawRecommendationRouteResult = {
  drawnPoints: number;
  emptySegments: EmptySegment[];
};

const SUBPATH_TYPE_LABEL: Record<RouteSubPathType, string> = {
  SUBWAY: "지하철",
  BUS: "버스",
  WALK: "도보",
  UNKNOWN: "이동",
};

function drawPolylineWithHoverLabel({
  map,
  tmap,
  latLngs,
  strokeColor,
  strokeStyle = "solid",
  label,
}: {
  map: TmapMap;
  tmap: TmapNamespace;
  latLngs: TmapLatLng[];
  strokeColor: string;
  strokeStyle?: "dash" | "solid";
  label: string;
}) {
  const polyline = new tmap.Polyline({
    path: latLngs,
    strokeColor,
    strokeWeight: 5,
    strokeOpacity: 0.9,
    strokeStyle,
    map,
  });

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
}

/**
 * 두 좌표 간 비교용 거리(제곱). 위도에 따른 경도 축소를 반영하므로
 * 실제 미터는 아니지만 후보 단말 중 더 가까운 쪽을 고르는 데 충분하다.
 */
function distanceSq(lat1: number, lng1: number, lat2: number, lng2: number) {
  const latDiff = lat1 - lat2;
  const lngDiff = (lng1 - lng2) * Math.cos((lat1 * Math.PI) / 180);
  return latDiff * latDiff + lngDiff * lngDiff;
}

/**
 * 경로 geometry를 그린다.
 * @returns drawnPoints > 0이면 그려짐, emptySegments에 좌표 빈 구간 정보
 */
export function drawRecommendationRoute({
  map,
  path,
  colorByType,
  defaultColor = "#6B67BB",
  propertyLat,
  propertyLng,
  destinationLat,
  destinationLng,
}: DrawRecommendationRouteParams): DrawRecommendationRouteResult {
  const tmap = window.Tmapv2;
  if (!map || !tmap) return { drawnPoints: 0, emptySegments: [] };

  let drawnPointCount = 0;
  const emptySegments: EmptySegment[] = [];

  // 도보만으로 이루어진 경로는 실선으로 그린다.
  // (대중교통이 섞인 경로에서는 도보 구간을 점선으로 구분 표시)
  const isWalkOnlyRoute = path.pathList.every(
    (subPath) => subPath.type === "WALK"
  );

  // 각 pathList 구간의 좌표 범위 미리 계산
  const segmentBounds = path.pathList.map((subPath, index) => {
    const points = subPath.points ?? [];
    let startLat: number | null = null;
    let startLng: number | null = null;
    let endLat: number | null = null;
    let endLng: number | null = null;

    if (points.length > 0) {
      startLat = points[0].latitude;
      startLng = points[0].longitude;
      endLat = points[points.length - 1].latitude;
      endLng = points[points.length - 1].longitude;
    }

    return { index, startLat, startLng, endLat, endLng, points, subPath };
  });

  const canDrawSingleWalkPolyline =
    isWalkOnlyRoute &&
    segmentBounds.length > 0 &&
    segmentBounds.every((segment) => segment.points.length >= 2);

  if (canDrawSingleWalkPolyline) {
    const latLngs: TmapLatLng[] = [];
    let prevLat: number | null = null;
    let prevLng: number | null = null;

    segmentBounds.forEach((segment) => {
      segment.points.forEach((point) => {
        if (point.latitude === prevLat && point.longitude === prevLng) return;

        latLngs.push(new tmap.LatLng(point.latitude, point.longitude));
        prevLat = point.latitude;
        prevLng = point.longitude;
      });
    });

    if (latLngs.length >= 2) {
      drawPolylineWithHoverLabel({
        map,
        tmap,
        latLngs,
        strokeColor: colorByType?.WALK ?? defaultColor,
        label: `도보 ${path.totalTime}분`,
      });

      return { drawnPoints: latLngs.length, emptySegments };
    }
  }

  // points가 있는 구간들을 그린다.
  for (const segment of segmentBounds) {
    if (segment.points.length < 2) continue;

    const latLngs = segment.points.map(
      (point) => new tmap.LatLng(point.latitude, point.longitude)
    );
    const strokeColor = colorByType?.[segment.subPath.type] ?? defaultColor;

    drawPolylineWithHoverLabel({
      map,
      tmap,
      latLngs,
      strokeColor,
      strokeStyle:
        segment.subPath.type === "WALK" && !isWalkOnlyRoute ? "dash" : "solid",
      label: `${SUBPATH_TYPE_LABEL[segment.subPath.type]} ${segment.subPath.time}분`,
    });

    drawnPointCount += latLngs.length;
  }

  // 경계 도보 구간의 빈 쪽을 채울 단말 후보(매물/목적지).
  const hasProperty = propertyLat != null && propertyLng != null;
  const hasDestination = destinationLat != null && destinationLng != null;

  // anchor(인접 지하철역 좌표)와 더 가까운 단말을 고른다.
  // pathList 순서가 실제 이동 방향과 다를 수 있으므로 순서가 아닌 위치로 판단한다.
  const pickClosestTerminal = (lat: number, lng: number) => {
    const candidates: { lat: number; lng: number }[] = [];
    if (hasProperty) candidates.push({ lat: propertyLat!, lng: propertyLng! });
    if (hasDestination) {
      candidates.push({ lat: destinationLat!, lng: destinationLng! });
    }
    if (candidates.length === 0) return null;

    return candidates.reduce((closest, candidate) =>
      distanceSq(lat, lng, candidate.lat, candidate.lng) <
      distanceSq(lat, lng, closest.lat, closest.lng)
        ? candidate
        : closest
    );
  };

  // points가 없는 구간들을 emptySegments로 기록
  for (let i = 0; i < segmentBounds.length; i++) {
    const current = segmentBounds[i];
    if (current.points.length >= 2) continue; // points가 있으면 스킵

    // 이전 구간(transit)의 끝점
    let startLat: number | null = null;
    let startLng: number | null = null;

    for (let j = i - 1; j >= 0; j--) {
      const prev = segmentBounds[j];
      if (prev.endLat != null && prev.endLng != null) {
        startLat = prev.endLat;
        startLng = prev.endLng;
        break;
      }
    }

    // 다음 구간(transit)의 시작점
    let endLat: number | null = null;
    let endLng: number | null = null;

    for (let j = i + 1; j < segmentBounds.length; j++) {
      const next = segmentBounds[j];
      if (next.startLat != null && next.startLng != null) {
        endLat = next.startLat;
        endLng = next.startLng;
        break;
      }
    }

    const startOpen = startLat == null || startLng == null;
    const endOpen = endLat == null || endLng == null;

    if (startOpen && endOpen) {
      // 경유 구간이 전혀 없는 순수 도보: 매물 → 목적지.
      if (hasProperty) {
        startLat = propertyLat!;
        startLng = propertyLng!;
      }
      if (hasDestination) {
        endLat = destinationLat!;
        endLng = destinationLng!;
      }
    } else if (startOpen && endLat != null && endLng != null) {
      // 선행 경계 구간: 빈 시작점에 anchor(다음 역)와 가까운 단말을 배치.
      const terminal = pickClosestTerminal(endLat, endLng);
      if (terminal) {
        startLat = terminal.lat;
        startLng = terminal.lng;
      }
    } else if (endOpen && startLat != null && startLng != null) {
      // 후행 경계 구간: 빈 끝점에 anchor(이전 역)와 가까운 단말을 배치.
      const terminal = pickClosestTerminal(startLat, startLng);
      if (terminal) {
        endLat = terminal.lat;
        endLng = terminal.lng;
      }
    }

    // 유효한 시작/끝점이 있으면 emptySegments에 추가
    if (startLat != null && startLng != null && endLat != null && endLng != null) {
      emptySegments.push({ startLat, startLng, endLat, endLng });
    }
  }

  return { drawnPoints: drawnPointCount, emptySegments };
}
