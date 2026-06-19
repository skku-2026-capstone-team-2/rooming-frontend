/**
 * AI 추천 검색 흐름의 "검색 요청"을 sessionStorage로 관리한다.
 *
 * - AI 검색 입력(query) + 선호 조건(preferences) + topN을 `RecommendationRequest` 형태로
 *   단일 키(`rooming_ai_search`)에 JSON으로 보관한다.
 * - 화면 이동/새로고침 후에도 동일 요청을 복원해 React Query 캐시 키를 공유한다.
 * - `useSearchRequest()`로 구독하면 저장 변경이 화면에 반응형으로 반영된다.
 *
 * "지도에 추천 결과를 노출할지"는 더 이상 여기서 다루지 않고 URL(`/map?view=...`)로 표현한다.
 */

import { useSyncExternalStore } from "react";
import type { RecommendationRequest } from "../types";

const STORAGE_KEY = "rooming_ai_search";

/** OpenAPI 제한: topN 1~5, 기본 3. */
export const MIN_TOP_N = 1;
export const MAX_TOP_N = 5;
export const DEFAULT_TOP_N = 3;

/** topN을 OpenAPI 허용 범위(1~5)로 정규화한다. */
export function clampTopN(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_TOP_N;
  return Math.min(MAX_TOP_N, Math.max(MIN_TOP_N, Math.floor(value)));
}

/* ---------- 외부 스토어(useSyncExternalStore) ---------- */

// 동일 raw 문자열이면 같은 객체 참조를 돌려줘 useSyncExternalStore 무한 렌더를 막는다.
let cachedRaw: string | null = null;
let cachedRequest: RecommendationRequest | null = null;

function readStoredRequest(): RecommendationRequest | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) {
    cachedRaw = null;
    cachedRequest = null;
    return null;
  }
  if (raw === cachedRaw) return cachedRequest;

  try {
    const parsed = JSON.parse(raw) as Partial<RecommendationRequest>;
    const query = typeof parsed.query === "string" ? parsed.query.trim() : "";
    cachedRequest = {
      query,
      preferences: Array.isArray(parsed.preferences)
        ? parsed.preferences.filter((v) => typeof v === "string")
        : [],
      topN: clampTopN(Number(parsed.topN)),
    };
    cachedRaw = raw;
    return cachedRequest;
  } catch {
    return null;
  }
}

function readRequest(): RecommendationRequest | null {
  const request = readStoredRequest();
  return request?.query ? request : null;
}

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // 다른 탭/창에서의 변경도 반영한다.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/* ---------- 읽기/쓰기 API ---------- */

/** 저장된 AI 검색 요청을 복원한다. 입력이 없으면 null. */
export function loadSearchRequest(): RecommendationRequest | null {
  return readRequest();
}

/** 저장된 선호 조건(preferences) 배열을 읽는다. */
export function loadSearchPreferences(): string[] {
  return readStoredRequest()?.preferences ?? [];
}

/** AI 검색 요청을 저장하고 구독자에게 알린다. */
export function saveSearchRequest(request: RecommendationRequest): void {
  const normalized: RecommendationRequest = {
    query: request.query.trim(),
    preferences: request.preferences ?? [],
    topN: clampTopN(request.topN ?? DEFAULT_TOP_N),
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // 저장 실패(용량/프라이빗 모드)는 무시하고 메모리 캐시만 갱신한다.
  }
  cachedRaw = null; // 다음 read에서 재파싱하도록 강제
  emit();
}

/** 저장된 검색 요청을 비운다. */
export function clearSearchRequest(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  cachedRaw = null;
  emit();
}

/** 검색 요청을 반응형으로 구독한다. 저장/삭제 시 자동 갱신된다. */
export function useSearchRequest(): RecommendationRequest | null {
  return useSyncExternalStore(subscribe, readRequest, () => null);
}
