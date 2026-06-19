/**
 * 중개사 API.
 *
 * endpoints:
 *   GET  /api/v1/broker-offices
 *   POST /api/v1/broker-offices
 *   GET  /api/v1/broker/me/properties
 *   POST /api/v1/user/broker/me/properties
 */

import type {
  BrokerOfficeListData,
  BrokerOfficeData,
  BrokerOfficeCreateRequest,
  BrokerPropertyData,
  BrokerPropertyCreateRequest,
  BrokerPropertySummaryData,
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
    if (USE_MOCK) return Promise.resolve([]);
    return request<BrokerPropertySummaryData[]>("/api/v1/broker/me/properties");
  },

  createProperty(body: BrokerPropertyCreateRequest): Promise<BrokerPropertyData> {
    if (USE_MOCK) return brokerMock.createProperty(body);
    return request<BrokerPropertyData>("/api/v1/user/broker/me/properties", {
      method: "POST",
      body,
    });
  },
};
