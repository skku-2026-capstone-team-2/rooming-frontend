/**
 * 목적지(target place) API.
 *
 * endpoints:
 *   GET    /api/v1/user/seeker/target-place
 *   POST   /api/v1/user/seeker/target-place
 *   PUT    /api/v1/user/seeker/target-place/{targetPlaceId}
 *   DELETE /api/v1/user/seeker/target-place/{targetPlaceId}
 */

import type {
  TargetPlaceListData,
  TargetPlaceResponseItem,
  TargetPlaceCreateRequest,
  TargetPlaceUpdateRequest,
} from "../types";
import { USE_MOCK } from "./config";
import { request } from "./http";
import { targetPlaceMock } from "./mock/targetPlaceMock";

const BASE = "/api/v1/user/seeker/target-place";

export const targetPlaceApi = {
  getTargetPlaces(): Promise<TargetPlaceListData> {
    if (USE_MOCK) return targetPlaceMock.getTargetPlaces();
    return request<TargetPlaceListData>(BASE);
  },

  createTargetPlace(body: TargetPlaceCreateRequest): Promise<TargetPlaceResponseItem> {
    if (USE_MOCK) return targetPlaceMock.createTargetPlace(body);
    return request<TargetPlaceResponseItem>(BASE, { method: "POST", body });
  },

  updateTargetPlace(
    targetPlaceId: number,
    body: TargetPlaceUpdateRequest
  ): Promise<TargetPlaceResponseItem> {
    if (USE_MOCK) return targetPlaceMock.updateTargetPlace(targetPlaceId, body);
    return request<TargetPlaceResponseItem>(`${BASE}/${targetPlaceId}`, { method: "PUT", body });
  },

  deleteTargetPlace(targetPlaceId: number): Promise<null> {
    if (USE_MOCK) return targetPlaceMock.deleteTargetPlace(targetPlaceId);
    return request<null>(`${BASE}/${targetPlaceId}`, { method: "DELETE" });
  },
};
