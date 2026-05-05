export type InfraPlaceType = "cafe" | "gym" | "store" | "bus";

export type InfraPlace = {
  id: number;
  type: InfraPlaceType;
  label: string;
  lat: number;
  lng: number;
  distance: string;
};

export const infraPlaces: InfraPlace[] = [
  {
    id: 1,
    type: "cafe",
    label: "카페",
    lat: 37.5900,
    lng: 126.9950,
    distance: "도보 5분",
  },
  {
    id: 2,
    type: "gym",
    label: "헬스장",
    lat: 37.5880,
    lng: 126.9973,
    distance: "도보 3분",
  },
  {
    id: 3,
    type: "store",
    label: "편의점",
    lat: 37.5899,
    lng: 126.9935,
    distance: "도보 2분",
  },
  {
    id: 4,
    type: "bus",
    label: "버스정류장",
    lat: 37.5879,
    lng: 126.9952,
    distance: "도보 4분",
  },
];