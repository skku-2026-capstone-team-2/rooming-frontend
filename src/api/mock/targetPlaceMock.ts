import type {
  TargetPlaceResponseItem,
  TargetPlaceListData,
  TargetPlaceCreateRequest,
  TargetPlaceUpdateRequest,
} from "../../types";
import { mockData, mockError } from "./runtime";

let _idSeq = 1;
const mockPlaces: TargetPlaceResponseItem[] = [
  {
    targetPlaceId: 1,
    category: "SCHOOL",
    placeName: "성균관대학교 인문사회과학캠퍼스",
    roadAddress: "서울 종로구 성균관로 25-2",
    location: { latitude: 37.5893, longitude: 126.9952 },
    memo: null,
  },
];

export const targetPlaceMock = {
  getTargetPlaces(): Promise<TargetPlaceListData> {
    return mockData({ targetPlaces: [...mockPlaces] });
  },

  createTargetPlace(body: TargetPlaceCreateRequest): Promise<TargetPlaceResponseItem> {
    const item: TargetPlaceResponseItem = {
      targetPlaceId: ++_idSeq,
      category: body.category,
      placeName: body.placeName,
      roadAddress: body.roadAddress,
      location: body.location,
      memo: body.memo ?? null,
    };
    mockPlaces.push(item);
    return mockData({ ...item });
  },

  updateTargetPlace(
    targetPlaceId: number,
    body: TargetPlaceUpdateRequest
  ): Promise<TargetPlaceResponseItem> {
    const idx = mockPlaces.findIndex((p) => p.targetPlaceId === targetPlaceId);
    if (idx === -1) return mockError(404, `목적지를 찾을 수 없습니다. (id=${targetPlaceId})`);
    const updated: TargetPlaceResponseItem = {
      ...mockPlaces[idx],
      ...(body.category !== undefined && { category: body.category }),
      ...(body.placeName !== undefined && { placeName: body.placeName ?? mockPlaces[idx].placeName }),
      ...(body.roadAddress !== undefined && { roadAddress: body.roadAddress }),
      ...(body.location !== undefined && { location: body.location ?? mockPlaces[idx].location }),
      ...(body.memo !== undefined && { memo: body.memo ?? null }),
    };
    mockPlaces[idx] = updated;
    return mockData({ ...updated });
  },

  deleteTargetPlace(targetPlaceId: number): Promise<null> {
    const idx = mockPlaces.findIndex((p) => p.targetPlaceId === targetPlaceId);
    if (idx === -1) return mockError(404, `목적지를 찾을 수 없습니다. (id=${targetPlaceId})`);
    mockPlaces.splice(idx, 1);
    return mockData(null);
  },
};
