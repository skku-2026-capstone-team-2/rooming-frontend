export type Property = {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
  area: string;
  distance: string;
  lat: number;
  lng: number;
};

export const properties: Property[] = [
  {
    id: 1,
    title: "성대 도보권 원룸",
    price: "500 / 55",
    description: "강의실까지 도보 12분, 헬스장·편의점 인접",
    image: "property1",
    area: "20m²",
    distance: "12분",
    lat: 37.5898,
    lng: 126.9942,
  },
  {
    id: 2,
    title: "도서관 인접 원룸",
    price: "1000 / 60",
    description: "학업 중심 생활권, 조용한 환경",
    image: "property2",
    area: "25m²",
    distance: "15분",
    lat: 37.5889,
    lng: 126.9940,

  },
  {
    id: 3,
    title: "헬스장 근처 투룸",
    price: "800 / 65",
    description: "생활 인프라 우수, 편의점 도보 2분",
    image: "property3",
    area: "30m²",
    distance: "5분",
    lat: 37.5873,
    lng: 126.9961,
  },
  {
    id: 4,
    title: "카페거리 원룸",
    price: "700 / 58",
    description: "감성적인 생활 환경, 대중교통 편리",
    image: "property4",
    area: "22m²",
    distance: "10분",
    lat: 37.5865,
    lng: 126.9918,
  },
];