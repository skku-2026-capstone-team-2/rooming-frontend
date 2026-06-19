import type { MutableRefObject } from "react";
import { createPropertyMarkerHTML } from "./createPropertyMarkerHTML";
import { createSchoolMarkerHTML } from "./createSchoolMarkerHTML";
import type { PropertyCardView } from "../types";

export type MapCenter = {
  lat: number;
  lng: number;
};

type SearchParamsSetter = (params: Record<string, string>) => void;

export function getLatFromTmapCenter(center: TmapLatLng | null): number | null {
  if (!center) return null;

  if (typeof center.lat === "function") return Number(center.lat());
  if (typeof center.lat === "number") return center.lat;
  if (typeof center.getLat === "function") return Number(center.getLat());
  if (typeof center._lat === "number") return center._lat;

  return null;
}

export function getLngFromTmapCenter(center: TmapLatLng | null): number | null {
  if (!center) return null;

  if (typeof center.lng === "function") return Number(center.lng());
  if (typeof center.lng === "number") return center.lng;
  if (typeof center.getLng === "function") return Number(center.getLng());
  if (typeof center._lng === "number") return center._lng;

  return null;
}

export function getCurrentMapCenter(
  map: TmapMap | null,
  fallbackCenter: MapCenter
): MapCenter {
  if (!map || !map.getCenter) {
    return fallbackCenter;
  }

  const center = map.getCenter();
  const lat = getLatFromTmapCenter(center);
  const lng = getLngFromTmapCenter(center);

  if (
    lat === null ||
    lng === null ||
    Number.isNaN(lat) ||
    Number.isNaN(lng)
  ) {
    console.warn("현재 지도 중심 좌표를 읽지 못해 기본 중심 좌표를 사용합니다.");
    return fallbackCenter;
  }

  return { lat, lng };
}

export function clearMarkers(
  markersRef: MutableRefObject<TmapMarker[]>,
  label = "마커"
) {
  markersRef.current.forEach((marker) => {
    try {
      marker.setMap(null);
    } catch (error) {
      console.warn(`${label} 제거 실패:`, error);
    }
  });

  markersRef.current = [];
}

export function clearSingleMarker(
  markerRef: MutableRefObject<TmapMarker | null>,
  label = "마커"
) {
  if (!markerRef.current) return;

  try {
    markerRef.current.setMap(null);
  } catch (error) {
    console.warn(`${label} 제거 실패:`, error);
  }

  markerRef.current = null;
}

export function loadSchoolMarker({
  map,
  markerRef,
  position,
  label,
}: {
  map: TmapMap;
  markerRef: MutableRefObject<TmapMarker | null>;
  position: MapCenter;
  label: string;
}) {
  const tmap = window.Tmapv2;
  if (!tmap || !map) return;
  if (markerRef.current) return;

  markerRef.current = new tmap.Marker({
    position: new tmap.LatLng(position.lat, position.lng),
    map,
    iconHTML: createSchoolMarkerHTML(label),
    zIndex: 40,
  });
}

export function loadPropertyMarkers({
  map,
  properties,
  markersRef,
  onClickProperty,
  enabled = true,
}: {
  map: TmapMap;
  properties: PropertyCardView[];
  markersRef: MutableRefObject<TmapMarker[]>;
  onClickProperty: SearchParamsSetter;
  enabled?: boolean;
}) {
  const tmap = window.Tmapv2;
  if (!tmap || !map) return;

  // 기존 매물 마커는 항상 먼저 제거
  clearMarkers(markersRef, "매물 마커");

  // toggle off 상태면 제거만 하고 새로 만들지 않음
  if (!enabled) return;

  properties.forEach((property) => {
    // 좌표가 없는 매물은 지도에 표시할 수 없으므로 건너뛴다.
    if (property.lat == null || property.lng == null) return;

    const marker = new tmap.Marker({
      position: new tmap.LatLng(property.lat, property.lng),
      map,
      title: property.title,
      iconHTML: createPropertyMarkerHTML(
        property.priceLabel,
        property.favorite ? "my" : "default"
      ),
      zIndex: 30,
    });

    marker.addListener?.("click", () => {
      onClickProperty({
        propertyId: String(property.propertyId),
      });
    });

    markersRef.current.push(marker);
  });
}
