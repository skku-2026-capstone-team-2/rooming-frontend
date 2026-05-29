/**
 * 공통 HTTP 클라이언트.
 *
 * - base URL 결합, 쿼리 직렬화, JSON 처리, 인증 credential 부착, 에러 변환.
 * - OpenAPI 응답은 ApiResponse<T> 래퍼이므로 request<T>() 는 data 를 벗겨 반환한다.
 *
 * 인증 전환 지점:
 *   - Bearer 토큰: setAccessToken() 으로 주입 → Authorization 헤더로 전송
 *   - ROOMING_ACCESS_TOKEN 쿠키: credentials:"include" 로 자동 전송
 */

import type { ApiResponse, ErrorResponse } from "../types";
import { API_BASE_URL } from "./config";

/* ---------- Bearer 토큰 보관소 ---------- */

let _accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

/* ---------- 에러 ---------- */

export class ApiError extends Error {
  readonly status: number;
  readonly body: ErrorResponse | null;

  constructor(status: number, message: string, body: ErrorResponse | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/* ---------- 요청 ---------- */

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const base = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return base;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== null && v !== undefined) params.append(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, query, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (_accessToken) headers.Authorization = `Bearer ${_accessToken}`;

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    credentials: "include", // ROOMING_ACCESS_TOKEN 쿠키 전송
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) {
    let errorBody: ErrorResponse | null = null;
    try {
      errorBody = (await res.json()) as ErrorResponse;
    } catch {
      errorBody = null;
    }
    throw new ApiError(
      res.status,
      errorBody?.message ?? `API 요청 실패 (${res.status})`,
      errorBody
    );
  }

  if (res.status === 204) return null as T;

  const wrapper = (await res.json()) as ApiResponse<T>;
  return wrapper.data;
}
