/**
 * 매물 API.
 *
 * VITE_USE_MOCK=false 이면 실제 서버, 그 외엔 mock 어댑터를 사용한다.
 *
 * endpoints:
 *   GET  /api/v1/properties
 *   GET  /api/v1/properties/{id}
 *   GET  /api/v1/properties/{id}/images
 *   GET  /api/v1/properties/{id}/3d
 */

import type {
  Property,
  PropertyDetail,
  PropertyImagesData,
  Property3D,
} from "../types";
import { USE_MOCK } from "./config";
import { request } from "./http";
import { propertyMock } from "./mock/propertyMock";

export const propertyApi = {
  getProperties(): Promise<Property[]> {
    if (USE_MOCK) return propertyMock.getProperties();
    return request<Property[]>("/api/v1/properties");
  },

  getProperty(id: number): Promise<PropertyDetail> {
    if (USE_MOCK) return propertyMock.getProperty(id);
    return request<PropertyDetail>(`/api/v1/properties/${id}`);
  },

  getPropertyImages(id: number): Promise<PropertyImagesData> {
    if (USE_MOCK) return propertyMock.getPropertyImages(id);
    return request<PropertyImagesData>(`/api/v1/properties/${id}/images`);
  },

  getProperty3D(id: number): Promise<Property3D> {
    if (USE_MOCK) return propertyMock.getProperty3D(id);
    return request<Property3D>(`/api/v1/properties/${id}/3d`);
  },
};
