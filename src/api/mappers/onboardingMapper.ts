/**
 * 온보딩 입력 → target-place / recommendation 요청 payload 변환 mapper. (이슈 #20)
 *
 * - 온보딩에서 등록한 주요 장소는 `TargetPlaceCreateRequest`/`TargetPlaceUpdateRequest`
 *   형태로 변환되어 target-place API(`POST/PUT .../target-place`)로 전달된다.
 * - 선호 조건은 `RecommendationRequest.preferences`(문자열 배열)로 변환되어
 *   추천 검색 흐름(`POST /api/v1/recommendations`)에서 활용된다.
 * - 화면(OnboardingScreen)은 enum/payload 형태를 직접 다루지 않고 이 mapper만 의존한다.
 */

import type {
  CoordinateDto,
  PlaceCategory,
  TargetPlaceCreateRequest,
  TargetPlaceUpdateRequest,
} from "../../types";

/**
 * 온보딩에서 등록하는 주요 장소 한 건의 화면 상태(draft).
 *
 * - `category`는 API의 `PlaceCategory` enum을 그대로 사용한다.
 *   (`SCHOOL`, `WORK_PLACE`, `HOME`, `SUBWAY_STATION`, `BUS_TERMINAL`, `ETC`)
 * - 주소(`roadAddress`)·위경도(`location`)·메모(`memo`)는 장소 검색 결과에서 채운다.
 */
export interface OnboardingPlaceDraft {
  category: PlaceCategory;
  placeName: string;
  roadAddress: string;
  location: CoordinateDto;
  memo: string;
}

/** 장소 타입(`PlaceCategory`) 화면 표시용 한글 라벨. */
export const PLACE_CATEGORY_LABELS: Record<PlaceCategory, string> = {
  SCHOOL: "학교 건물",
  WORK_PLACE: "직장/아르바이트",
  HOME: "본가",
  SUBWAY_STATION: "지하철역",
  BUS_TERMINAL: "버스 터미널",
  ETC: "기타",
};

/** 온보딩에서 필수로 등록해야 하는 장소 타입(학교 건물). */
export const REQUIRED_PLACE_CATEGORY: PlaceCategory = "SCHOOL";

/** 빈 문자열/공백만 있는 메모는 null로 정규화한다. */
function normalizeMemo(memo: string | null | undefined): string | null {
  const trimmed = memo?.trim() ?? "";
  return trimmed ? trimmed : null;
}

/**
 * 온보딩 장소 입력 → `POST /api/v1/user/seeker/target-place` 요청 payload.
 *
 * `category`와 `placeType`은 동일 값이다(`placeType`은 `category`의 JSON alias).
 */
export function toTargetPlaceCreateRequest(
  draft: OnboardingPlaceDraft
): TargetPlaceCreateRequest {
  return {
    category: draft.category,
    placeType: draft.category,
    placeName: draft.placeName,
    roadAddress: draft.roadAddress,
    location: draft.location,
    memo: normalizeMemo(draft.memo),
  };
}

/**
 * 온보딩 장소 입력(부분) → `PUT .../target-place/{id}` 부분 수정 payload.
 *
 * `undefined` 필드는 그대로 두어 "변경하지 않음"을 의미하게 한다.
 */
export function toTargetPlaceUpdateRequest(
  draft: Partial<OnboardingPlaceDraft>
): TargetPlaceUpdateRequest {
  const body: TargetPlaceUpdateRequest = {};

  if (draft.category !== undefined) {
    body.category = draft.category;
    body.placeType = draft.category;
  }
  if (draft.placeName !== undefined) body.placeName = draft.placeName;
  if (draft.roadAddress !== undefined) body.roadAddress = draft.roadAddress;
  if (draft.location !== undefined) body.location = draft.location;
  if (draft.memo !== undefined) body.memo = normalizeMemo(draft.memo);

  return body;
}

/**
 * 선택된 선호 조건 라벨 → `RecommendationRequest.preferences` 문자열 배열.
 *
 * 공백 제거 후 빈 항목/중복을 제거한다. 선택이 없으면 빈 배열을 반환한다.
 */
export function toRecommendationPreferences(
  selected: Iterable<string>
): string[] {
  const seen = new Set<string>();
  for (const raw of selected) {
    const trimmed = raw.trim();
    if (trimmed) seen.add(trimmed);
  }
  return Array.from(seen);
}
