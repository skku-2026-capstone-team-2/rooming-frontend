/**
 * 인증 / 프로필 API.
 *
 * OAuth entry points 는 서버 redirect 방식이므로 브라우저를 직접 이동시킨다.
 * 프로필 조회/수정은 인증 쿠키(ROOMING_ACCESS_TOKEN) 또는 Bearer 토큰이 필요하다.
 *
 * endpoints:
 *   GET /api/v1/auth/seeker/google      (redirect)
 *   GET /api/v1/auth/broker/google      (redirect)
 *   GET /api/v1/user/seeker/me
 *   GET /api/v1/user/broker/me
 *   PUT /api/v1/user/broker/me/additional-info
 *   PUT /api/v1/user/broker/me/verification-document  (multipart)
 */

import type {
  SeekerProfileData,
  BrokerProfileData,
  BrokerAdditionalInfoRequest,
} from "../types";
import { API_BASE_URL, USE_MOCK } from "./config";
import { request, requestFormData } from "./http";
import { profileMock } from "./mock/profileMock";

export const authApi = {
  /** Seeker Google OAuth 시작. 브라우저를 서버 redirect URL로 이동시킨다. */
  startSeekerGoogleLogin(): void {
    window.location.href = `${API_BASE_URL}/api/v1/auth/seeker/google`;
  },

  /** Broker Google OAuth 시작. */
  startBrokerGoogleLogin(): void {
    window.location.href = `${API_BASE_URL}/api/v1/auth/broker/google`;
  },

  getSeekerProfile(): Promise<SeekerProfileData> {
    if (USE_MOCK) return profileMock.getSeekerProfile();
    return request<SeekerProfileData>("/api/v1/user/seeker/me");
  },

  getBrokerProfile(): Promise<BrokerProfileData> {
    if (USE_MOCK) return profileMock.getBrokerProfile();
    return request<BrokerProfileData>("/api/v1/user/broker/me");
  },

  updateBrokerAdditionalInfo(body: BrokerAdditionalInfoRequest): Promise<BrokerProfileData> {
    if (USE_MOCK) return profileMock.updateBrokerAdditionalInfo(body);
    return request<BrokerProfileData>("/api/v1/user/broker/me/additional-info", {
      method: "PUT",
      body,
    });
  },

  /** 중개사 자격 증빙 서류 업로드(수동 인증용). multipart 필드명은 `verificationDocument`. */
  uploadBrokerVerificationDocument(file: File): Promise<BrokerProfileData> {
    if (USE_MOCK) return profileMock.uploadBrokerVerificationDocument(file);
    const formData = new FormData();
    formData.append("verificationDocument", file);
    return requestFormData<BrokerProfileData>(
      "/api/v1/user/broker/me/verification-document",
      formData,
      { method: "PUT" }
    );
  },
};
