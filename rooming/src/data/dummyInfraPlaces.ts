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
    lat: 37.5898,
    lng: 126.9957,
    distance: "도보 5분",
  },
  {
    id: 2,
    type: "gym",
    label: "헬스장",
    lat: 37.5891,
    lng: 126.9949,
    distance: "도보 3분",
  },
  {
    id: 3,
    type: "store",
    label: "편의점",
    lat: 37.5895,
    lng: 126.9943,
    distance: "도보 2분",
  },
  {
    id: 4,
    type: "bus",
    label: "버스정류장",
    lat: 37.5886,
    lng: 126.9959,
    distance: "도보 4분",
  },
  {
    id: 5,
    type: "cafe",
    label: "스터디카페",
    lat: 37.5902,
    lng: 126.9947,
    distance: "도보 6분",
  },
  {
    id: 6,
    type: "store",
    label: "24시 편의점",
    lat: 37.5892,
    lng: 126.9936,
    distance: "도보 5분",
  },
  {
    id: 7,
    type: "gym",
    label: "필라테스",
    lat: 37.5902,
    lng: 126.9934,
    distance: "도보 6분",
  },
  {
    id: 8,
    type: "bus",
    label: "혜화역 방면 정류장",
    lat: 37.5889,
    lng: 126.9944,
    distance: "도보 6분",
  },
];