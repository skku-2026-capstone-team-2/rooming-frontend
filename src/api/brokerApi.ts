/**
 * 중개사 API.
 *
 * endpoints:
 *   GET  /api/v1/broker-offices
 *   POST /api/v1/broker-offices
 *   GET  /api/v1/broker/me/properties
 *   POST /api/v1/user/broker/me/properties
 *   GET  /api/v1/properties/{propertyId}/broker  (담당 중개사 연락처, 실서버 미연동)
 */

import type {
  BrokerOfficeListData,
  BrokerOfficeData,
  BrokerOfficeCreateRequest,
  BrokerPropertyData,
  BrokerPropertyCreateRequest,
  BrokerPropertySummaryData,
  BrokerContact,
} from "../types";
import { USE_MOCK } from "./config";
import { request } from "./http";
import { brokerMock } from "./mock/brokerMock";

export const brokerApi = {
  getOffices(): Promise<BrokerOfficeListData> {
    if (USE_MOCK) return brokerMock.getOffices();
    return request<BrokerOfficeListData>("/api/v1/broker-offices");
  },

  createOffice(body: BrokerOfficeCreateRequest): Promise<BrokerOfficeData> {
    if (USE_MOCK) return brokerMock.createOffice(body);
    return request<BrokerOfficeData>("/api/v1/broker-offices", { method: "POST", body });
  },

  getMyProperties(): Promise<BrokerPropertySummaryData[]> {
    if (USE_MOCK) return brokerMock.getMyProperties();
    return request<BrokerPropertySummaryData[]>("/api/v1/broker/me/properties");
  },

  createProperty(body: BrokerPropertyCreateRequest): Promise<BrokerPropertyData> {
    if (USE_MOCK) return brokerMock.createProperty(body);
    return request<BrokerPropertyData>("/api/v1/user/broker/me/properties", {
      method: "POST",
      body,
    });
  },

  /**
   * 매물 담당 중개사 연락처 조회.
   *
   * TODO(#25~#26): 실서버 엔드포인트가 확정되면 경로를 교체한다. 현재는 mock 전용.
   */
  getBrokerContact(propertyId: number): Promise<BrokerContact> {
    if (USE_MOCK) return brokerMock.getBrokerContact(propertyId);
    return request<BrokerContact>(`/api/v1/properties/${propertyId}/broker`);
  },
};
