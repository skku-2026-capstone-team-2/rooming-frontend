/**
 * AI 추천 검색 흐름의 입력/상태를 sessionStorage로 관리한다.
 *
 * - AI 검색 입력(query) + 선호 조건(preferences) + topN을 `RecommendationRequest` 형태로 보관한다.
 * - "검색 완료" 플래그로 지도 화면이 추천 결과를 노출할지 제어한다.
 * - 화면 이동/새로고침 후에도 동일 요청을 복원해 React Query 캐시를 공유한다.
 *
 * preferences의 실제 소스(온보딩 선호 조건)는 #20에서 채워질 예정이며,
 * 여기서는 저장/복원 경로만 제공한다.
 */

import type { RecommendationRequest } from "../types";

const QUERY_KEY = "rooming_ai_search_query";
const PREFERENCES_KEY = "rooming_ai_search_preferences";
const TOP_N_KEY = "rooming_ai_search_topn";
const COMPLETED_KEY = "rooming_ai_search_completed";

/** OpenAPI 제한: topN 1~5, 기본 3. */
export const MIN_TOP_N = 1;
export const MAX_TOP_N = 5;
export const DEFAULT_TOP_N = 3;

/** topN을 OpenAPI 허용 범위(1~5)로 정규화한다. */
export function clampTopN(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_TOP_N;
  return Math.min(MAX_TOP_N, Math.max(MIN_TOP_N, Math.floor(value)));
}

/** 저장된 선호 조건(preferences) 배열을 읽는다. (#20에서 채움) */
export function loadSearchPreferences(): string[] {
  try {
    const raw = sessionStorage.getItem(PREFERENCES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** 선호 조건(preferences)을 저장한다. */
export function saveSearchPreferences(preferences: string[]): void {
  sessionStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

/** AI 검색 요청을 저장한다. */
export function saveSearchRequest(request: RecommendationRequest): void {
  sessionStorage.setItem(QUERY_KEY, request.query);
  saveSearchPreferences(request.preferences ?? []);
  sessionStorage.setItem(TOP_N_KEY, String(clampTopN(request.topN ?? DEFAULT_TOP_N)));
}

/** 저장된 AI 검색 요청을 복원한다. 입력이 없으면 null. */
export function loadSearchRequest(): RecommendationRequest | null {
  const query = sessionStorage.getItem(QUERY_KEY);
  if (!query) return null;

  return {
    query,
    preferences: loadSearchPreferences(),
    topN: clampTopN(Number(sessionStorage.getItem(TOP_N_KEY))),
  };
}

/** "검색 완료"(추천 결과 화면을 거쳐 지도에 노출 가능) 플래그를 설정한다. */
export function setSearchCompleted(completed: boolean): void {
  sessionStorage.setItem(COMPLETED_KEY, String(completed));
}

/** "검색 완료" 여부. */
export function isSearchCompleted(): boolean {
  return sessionStorage.getItem(COMPLETED_KEY) === "true";
}
