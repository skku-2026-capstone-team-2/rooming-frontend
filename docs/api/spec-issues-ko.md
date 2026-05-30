# API 명세 수정 요청서 (백엔드 협의용)

> 최종 정리: 2026-05-30
> 기준 문서: [openapi.yaml](./openapi.yaml) · [type-mapping-ko.md](./type-mapping-ko.md)
> 범위: 프론트 mock 연동(#16~#24) 과정에서 발견한 **OpenAPI 명세 자체의 누락/불일치**.
> 우선순위: 🟡 중요(기능/문구 결정 필요) · 🟢 정리(통일 권장)
>
> **참고:** 추천 응답의 매물 표시정보·목적지 정보 누락은 백엔드 변경 없이 **프론트 join으로 해결**하기로 결정 → [§프론트에서 해결](#프론트에서-해결-백엔드-변경-불필요) 참고. 현재 백엔드에 **필수(🔴)로 요청할 항목은 없음.**

## 한눈에 보기 (백엔드 요청 항목)

| 우선 | # | 항목 | 대상 | 핵심 요청 |
|:---:|:---:|------|------|-----------|
| 🟡 | 1 | 매칭 점수 부재 | `RecommendationResult` | `matchScore` 추가 or 프론트 "매칭률" 문구 제거 |
| 🟡 | 2 | 첫 목적지 경로만 제공 | `RecommendationResult` | 다목적지 비교 필요 시 `targetPlaceRoutes` 배열화 |
| 🟢 | 3 | 생성↔조회 API 필드명 불일치 | `BrokerPropertyData` ↔ `Property` | 필드명 통일 |
| 🟢 | 4 | `availableFrom` 저장 안 됨 | `BrokerPropertyCreateRequest` | 저장/반환 or 요청 필드 제거 |

---

# 🟡 중요 (기능/문구 결정 필요)

## 1. 매칭 점수(`matchScore`) 필드 부재

- 더미에 있던 `snapshot.matchScore`가 OpenAPI에 없음 ([type-mapping-ko.md#L34](./type-mapping-ko.md#L34)).
- 추천 결과 화면 문구는 "매칭률이 높은 매물"이라 안내하지만 표시할 점수 데이터가 없다.
- **결정 필요:** 매칭률 UI 유지 → `RecommendationResult`에 `matchScore` 추가 요청 / 미사용 → 프론트 "매칭률" 표현 제거.
- (매칭 점수는 AI 서버가 산출하는 값이라 프론트 join으로 만들 수 없음 → 백엔드 결정 필요.)

## 2. `firstTargetPlaceRoute` — 첫 목적지 경로만 제공

- seeker가 여러 target place(학교/직장/집)를 등록해도 추천 결과는 **첫 목적지 1건의 경로**만 내려준다([openapi.yaml#L1731-L1734](./openapi.yaml#L1731-L1734)).
- 현재 화면은 단일 목적지만 쓰므로 당장은 문제없음. 다목적지 통학/통근 비교 UI가 필요해지면 한계.
- **결정 필요:** 다목적지 경로 비교를 제품에 넣을지. 넣는다면 `targetPlaceRoutes`(배열)로 확장 요청. (경로 계산은 백엔드 라우팅이 필요해 프론트 join 불가.)

---

# 🟢 정리 (통일 권장 · 데모 영향 적음)

## 3. 생성 API ↔ 조회 API 필드명 불일치

같은 개념인데 엔드포인트마다 이름이 다르다.

| 개념 | 생성(`BrokerPropertyData`) | 조회(`Property`/`PropertyDetail`) |
|------|----------------------------|-----------------------------------|
| 보증금 | `depositAmount` | `deposit` |
| 방 구조 | `propertyType` | `roomType` |
| 주소 | `roadAddress` | `address` |
| 3D 보유 | `hasProperty3D` | `has3DModel` |

- 프론트 매퍼에서 흡수 가능하나 **명세 통일** 시 혼란이 준다. 협의 권장.

## 4. `availableFrom` 저장 안 됨

- `BrokerPropertyCreateRequest.availableFrom`은 요청 본문으로 받지만 백엔드가 별도 필드로 저장하지 않음 ([openapi.yaml#L1190-L1194](./openapi.yaml#L1190-L1194)).
- 입주 가능일을 화면에서 쓸 계획이면 저장/반환 필드 필요. 안 쓸 거면 요청 필드에서 제거.

---

## 프론트에서 해결 (백엔드 변경 불필요)

아래는 명세에 누락은 있으나 **기존 엔드포인트 join으로 프론트가 해결**한다. 백엔드 요청 항목 아님.

### A. 추천 매물 표시정보 (제목·주소·면적·이미지·has3DModel)
- `RecommendationResult.property`([`RecommendationPropertyDetails`](./openapi.yaml#L1744-L1778))에는 `location`/`tradeType`/가격/`description`/`tags`만 있고 `title`·주소·`areaM2`·`roomType`·`floorInfo`·`has3DModel`·이미지가 없음.
- 하지만 `RecommendationResult.propertyId`가 있으므로 **`GET /api/v1/properties` 목록을 1회 받아 `propertyId`로 index 후 매핑**하면 누락 필드(제목·주소·`areaM2`·`has3DModel`·`imageUrls` 등)가 전부 채워진다. (목록 응답 `Property`에 해당 필드 모두 포함)
- 구현: 실제 Property/Recommendation API 연동(#26/#27)에서 처리.
- 트레이드오프(참고): live property를 join하므로 매물이 수정/삭제되면 추천 카드 표시가 바뀜. "추천 시점 스냅샷"을 엄격히 보존하려면 백엔드가 추천 응답에 표시 필드를 denormalize하는 편이 견고하나, 데모 범위에선 join으로 충분 → 백엔드 필수 요청에서 제외.

### B. 목적지(target place) 이름·좌표
- 경로 응답(`RecommendationTargetPlaceRoute`, `RecommendationRouteDetailData`)은 `targetPlaceId`만 주고 목적지 name/location이 없음.
- **`GET /api/v1/user/seeker/target-place` 목록을 `targetPlaceId`로 join**하면 `placeName`·`location` 확보 가능 → "○○까지 N분" 라벨/경로 fallback의 하드코딩 제거 가능.
- 구현: 실제 Recommendation Infra/Route 연동(#28)에서 처리.

### C. 인프라 category enum
- 더미 값과 OpenAPI enum 12종 불일치가 있었으나, 인프라 화면이 OpenAPI enum을 직접 소비하도록 전환 완료(#21, [InfraViewScreen.tsx](../../src/pages/InfraViewScreen.tsx) `MARKER_TYPE_BY_CATEGORY`). 명세 변경 불필요. 실연동(#28) 시 실제 전송 값만 재확인.

---

## 참고: 명세 문제가 아님 (프론트 미구현 — 혼동 방지용)

- 추천 favorite 토글: `POST/DELETE /recommendations/{id}/favorite` 명세는 정상. 읽기 경로는 `useFavorites()`로 전환됨(#24). 결과 화면 토글 mutation 실연동·에러 롤백은 #30.
- 전체 실서버 연결(#25~#31) 진행 예정. 공통 확인: 인증(`Authorization: Bearer` vs `ROOMING_ACCESS_TOKEN` 쿠키), CORS, base URL.
