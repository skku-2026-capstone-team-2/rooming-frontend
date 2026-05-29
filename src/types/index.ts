/**
 * 타입 배럴. `import type { Property, PropertyCardView } from "@/types"` 형태로 사용.
 *
 * - `./api`  : OpenAPI 기준 API 응답/요청 타입
 * - `./view` : 화면 렌더링용 view model 타입
 * - `./tmap` : Tmap SDK 전역 선언 (ambient, re-export 불필요)
 */
export type * from "./api";
export type * from "./view";
