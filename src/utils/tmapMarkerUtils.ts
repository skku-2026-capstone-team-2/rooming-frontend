import type { MutableRefObject } from "react";
import {
  createPropertyGroupMarkerHTML,
  createPropertyMarkerHTML,
} from "./createPropertyMarkerHTML";
import { createSchoolMarkerHTML } from "./createSchoolMarkerHTML";
import type { PropertyCardView } from "../types";
import { getTmapAddressLookupKey } from "../api/tmapGeocode";

export type MapCenter = {
  lat: number;
  lng: number;
};

type PropertyMarkerClickParams = {
  propertyId: string;
  propertyIds?: string[];
};

type SearchParamsSetter = (params: PropertyMarkerClickParams) => void;

type PropertyMarkerGroup = {
  key: string;
  properties: PropertyCardView[];
  position: MapCenter;
};

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

/**
 * 좌표가 있는 매물만 추출한다.
 */
export function getValidPropertyPositions(
  properties: PropertyCardView[]
): MapCenter[] {
  return properties
    .filter(
      (property) =>
        typeof property.lat === "number" &&
        Number.isFinite(property.lat) &&
        typeof property.lng === "number" &&
        Number.isFinite(property.lng)
    )
    .map((property) => ({
      lat: property.lat!,
      lng: property.lng!,
    }));
}

/**
 * 매물 좌표들의 평균 중심점을 구한다.
 * 좌표가 있는 매물이 없으면 fallbackCenter를 반환한다.
 */
export function getPropertiesCenter(
  properties: PropertyCardView[],
  fallbackCenter: MapCenter
): MapCenter {
  const positions = getValidPropertyPositions(properties);

  if (positions.length === 0) {
    return fallbackCenter;
  }

  const sum = positions.reduce(
    (acc, position) => ({
      lat: acc.lat + position.lat,
      lng: acc.lng + position.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / positions.length,
    lng: sum.lng / positions.length,
  };
}

/**
 * 매물 분포 범위에 따라 지도 zoom을 대략 조절한다.
 * 숫자가 클수록 더 확대된다.
 */
export function getPropertyViewportZoom(
  properties: PropertyCardView[],
  fallbackZoom = 17
): number {
  const positions = getValidPropertyPositions(properties);

  if (positions.length === 0) return fallbackZoom;
  if (positions.length === 1) return 17;

  const lats = positions.map((position) => position.lat);
  const lngs = positions.map((position) => position.lng);

  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lngSpan = Math.max(...lngs) - Math.min(...lngs);
  const maxSpan = Math.max(latSpan, lngSpan);

  if (maxSpan > 0.03) return 13;
  if (maxSpan > 0.015) return 14;
  if (maxSpan > 0.007) return 15;
  if (maxSpan > 0.003) return 16;
  return 17;
}

function getPropertyPosition(property: PropertyCardView): MapCenter | null {
  if (
    typeof property.lat !== "number" ||
    !Number.isFinite(property.lat) ||
    typeof property.lng !== "number" ||
    !Number.isFinite(property.lng)
  ) {
    return null;
  }

  return {
    lat: property.lat,
    lng: property.lng,
  };
}


function getPropertyMarkerGroupKey(property: PropertyCardView) {
  const addressKey = getTmapAddressLookupKey(property.address);

  if (addressKey) {
    return `address:${addressKey}`;
  }

  const position = getPropertyPosition(property);

  if (!position) return null;

  return `position:${position.lat.toFixed(6)},${position.lng.toFixed(6)}`;
}

function getGroupPosition(properties: PropertyCardView[]): MapCenter | null {
  const positions = properties
    .map(getPropertyPosition)
    .filter((position): position is MapCenter => position !== null);

  if (positions.length === 0) return null;

  const sum = positions.reduce(
    (acc, position) => ({
      lat: acc.lat + position.lat,
      lng: acc.lng + position.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / positions.length,
    lng: sum.lng / positions.length,
  };
}

function groupPropertiesForMarkers(
  properties: PropertyCardView[]
): PropertyMarkerGroup[] {
  const groups = new Map<string, PropertyCardView[]>();

  properties.forEach((property) => {
    if (!getPropertyPosition(property)) return;

    const key = getPropertyMarkerGroupKey(property);

    if (!key) return;

    const group = groups.get(key);

    if (group) {
      group.push(property);
    } else {
      groups.set(key, [property]);
    }
  });

  return Array.from(groups.entries())
    .map(([key, groupProperties]) => {
      const position = getGroupPosition(groupProperties);

      if (!position) return null;

      return {
        key,
        properties: groupProperties,
        position,
      };
    })
    .filter((group): group is PropertyMarkerGroup => group !== null);
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

  clearMarkers(markersRef, "매물 마커");

  if (!enabled) return;

  groupPropertiesForMarkers(properties).forEach((group) => {
    const [primaryProperty] = group.properties;
    const isGroup = group.properties.length > 1;
    const isFavoriteMarker = group.properties.some(
      (property) => property.favorite
    );

    const marker = new tmap.Marker({
      position: new tmap.LatLng(group.position.lat, group.position.lng),
      map,
      title: isGroup
        ? `${group.properties.length}개 매물`
        : primaryProperty.title,
      iconHTML: isGroup
        ? createPropertyGroupMarkerHTML(
            group.properties.length,
            isFavoriteMarker ? "my" : "default"
          )
        : createPropertyMarkerHTML(
            primaryProperty.priceLabel,
            isFavoriteMarker ? "my" : "default"
          ),
      zIndex: 30,
    });

    marker.addListener?.("click", () => {
      onClickProperty({
        propertyId: String(primaryProperty.propertyId),
        propertyIds: isGroup
          ? group.properties.map((property) => String(property.propertyId))
          : undefined,
      });
    });

    markersRef.current.push(marker);
  });
}
