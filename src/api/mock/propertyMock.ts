import type {
  Property,
  PropertyDetail,
  PropertyImagesData,
  Property3D,
} from "../../types";
import { mockData, mockError } from "./runtime";

const mockProperties: Property[] = [
  {
    propertyId: 1,
    title: "스테이원룸 101호",
    address: "서울 종로구 성균관로 ...",
    latitude: 37.5898,
    longitude: 126.9942,
    tradeType: "MONTHLY_RENT",
    deposit: 500,
    monthlyRent: 55,
    areaM2: 23.5,
    roomType: "one_room",
    floorInfo: "1층",
    maintenanceFee: 0,
    description: "생활 인프라 우수, 편의점 도보 2분",
    tags: ["편의점", "인프라"],
    has3DModel: false,
    splineUrl: null,
    imageUrls: ["/images/dummy-property-img.webp"],
  },
  {
    propertyId: 2,
    title: "캠퍼스빌 203호",
    address: "서울 종로구 명륜4가 ...",
    latitude: 37.5889,
    longitude: 126.994,
    tradeType: "MONTHLY_RENT",
    deposit: 1000,
    monthlyRent: 60,
    areaM2: 25,
    roomType: "one_room",
    floorInfo: "2층",
    maintenanceFee: 5,
    description: "학업 중심 생활권, 조용한 환경",
    tags: ["조용함"],
    has3DModel: false,
    splineUrl: null,
    imageUrls: null,
  },
  {
    propertyId: 3,
    title: "헬스장 근처 투룸",
    address: "서울 종로구 명륜2가 ...",
    latitude: 37.5873,
    longitude: 126.9961,
    tradeType: "MONTHLY_RENT",
    deposit: 800,
    monthlyRent: 65,
    areaM2: 30,
    roomType: "two_room",
    floorInfo: "3층",
    maintenanceFee: 6,
    description: "강의실까지 도보 5분, 헬스장·편의점 인접",
    tags: ["헬스장", "편의점"],
    has3DModel: true,
    splineUrl: "https://prod.spline.design/wfb4c8rbD6tko0mP/scene.splinecode",
    imageUrls: null,
  },
  {
    propertyId: 4,
    title: "카페거리 원룸",
    address: "서울 종로구 명륜3가 ...",
    latitude: 37.5865,
    longitude: 126.9937,
    tradeType: "MONTHLY_RENT",
    deposit: 700,
    monthlyRent: 58,
    areaM2: 22,
    roomType: "one_room",
    floorInfo: "2층",
    maintenanceFee: 4,
    description: "감성적인 생활 환경, 대중교통 편리",
    tags: ["카페", "대중교통"],
    has3DModel: false,
    splineUrl: null,
    imageUrls: null,
  },
];

export const propertyMock = {
  getProperties(): Promise<Property[]> {
    return mockData(mockProperties);
  },

  getProperty(id: number): Promise<PropertyDetail> {
    const p = mockProperties.find((item) => item.propertyId === id);
    if (!p) return mockError(404, `매물을 찾을 수 없습니다. (id=${id})`);

    const detail: PropertyDetail = {
      propertyId: p.propertyId,
      title: p.title,
      address: p.address,
      tradeType: p.tradeType,
      deposit: p.deposit,
      monthlyRent: p.monthlyRent,
      areaM2: p.areaM2,
      roomType: p.roomType,
      floorInfo: p.floorInfo,
      maintenanceFee: p.maintenanceFee,
      description: p.description,
      tags: p.tags,
      has3DModel: p.has3DModel,
    };
    return mockData(detail);
  },

  getPropertyImages(id: number): Promise<PropertyImagesData> {
    const p = mockProperties.find((item) => item.propertyId === id);
    if (!p) return mockError(404, `매물을 찾을 수 없습니다. (id=${id})`);

    const images = (p.imageUrls ?? []).map((url, idx) => ({
      imageId: idx + 1,
      imageUrl: url,
      imageOrder: idx + 1,
    }));
    return mockData({ propertyId: id, images });
  },

  getProperty3D(id: number): Promise<Property3D> {
    const p = mockProperties.find((item) => item.propertyId === id);
    if (!p) return mockError(404, `매물을 찾을 수 없습니다. (id=${id})`);

    const result: Property3D = {
      propertyId: p.propertyId,
      has3DModel: p.has3DModel ?? false,
      modelType: "spline",
      modelUrl: p.splineUrl ?? null,
      previewImageUrl: null,
    };
    return mockData(result);
  },
};
