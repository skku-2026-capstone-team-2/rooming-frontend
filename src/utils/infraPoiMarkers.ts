import { createInfraMarkerHTML } from "../utils/createInfraMarkerHTML";
import type { MutableRefObject } from "react";
import {
  searchTmapPoiByKeyword,
  searchTmapPoisByTypes,
  type PoiCategoryType,
  type PoiPlace,
} from "../api/tmapPoi";

export type InfraSearchCondition = {
  categories: string[];
  radius: number;
  customKeyword: string;
};

type MapCenter = {
  lat: number;
  lng: number;
};

type LoadPoiMarkersParams = {
  map: TmapMap;
  markersRef: MutableRefObject<TmapMarker[]>;
  condition: InfraSearchCondition;
  center: MapCenter;
};

const isPoiCategoryType = (value: string): value is PoiCategoryType => {
  return ["cafe", "gym", "store", "bus"].includes(value);
};

export const clearInfraMarkers = (markersRef: MutableRefObject<TmapMarker[]>) => {
  markersRef.current.forEach((marker) => {
    try {
      marker.setMap(null);
    } catch (error) {
      console.warn("인프라 마커 제거 실패:", error);
    }
  });

  markersRef.current = [];
};

function infraMarkersRefSafePush(
  markersRef: MutableRefObject<TmapMarker[]>,
  marker: TmapMarker
) {
  markersRef.current.push(marker);
}

/**
 * 카테고리 검색 결과와 키워드 검색 결과가 같은 장소를 반환할 수 있으므로 중복 제거.
 */
function dedupePoiPlaces(places: PoiPlace[]): PoiPlace[] {
  const seen = new Set<string>();

  return places.filter((place) => {
    const key = `${place.label}-${place.lat}-${place.lng}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export const renderInfraMarkers = ({
  map,
  markersRef,
  places,
}: {
  map: TmapMap;
  markersRef: MutableRefObject<TmapMarker[]>;
  places: PoiPlace[];
}) => {
  const tmap = window.Tmapv2;
  if (!map || !tmap) return;

  clearInfraMarkers(markersRef);

  places.forEach((place) => {
    const marker = new tmap.Marker({
      position: new tmap.LatLng(place.lat, place.lng),
      map,
      iconHTML: createInfraMarkerHTML({
        label: place.label,
        type: place.type,
      }),
      zIndex: 10,
    });

    infraMarkersRefSafePush(markersRef, marker);
  });
};

export const loadPoiMarkers = async ({
  map,
  markersRef,
  condition,
  center,
}: LoadPoiMarkersParams) => {
  if (!map) return;

  try {
    const customKeyword = condition.customKeyword.trim();
    const poiTypes = condition.categories.filter(isPoiCategoryType);

    const searchPromises: Promise<PoiPlace[]>[] = [];

    // 버튼으로 선택한 카테고리 검색
    if (poiTypes.length > 0) {
      searchPromises.push(
        searchTmapPoisByTypes({
          types: poiTypes,
          centerLat: center.lat,
          centerLng: center.lng,
          radius: condition.radius,
        })
      );
    }

    // 직접 입력한 키워드 검색
    if (customKeyword) {
      searchPromises.push(
        searchTmapPoiByKeyword({
          keyword: customKeyword,
          centerLat: center.lat,
          centerLng: center.lng,
          radius: condition.radius,
        })
      );
    }

    // 선택된 카테고리도 없고 키워드도 없으면 인프라 마커만 제거
    if (searchPromises.length === 0) {
      clearInfraMarkers(markersRef);
      return;
    }

    const results = await Promise.all(searchPromises);
    const places = dedupePoiPlaces(results.flat());

    renderInfraMarkers({
      map,
      markersRef,
      places,
    });
  } catch (error) {
    console.error("POI 검색 실패:", error);
    clearInfraMarkers(markersRef);
  }
};