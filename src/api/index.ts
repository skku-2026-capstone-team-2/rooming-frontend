/**
 * API 계층 배럴.
 *
 * 화면/훅에서: import { propertyApi } from "@/api" 형태로 사용.
 * mock ↔ real 전환은 .env 의 VITE_USE_MOCK 값만으로 제어한다.
 */

export { propertyApi } from "./propertyApi";
export { recommendationApi } from "./recommendationApi";
export { targetPlaceApi } from "./targetPlaceApi";
export { authApi } from "./authApi";
export { brokerApi } from "./brokerApi";
export { setAccessToken, getAccessToken, ApiError } from "./http";
export { API_BASE_URL, USE_MOCK } from "./config";
