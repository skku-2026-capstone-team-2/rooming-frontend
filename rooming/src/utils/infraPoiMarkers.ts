import { createInfraMarkerHTML } from "../utils/createInfraMarkerHTML";
import {
  searchTmapPoiByKeyword,
  searchTmapPoisByTypes,
  type PoiPlace,
  type PoiType,
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
  map: any;
  markersRef: React.MutableRefObject<any[]>;
  condition: InfraSearchCondition;
  center: MapCenter;
};

const isPoiType = (value: string): value is PoiType => {
  return ["cafe", "gym", "store", "bus"].includes(value);
};

export const clearInfraMarkers = (markersRef: React.MutableRefObject<any[]>) => {
  markersRef.current.forEach((marker) => {
    marker.setMap(null);
  });

  markersRef.current = [];
};

export const renderInfraMarkers = ({
  map,
  markersRef,
  places,
}: {
  map: any;
  markersRef: React.MutableRefObject<any[]>;
  places: PoiPlace[];
}) => {
  if (!map || !window.Tmapv2) return;

  clearInfraMarkers(markersRef);

  places.forEach((place) => {
    const marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(place.lat, place.lng),
      map,
      iconHTML: createInfraMarkerHTML({
        label: place.label,
        type: place.type,
      }),
      zIndex: 10,
    });

    markersRef.current.push(marker);
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

    let places: PoiPlace[] = [];

    if (customKeyword) {
      places = await searchTmapPoiByKeyword({
        keyword: customKeyword,
        centerLat: center.lat,
        centerLng: center.lng,
        radius: condition.radius,
      });
    } else {
      const poiTypes = condition.categories.filter(isPoiType);

      if (poiTypes.length === 0) {
        clearInfraMarkers(markersRef);
        return;
      }

      places = await searchTmapPoisByTypes({
        types: poiTypes,
        centerLat: center.lat,
        centerLng: center.lng,
        radius: condition.radius,
      });
    }

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