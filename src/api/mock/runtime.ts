/**
 * mock 어댑터 공통 런타임.
 *
 * - 각 도메인 mock 구현이 공유하는 네트워크 지연/응답 래핑/에러 헬퍼.
 * - mock 응답 구조는 OpenAPI `ApiResponse<T>` 형태에 맞춘다.
 */

import type { ApiResponse } from "../../types";
import { ApiError } from "../http";

/** mock 응답 지연(ms). 실제 네트워크 느낌을 위해 살짝 지연시킨다. */
const MOCK_DELAY_MS = 200;

/** 지정 ms 만큼 대기한다. */
export function delay(ms: number = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 값을 OpenAPI 성공 응답(`ApiResponse<T>`) 래퍼로 감싼다. */
export function ok<T>(data: T, message = "성공"): ApiResponse<T> {
  return { success: true, data, message };
}

/** 지연 후 `data`만 반환한다 (도메인 API가 unwrap된 값을 돌려주는 것과 동일). */
export async function mockData<T>(data: T): Promise<T> {
  await delay();
  return data;
}

/** mock에서 not-found 등 에러 상황을 실제 `ApiError`로 흉내 낸다. */
export async function mockError(status: number, message: string): Promise<never> {
  await delay();
  throw new ApiError(status, message, { message, time: "" });
}
