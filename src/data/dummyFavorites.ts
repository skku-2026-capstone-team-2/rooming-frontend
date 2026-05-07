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
      favoriteId: 1,
      propertyId: 1,
      snapshot: {
        propertyId: 1,
        title: "스테이원룸 101호",
        roadAddress: "서울 종로구 성균관로 ...",
        location: {
          latitude: 37.5898,
          longitude: 126.9942,
        },
        price: {
          transactionType: "MONTHLY_RENT",
          depositAmount: 5000000,
          monthlyRent: 550000,
          maintenanceFee: 0,
        },
        areaM2: 23.5,
        matchScore: 0.95,
        matchReasons: ["생활 인프라 우수", "편의점 도보 2분"],
        images: [
          {
            imageUrl: "/images/dummy-property-img.webp",
            sortOrder: 1,
            isMain: true,
          },
        ],
        hasProperty3D: false,
        property3D: null,
        standardInfra: [
          {
            name: "인근 편의점",
            category: "CONVENIENCE_STORE",
            roadAddress: "서울 종로구 성균관로 ...",
            location: {
              latitude: 37.5899,
              longitude: 126.9944,
            },
            transportMode: "WALK",
            routeJson: {
              totalTime: 2,
              totalDistance: 150,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 2,
                  distance: 150,
                },
              ],
            },
          },
        ],
        runtimeInfra: [],
        keyPlaceRoutes: [
          {
            userPlaceId: 3,
            placeName: "성균관대 정문",
            placeType: "UNIVERSITY",
            transportMode: "WALK",
            routeJson: {
              totalTime: 11,
              totalDistance: 850,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 11,
                  distance: 850,
                },
              ],
            },
          },
        ],
      },
      createdAt: "2026-04-09T10:00:00",
      updatedAt: "2026-04-09T10:00:00",
    },
    {
      favoriteId: 12,
      propertyId: 101,
      snapshot: {
        propertyId: 101,
        title: "혜화역 도보권 햇살 원룸",
        roadAddress: "서울 종로구 명륜4가 ...",
        location: {
          latitude: 37.5826,
          longitude: 127.0012,
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
          "학교까지 도보 12분",
          "헬스장 도보 4분",
          "음식점 도보 6분",
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
            name: "피트니스 혜화점",
            category: "GYM",
            roadAddress: "서울 종로구 대학로 ...",
            location: {
              latitude: 37.583,
              longitude: 127.0017,
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
            name: "BHC 혜화대학로점",
            category: "FOOD",
            roadAddress: "서울 종로구 대학로 ...",
            location: {
              latitude: 37.5821,
              longitude: 127.0005,
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
            placeName: "성균관대학교 인문사회과학캠퍼스",
            placeType: "UNIVERSITY",
            transportMode: "WALK",
            routeJson: {
              totalTime: 12,
              totalDistance: 900,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 12,
                  distance: 900,
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
        title: "명륜동 조용한 풀옵션 원룸",
        roadAddress: "서울 종로구 명륜2가 ...",
        location: {
          latitude: 37.5862,
          longitude: 126.9988,
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
          "학교까지 도보 8분",
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
            name: "CU 명륜성대점",
            category: "CONVENIENCE_STORE",
            roadAddress: "서울 종로구 명륜길 ...",
            location: {
              latitude: 37.5865,
              longitude: 126.9993,
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
            name: "메가커피 혜화역점",
            category: "CAFE",
            roadAddress: "서울 종로구 대학로 ...",
            location: {
              latitude: 37.5848,
              longitude: 127.0002,
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
            placeName: "성균관대학교 인문사회과학캠퍼스",
            placeType: "UNIVERSITY",
            transportMode: "WALK",
            routeJson: {
              totalTime: 8,
              totalDistance: 650,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 8,
                  distance: 650,
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
        title: "성대 정문 가까운 깔끔한 분리형 원룸",
        roadAddress: "서울 종로구 명륜3가 ...",
        location: {
          latitude: 37.5891,
          longitude: 126.9956,
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
          "학교까지 도보 5분",
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
            name: "성대입구 버스정류장",
            category: "BUS_STOP",
            roadAddress: "서울 종로구 성균관로 ...",
            location: {
              latitude: 37.5886,
              longitude: 126.9961,
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
            name: "GS25 성대입구점",
            category: "CONVENIENCE_STORE",
            roadAddress: "서울 종로구 성균관로 ...",
            location: {
              latitude: 37.5882,
              longitude: 126.995,
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
            placeName: "성균관대학교 인문사회과학캠퍼스",
            placeType: "UNIVERSITY",
            transportMode: "WALK",
            routeJson: {
              totalTime: 5,
              totalDistance: 380,
              payment: 0,
              pathList: [
                {
                  type: "WALK",
                  time: 5,
                  distance: 380,
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
