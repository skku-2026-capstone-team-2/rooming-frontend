export type TransactionType = "MONTHLY_RENT";

export type TransportMode = "WALK" | "TRANSIT";

export type InfraCategory =
  | "GYM"
  | "CAFE"
  | "CONVENIENCE_STORE"
  | "BUS_STOP"
  | "SUBWAY"
  | "MART"
  | "FOOD";

export type RoutePath = {
  type: "WALK" | "BUS";
  time: number;
  distance: number;
  stationCount?: number;
  lane?: string;
};

export type RouteJson = {
  totalTime: number;
  totalDistance: number;
  payment: number;
  pathList: RoutePath[];
};

export type InfraItem = {
  name: string;
  category: InfraCategory;
  roadAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  transportMode: TransportMode;
  routeJson: RouteJson;
  requestedKeyword?: string;
};

export type FavoriteItem = {
  favoriteId: number;
  propertyId: number;
  snapshot: {
    propertyId: number;
    title: string;
    roadAddress: string;
    location: {
      latitude: number;
      longitude: number;
    };
    price: {
      transactionType: TransactionType;
      depositAmount: number;
      monthlyRent: number;
      maintenanceFee: number;
    };
    areaM2: number;
    matchScore: number;
    matchReasons: string[];
    images: {
      imageUrl: string;
      sortOrder: number;
      isMain: boolean;
    }[];
    hasProperty3D: boolean;
    property3D: {
      viewerUrl: string;
      assetUrl: string;
      thumbnailUrl: string;
    } | null;
    standardInfra: InfraItem[];
    runtimeInfra: InfraItem[];
    keyPlaceRoutes: {
      userPlaceId: number;
      placeName: string;
      placeType: "UNIVERSITY";
      transportMode: TransportMode;
      routeJson: RouteJson;
    }[];
  };
  createdAt: string;
  updatedAt: string;
};

export const favoriteListDummyData: {
  success: boolean;
  data: FavoriteItem[];
  message: string;
} = {
  success: true,
  data: [
    {
      favoriteId: 12,
      propertyId: 101,
      snapshot: {
        propertyId: 101,
        title: "성대역 도보권 햇살 원룸",
        roadAddress: "경기 수원시 장안구 율전동 ...",
        location: {
          latitude: 37.2945,
          longitude: 126.9748,
        },
        price: {
          transactionType: "MONTHLY_RENT",
          depositAmount: 10000000,
          monthlyRent: 450000,
          maintenanceFee: 50000,
        },
        areaM2: 23.5,
        matchScore: 0.94,
        matchReasons: [
          "학교까지 도보 17분",
          "헬스장 도보 4분",
          "BHC 도보 6분",
        ],
        images: [
          {
            imageUrl: "https://example.com/properties/101/main.jpg",
            sortOrder: 1,
            isMain: true,
          },
        ],
        hasProperty3D: true,
        property3D: {
          viewerUrl: "https://viewer.example.com/properties/101",
          assetUrl: "https://cdn.example.com/assets/101.glb",
          thumbnailUrl: "https://cdn.example.com/assets/101-thumb.jpg",
        },
        standardInfra: [
          {
            name: "스포짐 수원성대점",
            category: "GYM",
            roadAddress: "경기 수원시 장안구 ...",
            location: {
              latitude: 37.2948,
              longitude: 126.9752,
            },
            transportMode: "WALK",
            routeJson: {
              totalTime: 4,
              totalDistance: 320,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 4,
                  distance: 320,
                },
              ],
            },
          },
        ],
        runtimeInfra: [
          {
            name: "BHC 수원성대점",
            category: "FOOD",
            roadAddress: "경기 수원시 장안구 ...",
            location: {
              latitude: 37.2952,
              longitude: 126.9739,
            },
            transportMode: "WALK",
            routeJson: {
              totalTime: 6,
              totalDistance: 480,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 6,
                  distance: 480,
                },
              ],
            },
            requestedKeyword: "BHC",
          },
        ],
        keyPlaceRoutes: [
          {
            userPlaceId: 3,
            placeName: "성균관대학교 자연과학캠퍼스",
            placeType: "UNIVERSITY",
            transportMode: "TRANSIT",
            routeJson: {
              totalTime: 17,
              totalDistance: 3600,
              payment: 1450,
              pathList: [
                {
                  type: "WALK",
                  time: 5,
                  distance: 300,
                },
                {
                  type: "BUS",
                  time: 12,
                  distance: 3300,
                  stationCount: 5,
                  lane: "7770",
                },
              ],
            },
          },
        ],
      },
      createdAt: "2026-04-10T14:20:00",
      updatedAt: "2026-04-10T14:20:00",
    },
    {
      favoriteId: 13,
      propertyId: 102,
      snapshot: {
        propertyId: 102,
        title: "율전동 조용한 풀옵션 원룸",
        roadAddress: "경기 수원시 장안구 율전동 ...",
        location: {
          latitude: 37.2961,
          longitude: 126.9729,
        },
        price: {
          transactionType: "MONTHLY_RENT",
          depositAmount: 5000000,
          monthlyRent: 520000,
          maintenanceFee: 60000,
        },
        areaM2: 21.8,
        matchScore: 0.91,
        matchReasons: [
          "학교까지 버스 14분",
          "편의점 도보 2분",
          "카페 도보 5분",
        ],
        images: [
          {
            imageUrl: "https://example.com/properties/102/main.jpg",
            sortOrder: 1,
            isMain: true,
          },
        ],
        hasProperty3D: true,
        property3D: {
          viewerUrl: "https://viewer.example.com/properties/102",
          assetUrl: "https://cdn.example.com/assets/102.glb",
          thumbnailUrl: "https://cdn.example.com/assets/102-thumb.jpg",
        },
        standardInfra: [
          {
            name: "CU 수원율전점",
            category: "CONVENIENCE_STORE",
            roadAddress: "경기 수원시 장안구 ...",
            location: {
              latitude: 37.2964,
              longitude: 126.9733,
            },
            transportMode: "WALK",
            routeJson: {
              totalTime: 2,
              totalDistance: 160,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 2,
                  distance: 160,
                },
              ],
            },
          },
        ],
        runtimeInfra: [
          {
            name: "메가커피 수원성대점",
            category: "CAFE",
            roadAddress: "경기 수원시 장안구 ...",
            location: {
              latitude: 37.2959,
              longitude: 126.9747,
            },
            transportMode: "WALK",
            routeJson: {
              totalTime: 5,
              totalDistance: 410,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 5,
                  distance: 410,
                },
              ],
            },
            requestedKeyword: "카페",
          },
        ],
        keyPlaceRoutes: [
          {
            userPlaceId: 3,
            placeName: "성균관대학교 자연과학캠퍼스",
            placeType: "UNIVERSITY",
            transportMode: "TRANSIT",
            routeJson: {
              totalTime: 14,
              totalDistance: 3100,
              payment: 1450,
              pathList: [
                {
                  type: "WALK",
                  time: 4,
                  distance: 260,
                },
                {
                  type: "BUS",
                  time: 10,
                  distance: 2840,
                  stationCount: 4,
                  lane: "62-1",
                },
              ],
            },
          },
        ],
      },
      createdAt: "2026-04-11T09:10:00",
      updatedAt: "2026-04-11T09:10:00",
    },
    {
      favoriteId: 14,
      propertyId: 103,
      snapshot: {
        propertyId: 103,
        title: "정문 가까운 깔끔한 분리형 원룸",
        roadAddress: "경기 수원시 장안구 천천동 ...",
        location: {
          latitude: 37.2928,
          longitude: 126.9762,
        },
        price: {
          transactionType: "MONTHLY_RENT",
          depositAmount: 7000000,
          monthlyRent: 480000,
          maintenanceFee: 40000,
        },
        areaM2: 24.7,
        matchScore: 0.89,
        matchReasons: [
          "학교까지 도보 13분",
          "버스정류장 도보 3분",
          "헬스장 도보 7분",
        ],
        images: [
          {
            imageUrl: "https://example.com/properties/103/main.jpg",
            sortOrder: 1,
            isMain: true,
          },
        ],
        hasProperty3D: false,
        property3D: null,
        standardInfra: [
          {
            name: "성대앞 버스정류장",
            category: "BUS_STOP",
            roadAddress: "경기 수원시 장안구 ...",
            location: {
              latitude: 37.2931,
              longitude: 126.9766,
            },
            transportMode: "WALK",
            routeJson: {
              totalTime: 3,
              totalDistance: 210,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 3,
                  distance: 210,
                },
              ],
            },
          },
        ],
        runtimeInfra: [
          {
            name: "GS25 수원성대점",
            category: "CONVENIENCE_STORE",
            roadAddress: "경기 수원시 장안구 ...",
            location: {
              latitude: 37.2935,
              longitude: 126.9756,
            },
            transportMode: "WALK",
            routeJson: {
              totalTime: 4,
              totalDistance: 330,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 4,
                  distance: 330,
                },
              ],
            },
            requestedKeyword: "편의점",
          },
        ],
        keyPlaceRoutes: [
          {
            userPlaceId: 3,
            placeName: "성균관대학교 자연과학캠퍼스",
            placeType: "UNIVERSITY",
            transportMode: "WALK",
            routeJson: {
              totalTime: 13,
              totalDistance: 980,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 13,
                  distance: 980,
                },
              ],
            },
          },
        ],
      },
      createdAt: "2026-04-12T18:30:00",
      updatedAt: "2026-04-12T18:30:00",
    },
  ],
  message: "즐겨찾기 목록 조회에 성공했습니다.",
};