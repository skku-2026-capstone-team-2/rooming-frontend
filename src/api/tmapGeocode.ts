export type TmapGeocodedAddress = {
  address: string;
  lat: number;
  lng: number;
};

const TMAP_APP_KEY = import.meta.env.VITE_TMAP_APP_KEY;
const geocodeCache = new Map<string, Promise<TmapGeocodedAddress | null>>();

type TmapFullAddressGeoCoordinate = {
  lat?: string | number;
  lon?: string | number;
  newLat?: string | number;
  newLon?: string | number;
};

type TmapFullAddressGeoResponse = {
  coordinateInfo?: {
    coordinate?:
      | TmapFullAddressGeoCoordinate
      | TmapFullAddressGeoCoordinate[];
  };
};

function normalizeAddress(value: string) {
  return value
    .replace(/\([^)]*\)/g, " ")
    .split(",")[0]
    .replace(/\s+/g, " ")
    .trim();
}

function toNumber(value: string | number | undefined) {
  if (value === undefined || value === "") return NaN;
  return Number(value);
}

function firstFiniteNumber(...values: Array<string | number | undefined>) {
  for (const value of values) {
    const number = toNumber(value);

    if (Number.isFinite(number)) return number;
  }

  return NaN;
}

function toCoordinate(
  coordinate: TmapFullAddressGeoCoordinate
): TmapGeocodedAddress | null {
  const lat = firstFiniteNumber(coordinate.newLat, coordinate.lat);
  const lng = firstFiniteNumber(coordinate.newLon, coordinate.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return {
    address: "",
    lat,
    lng,
  };
}

export function getTmapAddressLookupKey(address: string | null | undefined) {
  if (!address) return "";
  return normalizeAddress(address);
}

export async function geocodeTmapAddress(
  address: string
): Promise<TmapGeocodedAddress | null> {
  const lookupAddress = getTmapAddressLookupKey(address);

  if (!lookupAddress) return null;

  const cached = geocodeCache.get(lookupAddress);

  if (cached) return cached;

  const request = (async () => {
    if (!TMAP_APP_KEY) {
      throw new Error("VITE_TMAP_APP_KEY is not configured.");
    }

    const params = new URLSearchParams({
      version: "1",
      format: "json",
      coordType: "WGS84GEO",
      fullAddr: lookupAddress,
    });

    const response = await fetch(
      `https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?${params.toString()}`,
      {
        method: "GET",
        headers: {
          appKey: TMAP_APP_KEY,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Tmap address geocoding failed.");
    }

    const data = (await response.json()) as TmapFullAddressGeoResponse;
    const rawCoordinates = data.coordinateInfo?.coordinate;
    const coordinates = Array.isArray(rawCoordinates)
      ? rawCoordinates
      : rawCoordinates
        ? [rawCoordinates]
        : [];

    for (const coordinate of coordinates) {
      const result = toCoordinate(coordinate);

      if (result) {
        return {
          ...result,
          address: lookupAddress,
        };
      }
    }

    return null;
  })();

  geocodeCache.set(lookupAddress, request);

  request.catch(() => {
    geocodeCache.delete(lookupAddress);
  });

  return request;
}
