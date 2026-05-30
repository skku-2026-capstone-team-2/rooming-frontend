/**
 * 온보딩 입력 상태(draft) 보관 훅. (이슈 #20)
 *
 * ── 상태 유지 범위 ─────────────────────────────────────────────────────────
 *  유지(persist): 등록한 주요 장소 목록(places)과 선택한 선호 조건(preferences).
 *    - 화면 이동(온보딩 ↔ 지도/추천)·새로고침 시에도 sessionStorage에 보존된다.
 *    - 추천 검색 흐름에서 target place와 preferences를 재사용하기 위함이다.
 *  유지 안 함(ephemeral): 검색 키워드·검색 결과·선택 중인 검색 항목·로딩 상태.
 *    - 입력 보조용 일시 상태이므로 화면 컴포넌트의 useState로만 다룬다.
 *  생명주기: 브라우저 탭 세션 단위(sessionStorage). 탭을 닫으면 초기화된다.
 *    온보딩 완료 후 서버 저장이 끝나면 `clear()`로 비운다.
 */

import { useCallback, useEffect, useState } from "react";
import type { OnboardingPlaceDraft } from "../api/mappers/onboardingMapper";

const STORAGE_KEY = "rooming_onboarding_draft";

/** sessionStorage에 직렬화되어 보존되는 온보딩 입력 상태. */
export interface OnboardingDraft {
  places: OnboardingPlaceDraft[];
  preferences: string[];
}

const EMPTY_DRAFT: OnboardingDraft = { places: [], preferences: [] };

function readDraft(): OnboardingDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;

    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    return {
      places: Array.isArray(parsed.places) ? parsed.places : [],
      preferences: Array.isArray(parsed.preferences) ? parsed.preferences : [],
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

/**
 * 온보딩 입력 상태를 sessionStorage와 동기화해 보관한다.
 *
 * @returns draft 값과 places/preferences 갱신·초기화 헬퍼.
 */
export function useOnboardingDraft() {
  const [draft, setDraft] = useState<OnboardingDraft>(readDraft);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // 저장 실패(용량 초과/프라이빗 모드 등)는 무시하고 메모리 상태만 유지한다.
    }
  }, [draft]);

  const setPlaces = useCallback(
    (
      updater:
        | OnboardingPlaceDraft[]
        | ((prev: OnboardingPlaceDraft[]) => OnboardingPlaceDraft[])
    ) => {
      setDraft((prev) => ({
        ...prev,
        places:
          typeof updater === "function" ? updater(prev.places) : updater,
      }));
    },
    []
  );

  const setPreferences = useCallback(
    (updater: string[] | ((prev: string[]) => string[])) => {
      setDraft((prev) => ({
        ...prev,
        preferences:
          typeof updater === "function" ? updater(prev.preferences) : updater,
      }));
    },
    []
  );

  const clear = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    places: draft.places,
    preferences: draft.preferences,
    setPlaces,
    setPreferences,
    clear,
  };
}
