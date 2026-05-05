import { createDistanceLabelHTML } from "./createDistanceLabelHTML";

type RoutePoint = {
  lat: number;
  lng: number;
  name: string;
};

type DrawPedestrianRouteParams = {
  map: any;
  from: RoutePoint;
  to: RoutePoint;
  strokeColor?: string;
};

export async function drawPedestrianRoute({
  map,
  from,
  to,
  strokeColor = "#6B67BB",
}: DrawPedestrianRouteParams) {
  if (!window.Tmapv2) return;

  const appKey = import.meta.env.VITE_TMAP_APP_KEY;

  if (!appKey) {
    console.error("VITE_TMAP_APP_KEY가 .env에 설정되어 있지 않습니다.");
    return;
  }

  try {
    const response = await fetch(
      "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          appKey,
        },
        body: JSON.stringify({
          startX: from.lng,
          startY: from.lat,
          endX: to.lng,
          endY: to.lat,
          startName: from.name,
          endName: to.name,
          reqCoordType: "WGS84GEO",
          resCoordType: "WGS84GEO",
          searchOption: "0",
          sort: "index",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`보행자 경로 API 실패: ${response.status}`);
    }

    const data = await response.json();

    const path: any[] = [];

    data.features?.forEach((feature: any) => {
      if (feature.geometry?.type !== "LineString") return;

      feature.geometry.coordinates.forEach(([lng, lat]: [number, number]) => {
        path.push(new window.Tmapv2.LatLng(lat, lng));
      });
    });

    if (path.length === 0) {
      console.warn("보행자 경로 좌표가 없습니다.");
      return;
    }

    const routeInfo = getPedestrianRouteInfo(data);
    const label = routeInfo.timeText;

    const pedestrianRouteLine = new window.Tmapv2.Polyline({
      path,
      strokeColor,
      strokeWeight: 5,
      strokeOpacity: 0.9,
      map,
    });

    const middlePosition = path[Math.floor(path.length / 2)];

    let labelMarker: any = null;

    const showLabel = () => {
      if (labelMarker) return;

      labelMarker = new window.Tmapv2.Marker({
        position: middlePosition,
        map,
        iconHTML: createDistanceLabelHTML(label),
        iconSize: new window.Tmapv2.Size(72, 28),
        iconAnchor: new window.Tmapv2.Point(36, 14),
      });
    };

    const hideLabel = () => {
      if (!labelMarker) return;

      labelMarker.setMap(null);
      labelMarker = null;
    };

    pedestrianRouteLine.addListener("mouseenter", showLabel);
    pedestrianRouteLine.addListener("mouseleave", hideLabel);
  } catch (error) {
    console.error("보행자 경로 표시 실패:", error);
  }
}

function getPedestrianRouteInfo(data: any) {
  const startFeature = data.features?.find(
    (feature: any) => feature.geometry?.type === "Point"
  );

  const totalTime = startFeature?.properties?.totalTime;
  const totalDistance = startFeature?.properties?.totalDistance;

  return {
    totalTime,
    totalDistance,
    timeText: formatWalkingTime(totalTime),
    distanceText: formatWalkingDistance(totalDistance),
  };
}

function formatWalkingTime(totalSeconds?: number) {
  if (typeof totalSeconds !== "number") {
    return "도보 정보";
  }

  const minutes = Math.ceil(totalSeconds / 60);

  if (minutes < 60) {
    return `도보 ${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `도보 ${hours}시간`;
  }

  return `도보 ${hours}시간 ${remainingMinutes}분`;
}

function formatWalkingDistance(totalMeters?: number) {
  if (typeof totalMeters !== "number") {
    return "";
  }

  if (totalMeters < 1000) {
    return `${Math.round(totalMeters)}m`;
  }

  return `${(totalMeters / 1000).toFixed(1)}km`;
}