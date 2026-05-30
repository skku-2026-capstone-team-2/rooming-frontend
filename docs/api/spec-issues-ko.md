# API 명세 수정 요청서 (백엔드 협의용)

> 최종 정리: 2026-05-30
> 기준 문서: [openapi.yaml](./openapi.yaml) · [type-mapping-ko.md](./type-mapping-ko.md)
> 범위: 프론트 mock 연동(#16~#24) 과정에서 발견한 **API 명세 자체의 누락/불일치**. 실서버 연결(#25~#31) 전에 백엔드와 합의가 필요한 항목.
> 우선순위: 🔴 시급(데모 화면이 깨짐) · 🟡 중요(기능/문구 결정 필요) · 🟢 정리(통일 권장)

## 한눈에 보기

| 우선 | # | 항목 | 대상 | 핵심 요청 |
|:---:|:---:|------|------|-----------|
| 🔴 | 1 | 추천 응답에 매물 식별정보 없음 | `RecommendationPropertyDetails` | `title`·주소·`areaM2`·`has3DModel`·썸네일 추가 |
| 🔴 | 2 | 경로 응답에 목적지 이름·좌표 없음 | `RecommendationTargetPlaceRoute`, `RecommendationRouteDetailData` | `targetPlaceName`·`targetPlaceLocation` 추가 |
| 🟡 | 3 | 매칭 점수 필드 부재 | `RecommendationResult` | `matchScore` 추가 or 프론트 "매칭률" 문구 제거 |
| 🟡 | 4 | 첫 목적지 경로만 제공 | `RecommendationResult` | 다목적지 비교 필요 시 `targetPlaceRoutes` 배열화 |
| 🟢 | 5 | 생성↔조회 API 필드명 불일치 | `BrokerPropertyData` ↔ `Property` | 필드명 통일 |
| 🟢 | 6 | `availableFrom` 저장 안 됨 | `BrokerPropertyCreateRequest` | 저장/반환 or 요청 필드 제거 |
| 🟢 | 7 | 인프라 category enum (FE 흡수 완료) | `RecommendationInfrastructureDetails` | 실연동 시 실제 전송 값 재확인만 |

---

# 🔴 시급

## 1. 추천 응답에 매물 식별정보(제목·주소·면적·이미지)가 없음 — 최우선

`RecommendationResult.property`([`RecommendationPropertyDetails`](./openapi.yaml#L1744-L1778))에 매물을 식별·표시할 정보가 통째로 빠져 있다.

- **있는 필드:** `location`, `tradeType`, `depositAmount`, `monthlyRent`, `maintenanceFee`, `description`, `tags`
- **없는 필드:** `title`, `roadAddress`/`address`, `areaM2`, `roomType`, `floorInfo`, `has3DModel`, 이미지(thumbnail)

### 영향 — 추천 기반 모든 화면이 깨짐
이 스키마는 **세 군데**에서 동일하게 쓰인다:
- `POST /recommendations` (AI 추천 결과)
- `GET /recommendations` (추천 목록)
- `GET /recommendations/favorites` (MY/찜 목록)

프론트는 빠진 필드를 합성/공백 처리할 수밖에 없다 ([recommendationMapper.ts](../../src/api/mappers/recommendationMapper.ts) `mapRecommendationToCardView`):

| 필드 | 현재 표시 |
|------|-----------|
| `title` | `"추천 매물 #101"` (ID로 합성) |
| `address` | `""` (빈 문자열) |
| `areaLabel` | `"면적 정보 없음"` |
| `imageUrl` | `null` (썸네일 없음) |
| `has3DModel` | `false` (무조건 하드코딩) |

→ AI 추천 결과 화면, 지도 추천/MY 목록, 인프라 화면 매물 카드 모두 **"추천 매물 #ID"** 로 뜨고 주소·면적·썸네일이 비어 보인다.

### 수정 제안
`RecommendationPropertyDetails`에 최소 추가: `title`, `roadAddress`(또는 `address`), `areaM2`, `floorInfo`, `roomType`, `has3DModel`, `thumbnailUrl`(또는 `imageUrls`).

- 대안(비권장): 프론트가 `propertyId`로 `GET /properties/{id}`를 N번 추가 호출 → 비효율적이고 "추천 시점 스냅샷"이라는 의미와 어긋남.

---

## 2. 경로 응답에 목적지(target place) 이름·좌표가 없음

추천 경로는 `targetPlaceId`만 주고 목적지의 **이름과 좌표**가 없다.

- `RecommendationTargetPlaceRoute`([openapi.yaml#L1780-L1802](./openapi.yaml#L1780-L1802)): `targetPlaceId`, `transportMode`, `durationMinutes`, `transferCount`, `subPaths`
- `RecommendationRouteDetailData`([openapi.yaml#L1863-L1889](./openapi.yaml#L1863-L1889)): `targetPlaceId`만 있고 목적지 name/location 없음

### 영향 (#21 인프라/경로 구현)
- "○○까지 N분" 라벨의 목적지 이름을 표시할 수 없어 **`SCHOOL_PLACE`로 하드코딩** ([InfraViewScreen.tsx](../../src/pages/InfraViewScreen.tsx)).
- geometry 누락 시 fallback 직선을 그릴 목적지 좌표가 없어 **하드코딩 좌표(성균관대 정문)** 사용 → 다른 목적지(직장/집)면 엉뚱한 곳으로 선이 그려진다.
- `subPaths[].endName`으로 일부 유추 가능하나 보장되지 않음.

### 수정 제안 (택1)
1. **(권장)** `RecommendationTargetPlaceRoute` / `RecommendationRouteDetailData`에 `targetPlaceName` + `targetPlaceLocation`(`CoordinateDto`) 추가.
2. 프론트가 `GET /user/seeker/target-place` 목록을 받아 `targetPlaceId`로 join → 추가 호출 + 추천 스냅샷과 시점 불일치 가능.

---

# 🟡 중요 (기능/문구 결정 필요)

## 3. 매칭 점수(`matchScore`) 필드 부재

- 더미에 있던 `snapshot.matchScore`가 OpenAPI에 없음 ([type-mapping-ko.md#L34](./type-mapping-ko.md#L34)).
- 추천 결과 화면 문구는 "매칭률이 높은 매물"이라 안내하지만 표시할 점수 데이터가 없다.
- **결정 필요:** 매칭률 UI 유지 → `RecommendationResult`에 `matchScore` 추가 요청 / 미사용 → 프론트 "매칭률" 표현 제거.

## 4. `firstTargetPlaceRoute` — 첫 목적지 경로만 제공

- seeker가 여러 target place(학교/직장/집)를 등록해도 추천 결과는 **첫 목적지 1건의 경로**만 내려준다([openapi.yaml#L1731-L1734](./openapi.yaml#L1731-L1734)).
- 현재 화면은 단일 목적지만 쓰므로 당장은 문제없음. 다목적지 통학/통근 비교 UI가 필요해지면 한계.
- **결정 필요:** 다목적지 경로 비교를 제품에 넣을지. 넣는다면 `targetPlaceRoutes`(배열)로 확장 요청.

---

# 🟢 정리 (통일 권장 · 데모 영향 적음)

## 5. 생성 API ↔ 조회 API 필드명 불일치

같은 개념인데 엔드포인트마다 이름이 다르다.

| 개념 | 생성(`BrokerPropertyData`) | 조회(`Property`/`PropertyDetail`) |
|------|----------------------------|-----------------------------------|
| 보증금 | `depositAmount` | `deposit` |
| 방 구조 | `propertyType` | `roomType` |
| 주소 | `roadAddress` | `address` |
| 3D 보유 | `hasProperty3D` | `has3DModel` |

- 프론트 매퍼에서 흡수 가능하나 **명세 통일** 시 혼란이 준다. 협의 권장.

## 6. `availableFrom` 저장 안 됨

- `BrokerPropertyCreateRequest.availableFrom`은 요청 본문으로 받지만 백엔드가 별도 필드로 저장하지 않음 ([openapi.yaml#L1190-L1194](./openapi.yaml#L1190-L1194)).
- 입주 가능일을 화면에서 쓸 계획이면 저장/반환 필드 필요. 안 쓸 거면 요청 필드에서 제거.

## 7. 인프라 category enum — 프론트 흡수 완료, 실연동 재확인만

- 더미 값(`CONVENIENCE_STORE`, `FOOD`, `BUS_STOP` 등)이 OpenAPI enum 12종(`CONVENIENT_STORE`, `MART`, `PHARMACY`, `HOSPITAL`, `LAUNDRY`, `CAFE`, `SUBWAY`, `BANK`, `GYM`, `KARAOKE`, `PC_ROOM`, `ETC`)과 불일치했음 ([type-mapping-ko.md#L48-L49](./type-mapping-ko.md#L48-L49)).
- **(#21 반영)** 인프라 화면이 OpenAPI enum을 직접 소비하도록 전환 완료([InfraViewScreen.tsx](../../src/pages/InfraViewScreen.tsx) `MARKER_TYPE_BY_CATEGORY`). 명세 변경 불필요.
- 실연동(#28) 시 백엔드가 실제로 보내는 값(특히 `SUBWAY`/`ETC` 빈도)만 재확인.

---

## 참고: 명세 문제가 아님 (프론트 미구현 — 혼동 방지용)

- 추천 favorite 토글: `POST/DELETE /recommendations/{id}/favorite` 명세는 정상. 읽기 경로는 `useFavorites()`로 전환됨(#24). 결과 화면 토글 mutation 실연동·에러 롤백은 #30.
- 전체 실서버 연결(#25~#31) 진행 예정.
