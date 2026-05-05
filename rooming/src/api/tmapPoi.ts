export type PoiType = "cafe" | "gym" | "store" | "bus";

export type PoiPlace = {
  id: string;
  type: PoiType;
  label: string;
  lat: number;
  lng: number;
};

const TMAP_APP_KEY = import.meta.env.VITE_TMAP_APP_KEY;

const keywordMap: Record<PoiType, string> = {
  cafe: "성균관대 카페",
  gym: "성균관대 헬스장",
  store: "편의점",
  bus: "버스정류장",
};

type SearchTmapPoiParams = {
  type: PoiType;
  centerLat: number;
  centerLng: number;
  radius: number;
};

export async function searchTmapPoi({
  type,
  centerLat,
  centerLng,
  radius,
}: SearchTmapPoiParams): Promise<PoiPlace[]> {
  if (!TMAP_APP_KEY) {
    throw new Error("VITE_TMAP_APP_KEY가 설정되어 있지 않습니다.");
  }

  const params = new URLSearchParams({
    version: "1",
    searchKeyword: keywordMap[type],
    searchType: "all",
    searchtypCd: "R",
    centerLat: String(centerLat),
    centerLon: String(centerLng),
    radius: String(Math.max(1, Math.ceil(radius / 1000))),
    count: "20",
    reqCoordType: "WGS84GEO",
    resCoordType: "WGS84GEO",
  });

  const response = await fetch(
    `https://apis.openapi.sk.com/tmap/pois?${params.toString()}`,
    {
      method: "GET",
      headers: {
        appKey: TMAP_APP_KEY,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Tmap POI 검색에 실패했습니다.");
  }

  const data = await response.json();
  const poiList = data?.searchPoiInfo?.pois?.poi ?? [];

  return poiList
    .map((poi: any) => {
      const lat = Number(poi.noorLat);
      const lng = Number(poi.noorLon);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }

      return {
        id: `${type}-${poi.id}`,
        type,
        label: poi.name,
        lat,
        lng,
      };
    })
    .filter(Boolean) as PoiPlace[];
}

export async function searchTmapPoisByTypes({
  types,
  centerLat,
  centerLng,
  radius,
}: {
  types: PoiType[];
  centerLat: number;
  centerLng: number;
  radius: number;
}) {
  const results = await Promise.all(
    types.map((type) =>
      searchTmapPoi({
        type,
        centerLat,
        centerLng,
        radius,
      })
    )
  );

  return results.flat();
}

export async function searchTmapPoiByKeyword({
  keyword,
  centerLat,
  centerLng,
  radius,
}: {
  keyword: string;
  centerLat: number;
  centerLng: number;
  radius: number;
}): Promise<PoiPlace[]> {
  if (!TMAP_APP_KEY) {
    throw new Error("VITE_TMAP_APP_KEY가 설정되어 있지 않습니다.");
  }

  const params = new URLSearchParams({
    version: "1",
    searchKeyword: keyword,
    searchType: "all",
    searchtypCd: "A",
    centerLat: String(centerLat),
    centerLon: String(centerLng),
    radius: String(Math.max(1, Math.ceil(radius / 1000))),
    count: "20",
    reqCoordType: "WGS84GEO",
    resCoordType: "WGS84GEO",
  });

  const response = await fetch(
    `https://apis.openapi.sk.com/tmap/pois?${params.toString()}`,
    {
      method: "GET",
      headers: {
        appKey: TMAP_APP_KEY,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Tmap POI 키워드 검색에 실패했습니다.");
  }

  const data = await response.json();
  const poiList = data?.searchPoiInfo?.pois?.poi ?? [];

  return poiList
    .map((poi: any) => {
      const lat = Number(poi.noorLat);
      const lng = Number(poi.noorLon);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }

      return {
        id: `keyword-${poi.id}`,
        type: "store",
        label: poi.name,
        lat,
        lng,
      };
    })
    .filter(Boolean) as PoiPlace[];
}