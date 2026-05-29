/**
 * API 계층 환경 설정.
 *
 * 실제 서버 연결 시 전환 지점:
 *   1. .env 에 VITE_API_BASE_URL 지정
 *   2. .env 에 VITE_USE_MOCK=false 지정
 * → 화면/도메인 API 코드는 그대로 두고 env 만 바꾸면 mock ↔ real 전환.
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"
).replace(/\/+$/, "");

/** VITE_USE_MOCK=false 일 때만 실제 API 호출. 기본값은 mock 사용. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
