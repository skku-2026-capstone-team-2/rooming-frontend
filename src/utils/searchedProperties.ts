/**
 * 현재 세션에서 검색된 추천 매물들을 누적 보관한다.
 *
 * - 사용자가 여러 번 검색해도 이번 세션 동안 본 매물들을 모두 유지한다.
 * - `propertyId` 기준으로 중복은 한 번만 표시하며, 재등장 시 최신 데이터로 갱신한다
 *   (찜 상태/추천 이유 등 변동 반영). 노출 순서는 처음 등장한 순서를 유지한다.
 * - `useSyncExternalStore`로 구독하면 누적 변경이 화면에 반응형으로 반영된다.
 * - 세션 스토리지를 단일 출처로 사용하므로 새로고침/화면 이동 후에도 복원된다.
 */

import { useSyncExternalStore } from "react";
import type { PropertyCardView } from "../types";

const STORAGE_KEY = "rooming_searched_properties";

const EMPTY: PropertyCardView[] = [];

// 동일 raw 문자열이면 같은 배열 참조를 돌려줘 useSyncExternalStore 무한 렌더를 막는다.
let cachedRaw: string | null = null;
let cachedList: PropertyCardView[] = EMPTY;

function read(): PropertyCardView[] {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedList;
  }

  if (!raw) {
    cachedRaw = null;
    cachedList = EMPTY;
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedList;

  try {
    const parsed = JSON.parse(raw);
    cachedList = Array.isArray(parsed) ? (parsed as PropertyCardView[]) : EMPTY;
    cachedRaw = raw;
    return cachedList;
  } catch {
    return EMPTY;
  }
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

/** 누적된 검색 매물 목록을 읽는다. */
export function loadSearchedProperties(): PropertyCardView[] {
  return read();
}

/**
 * 검색 결과 매물을 누적 목록에 병합한다.
 * 최신 검색 결과를 위로 올린다(이미 본 매물도 재등장 시 최신 데이터로 갱신하며 위로 이동).
 * 변경이 없으면 쓰기/알림을 생략해 불필요한 재렌더를 막는다.
 */
export function addSearchedProperties(incoming: PropertyCardView[]): void {
  if (incoming.length === 0) return;

  const current = read();
  const byId = new Map<number, PropertyCardView>();
  const order: number[] = [];
  // 최신 검색 결과를 먼저 배치한다(검색 내 추천 순위 유지).
  for (const property of incoming) {
    if (!byId.has(property.propertyId)) order.push(property.propertyId);
    byId.set(property.propertyId, property);
  }
  // 이전에 본 매물은 그 아래에 기존 순서대로 이어 붙인다.
  for (const property of current) {
    if (!byId.has(property.propertyId)) {
      order.push(property.propertyId);
      byId.set(property.propertyId, property);
    }
  }

  const merged = order.map((id) => byId.get(id)!);
  const rawNext = JSON.stringify(merged);
  if (rawNext === cachedRaw) return; // 변화 없음

  try {
    sessionStorage.setItem(STORAGE_KEY, rawNext);
  } catch {
    // 저장 실패(용량/프라이빗 모드)는 무시하고 메모리 캐시만 갱신한다.
  }
  cachedRaw = rawNext;
  cachedList = merged;
  emit();
}

/** 누적된 검색 매물을 비운다. */
export function clearSearchedProperties(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  cachedRaw = null;
  cachedList = EMPTY;
  emit();
}

/** 누적된 검색 매물 목록을 반응형으로 구독한다. */
export function useSearchedProperties(): PropertyCardView[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
