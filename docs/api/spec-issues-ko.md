# API 명세 수정 요청 후보 (백엔드 협의용 초안)

> 작성일: 2026-05-30
> 상태: **기록만** — 프론트 실연동을 좀 더 진행한 뒤 백엔드에 일괄 요청 예정.
> 기준 문서: [openapi.yaml](./openapi.yaml) · [type-mapping-ko.md](./type-mapping-ko.md)

현재 프론트는 mock adapter로 동작 중이며, 실서버 연결(#25~#31) 전에 발견된 **API 명세 자체의 누락/불일치**를 정리한다. 우선순위 표기: 🔴 시급 / 🟡 중요 / 🟢 정리.

---

## 1. 🔴 추천 응답에 매물 제목·주소·면적이 없음 (최우선)

`RecommendationResult.property`([`RecommendationPropertyDetails`](./openapi.yaml#L1744-L1778)) 스키마에 매물 식별 정보가 통째로 빠져 있다.

**현재 가진 필드:** `location`, `tradeType`, `depositAmount`, `monthlyRent`, `maintenanceFee`, `description`, `tags`

**없는 필드:** `title`, `roadAddress`/`address`, `areaM2`, `roomType`, `floorInfo`, `has3DModel`, 이미지(thumbnail)

### 영향
- [recommendationMapper.ts:43-60](../../src/api/mappers/recommendationMapper.ts#L43-L60)에서 다음과 같이 합성/공백 처리 중:
  - `title: "추천 매물 #${propertyId}"` ← 실제 제목 없어 ID로 합성
  - `address: ""` ← 빈 문자열
  - `areaLabel: "면적 정보 없음"` ← areaM2 없음
  - `imageUrl: null` ← 썸네일 없음
  - `has3DModel: false` ← 무조건 false 하드코딩
- AI 추천 결과 화면([AIResultScreen.tsx:158](../../src/pages/AIResultScreen.tsx#L158))에 **"추천 매물 #101"** 로 표시되고 주소·면적·썸네일이 비어 보인다.

### 수정 제안
`RecommendationPropertyDetails`에 최소 다음 필드 추가:
`title`, `roadAddress`(또는 `address`), `areaM2`, `floorInfo`, `roomType`, `has3DModel`, `thumbnailUrl`(또는 `imageUrls`)

- 대안(비권장): 프론트가 `propertyId`로 `GET /properties/{id}`를 N번 추가 호출 → 비효율적이고, "추천 시점의 스냅샷"이라는 추천 결과 의미와 어긋남.

---

## 2. 🟡 매칭 점수(`matchScore`) 필드 부재

- 더미에 있던 `snapshot.matchScore`가 OpenAPI에 없음 ([type-mapping-ko.md:34](./type-mapping-ko.md#L34)).
- 추천 결과 헤더 문구는 "매칭률이 높은 매물"이라고 안내하지만, 정작 점수를 표시할 데이터가 없다.
- **결정 필요:** 매칭률 UI를 유지할 거면 `RecommendationResult`에 `matchScore` 추가 요청. 아니면 프론트 문구에서 "매칭률" 표현 제거.

---

## 3. 🟡 인프라 category enum 값 불일치 (프론트 더미 ↔ 명세)

- 더미 값 `CONVENIENCE_STORE`, `FOOD`, `BUS_STOP` 등이 OpenAPI enum(`CONVENIENT_STORE`, `MART`, `PHARMACY`, `HOSPITAL`, `LAUNDRY`, `CAFE`, `SUBWAY`, `BANK`, `GYM`, `KARAOKE`, `PC_ROOM`, `ETC` 12종)과 불일치 ([type-mapping-ko.md:48-49](./type-mapping-ko.md#L48-L49)).
- 명세 문제라기보단 **프론트 매퍼에서 흡수**할 항목(실연동 #28 작업 시). 백엔드 enum이 확정이면 프론트가 맞추면 됨 — 여기 기록만.

---

## 4. 🟢 생성 API ↔ 조회 API 필드명 불일치

같은 개념인데 엔드포인트마다 필드명이 다르다.

| 개념 | 생성(`BrokerPropertyData`) | 조회(`Property`/`PropertyDetail`) |
|------|----------------------------|-----------------------------------|
| 보증금 | `depositAmount` | `deposit` |
| 방 구조 | `propertyType` | `roomType` |
| 주소 | `roadAddress` | `address` |
| 3D 보유 | `hasProperty3D` | `has3DModel` |

- 프론트 매퍼에서 흡수 가능하나, **명세 통일** 시 혼란이 줄어듦. 백엔드 협의 권장.

---

## 5. 🟢 `availableFrom` 저장 안 됨

- `BrokerPropertyCreateRequest.availableFrom`은 요청 본문으로 받지만 "current backend stores no separate field for this value" ([openapi.yaml:1190-1194](./openapi.yaml#L1190-L1194)).
- 입주 가능일을 화면에서 쓸 계획이면 백엔드 저장/반환 필드 필요. 안 쓸 거면 요청 필드에서 제거.

---

## 참고: 명세 문제가 아닌(프론트 미구현) 항목

다음은 명세는 정상이고 프론트 실연동만 남은 것 — 본 문서 범위 밖이나 혼동 방지용 기록:

- 추천 favorite 토글이 현재 로컬 state로만 동작 (`POST/DELETE /recommendations/{id}/favorite` 미연동, #24/#30).
- 전체 실서버 연결 #25~#31 OPEN 상태.
