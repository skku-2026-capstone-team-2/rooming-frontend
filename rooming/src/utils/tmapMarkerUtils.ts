import type { MutableRefObject } from "react";
import { createPropertyMarkerHTML } from "./createPropertyMarkerHTML";
import { createSchoolMarkerHTML } from "./createSchoolMarkerHTML";
import type { PropertyListItem } from "./propertyListItems";

export type MapCenter = {
  lat: number;
  lng: number;
};

type SearchParamsSetter = (params: Record<string, string>) => void;

export function getLatFromTmapCenter(center: any): number | null {
  if (!center) return null;

  if (typeof center.lat === "function") return Number(center.lat());
  if (typeof center.lat === "number") return center.lat;
  if (typeof center.getLat === "function") return Number(center.getLat());
  if (typeof center._lat === "number") return center._lat;

  return null;
}

export function getLngFromTmapCenter(center: any): number | null {
  if (!center) return null;

  if (typeof center.lng === "function") return Number(center.lng());
  if (typeof center.lng === "number") return center.lng;
  if (typeof center.getLng === "function") return Number(center.getLng());
  if (typeof center._lng === "number") return center._lng;

  return null;
}

export function getCurrentMapCenter(map: any, fallbackCenter: MapCenter): MapCenter {
  if (!map || typeof map.getCenter !== "function") {
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

export function clearMarkers(markersRef: MutableRefObject<any[]>, label = "마커") {
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
  markerRef: MutableRefObject<any | null>,
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
  map: any;
  markerRef: MutableRefObject<any | null>;
  position: MapCenter;
  label: string;
}) {
  if (!window.Tmapv2 || !map) return;
  if (markerRef.current) return;

  markerRef.current = new window.Tmapv2.Marker({
    position: new window.Tmapv2.LatLng(position.lat, position.lng),
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
}: {
  map: any;
  properties: PropertyListItem[];
  markersRef: MutableRefObject<any[]>;
  onClickProperty: SearchParamsSetter;
}) {
  if (!window.Tmapv2 || !map) return;

  clearMarkers(markersRef, "매물 마커");

  properties.forEach((property) => {
    const marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(property.lat, property.lng),
      map,
      title: property.title,
      iconHTML: createPropertyMarkerHTML(property.price),
      zIndex: 30,
    });

    marker.addListener("click", () => {
      onClickProperty({
        propertyId: String(property.id),
      });
    });

    markersRef.current.push(marker);
  });
}