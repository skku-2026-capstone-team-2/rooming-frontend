# 프론트엔드 GitHub 이슈 생성 초안

이 문서는 최종 데모까지의 4주 프론트엔드 구현 계획을 GitHub Issue로 옮기기 위한 초안이다. 각 이슈는 `Title`, `Priority`, `Labels`, `Milestone`, `Body` 형식으로 정리했다.

## 계획 기준

이 문서는 Week #13 진행 보고서 내용을 바탕으로, 최종 데모까지 남은 약 4주 동안 프론트엔드에서 관리해야 할 구현 이슈를 정리한 것이다.

현재 프론트엔드는 midterm 이후 온보딩, 지도, AI 결과, 매물 상세, 인프라 보기, 3D 보기, 관리자 프로토타입까지 주요 화면 흐름을 구현했다. 다만 백엔드 서버가 아직 배포되지 않아 실제 API 연동은 완료되지 않았고, 현재는 mock 데이터와 dummy API 형태로 사용자 흐름을 검증하는 단계이다.

최종 데모에서는 실제 서버와 API를 연결해야 하므로, 앞으로의 작업은 다음 흐름으로 진행한다.

1. OpenAPI 명세 기반 타입/API client 정리
2. mock API 기반으로 화면 구조 리팩토링
3. 백엔드 서버 배포 후 실제 API 연결
4. 최종 데모용 end-to-end QA 및 안정화

## OpenAPI 기준 검토 요약

기준 문서: `docs/api/openapi.yaml`

- 독립 `infraApi`는 현재 명세에 없다. 인프라 목록은 recommendation 응답의 `infrastructures`에 포함되고, 경로 geometry는 `/api/v1/recommendations/{recommendationId}/route`에서 조회한다.
- 독립 `favoriteApi`는 현재 명세에 없다. 찜은 saved recommendation의 favorite 상태이며 `/api/v1/recommendations/favorites`, `/api/v1/recommendations/{recommendationId}/favorite`를 사용한다.
- 독립 `userPreferenceApi`는 현재 명세에 없다. 온보딩 주요 장소는 target-place API로 관리하고, 추천 선호 조건은 `RecommendationRequest.preferences` 문자열 배열로 전달한다.
- 3D API는 독립 도메인이 아니라 property 하위 endpoint이다. 목록 응답에는 `splineUrl`이 있을 수 있지만, `/api/v1/properties/{id}/3d` 응답은 `modelUrl`, `modelType`, `previewImageUrl`을 사용한다.
- 대부분의 실사용 API는 인증을 전제로 한다. API client 작업에는 Bearer token 또는 `ROOMING_ACCESS_TOKEN` 쿠키 기반 credential 처리를 포함해야 한다.

---

## 4주 실행 계획

### Week 13-14. OpenAPI 기반 통합 준비 및 mock API 구조 전환

**목표**

- OpenAPI 문서를 기준으로 프론트엔드 타입과 API client 구조를 정리한다.
- 화면이 직접 dummy data를 import하지 않고 API 함수 계층을 통해 데이터를 받도록 전환한다.
- 실제 서버가 없어도 OpenAPI 응답 형식과 유사한 mock API로 전체 흐름을 검증한다.

**주요 산출물**

- API domain별 TypeScript 타입
- `propertyApi`, `recommendationApi`, `targetPlaceApi`, `auth/profileApi`, `brokerApi`
- OpenAPI 호환 mock response
- loading/error/empty 상태 기본 구조

### Week 15. 실제 서버 API 1차 연결

**목표**

- 백엔드 서버 또는 staging endpoint가 제공되는 즉시 실제 API와 연결한다.
- 매물 목록, 매물 상세, 추천 결과, target-place, recommendation favorite, route geometry, property 3D 등 핵심 API부터 순차적으로 연결한다.
- mock API와 실제 API의 응답 차이를 확인하고 프론트엔드 타입/adapter를 수정한다.

**주요 산출물**

- 환경변수 기반 API base URL 설정
- 실제 property/recommendation API 연결
- API 응답 차이 정리 문서
- 서버 오류/빈 응답에 대한 화면 처리

### Week 16. 최종 데모 안정화 및 end-to-end QA

**목표**

- 실제 서버/API 기반으로 최종 데모 플로우를 완성한다.
- 온보딩 -> AI 검색 -> 추천 결과 -> 지도 -> 매물 상세 -> 인프라 -> 3D 보기 흐름을 실제 데이터로 시연 가능하게 만든다.
- 빌드, lint, 시연 시나리오, fallback UI를 점검한다.

**주요 산출물**

- 최종 데모 시나리오
- 실제 API 기반 시연 가능 상태
- 알려진 제한 사항 정리
- `npm run build` 통과
- 가능한 범위에서 `npm run lint` 오류 제거

---

## 브랜치 네이밍 컨벤션

이슈 작업 브랜치는 다음 형식을 따른다.

```
<type>/<issue-number>-<short-description>
```

예: `feature/9-frontend-polish`

- `type`: 작업 성격을 나타내는 접두사
  - `feature`: 신규 기능 또는 화면/API 연결 작업
  - `fix`: 버그 수정
  - `refactor`: 동작 변경 없는 구조 개선
  - `chore`: 빌드, 설정, 문서 등 기타 작업
- `issue-number`: 연결된 GitHub Issue 번호 (FE-01 같은 문서 번호가 아니라 실제 GitHub Issue 번호)
- `short-description`: 작업 내용을 요약한 영어 kebab-case 문구

**예시**

- `feature/12-recommendation-api`
- `feature/14-property-3d-modelurl`
- `fix/17-lint-errors`
- `refactor/9-search-state-flow`

---

## FE-01

**Title**  
`OpenAPI 스키마 기반 TypeScript 타입 정의`

**Priority**  
`High`

**Labels**  
`frontend`, `openapi`, `type`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

OpenAPI 문서를 기준으로 프론트엔드에서 사용할 API 응답 타입과 화면용 타입을 정의한다.

## 작업 내용

- [ ] OpenAPI 문서에서 property, recommendation, target-place, profile/auth, broker 관련 schema 확인
- [ ] recommendation 응답에 포함된 infrastructure/route/favorite 구조 확인
- [ ] property 하위 images/3D schema 확인
- [ ] API 응답 타입 정의
- [ ] 화면 렌더링용 view model 타입 정의
- [ ] 기존 dummy data 구조와 OpenAPI schema 차이 정리
- [ ] 필드명 또는 누락 필드 정리

## 완료 기준

- [ ] 주요 API 응답 타입이 TypeScript로 정의되어 있다.
- [ ] API 응답 타입과 화면용 타입이 구분되어 있다.
- [ ] OpenAPI와 맞지 않는 필드가 문서화되어 있다.
```

---

## FE-02

**Title**  
`API Client 및 Mock Adapter 구조 생성`

**Priority**  
`High`

**Labels**  
`frontend`, `api`, `mock`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

실제 서버 배포 전에는 mock API로 동작하고, 서버 배포 후에는 실제 API로 전환 가능한 API 계층을 만든다.

## 작업 내용

- [ ] propertyApi 생성: `/api/v1/properties`, `/api/v1/properties/{id}`, `/images`, `/3d`
- [ ] recommendationApi 생성: `/api/v1/recommendations`, `/favorites`, `/{recommendationId}/route`, `/{recommendationId}/favorite`
- [ ] targetPlaceApi 생성: `/api/v1/user/seeker/target-place`
- [ ] auth/profileApi 생성: OAuth entry, seeker/broker profile
- [ ] brokerApi 생성: broker office, broker property create
- [ ] mock adapter 구조 생성
- [ ] `VITE_API_BASE_URL` 기반 base URL 구조 준비
- [ ] Bearer token 또는 `ROOMING_ACCESS_TOKEN` 쿠키 credential 처리 지점 준비
- [ ] mock/real API 전환 방식 정리

## 완료 기준

- [ ] 화면이 직접 dummy data를 import하지 않고 API 함수로 데이터를 가져온다.
- [ ] mock API 응답 구조가 OpenAPI 응답 형태와 맞다.
- [ ] 실제 서버 연결 시 교체해야 할 지점이 명확하다.
```

---

## FE-03

**Title**  
`매물 목록 및 매물 상세 화면 API 구조 연결`

**Priority**  
`High`

**Labels**  
`frontend`, `property`, `api`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

매물 목록과 매물 상세 화면을 OpenAPI 기반 API 함수 응답으로 렌더링하도록 리팩토링한다.

## 작업 내용

- [ ] 지도 화면의 전체 매물 목록을 `GET /api/v1/properties` 기반 property API 함수로 변경
- [ ] `/property/:id` 상세 화면을 property ID 기반 API 응답으로 변경
- [ ] 매물 이미지, 가격, 면적, 위치, 설명 필드 정리
- [ ] 추천 이유는 property 응답이 아니라 recommendation 응답의 `explanation`에서 관리하도록 분리
- [ ] 상세 이미지 조회가 필요한 화면은 `GET /api/v1/properties/{id}/images` 사용 여부 확인
- [ ] 실제 API 연결을 위한 mapper 또는 adapter 준비
- [ ] 존재하지 않는 property ID에 대한 처리 추가

## 완료 기준

- [ ] 매물 목록과 상세 화면이 API 함수 응답으로 동작한다.
- [ ] property ID 오류 또는 데이터 없음 상태가 처리된다.
- [ ] 실제 property API 연결로 전환 가능한 구조이다.
```

---

## FE-04

**Title**  
`AI 추천 검색 흐름 Mock API 연결`

**Priority**  
`High`

**Labels**  
`frontend`, `recommendation`, `ai`, `mock`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

AI 검색 입력부터 추천 결과 화면까지의 흐름을 OpenAPI 형태의 mock recommendation API 기반으로 연결한다.

## 작업 내용

- [ ] AI 검색 입력값을 `RecommendationRequest.query`로 변환
- [ ] 온보딩/필터 조건 중 문자열화 가능한 항목을 `preferences` 배열로 변환
- [ ] `topN`은 OpenAPI 제한값인 1~5 범위로 관리
- [ ] 추천 결과 화면을 `RecommendationResponse.data.results` 기반으로 렌더링
- [ ] 추천 매물, `favorite`, 추천 이유(`explanation`), 인프라(`infrastructures`), 첫 목적지 경로 요약(`firstTargetPlaceRoute`) 구조 정리
- [ ] 추천 결과가 지도 화면의 매물 목록/마커로 이어질 수 있도록 상태 전달 방식 정리
- [ ] 하드코딩된 추천 결과 텍스트 제거 또는 축소

## 완료 기준

- [ ] AI 검색 -> 추천 결과 화면 이동이 mock API 기반으로 동작한다.
- [ ] 추천 결과가 지도 화면과 연결될 준비가 되어 있다.
- [ ] 추천 결과 데이터 구조가 `RecommendationResult` schema와 호환된다.
```

---

## FE-05

**Title**  
`온보딩 Target Place 및 추천 조건 데이터 구조 정리`

**Priority**  
`Medium`

**Labels**  
`frontend`, `onboarding`, `preference`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

온보딩에서 입력한 주요 장소는 target-place API로 관리하고, 선호 조건은 recommendation request의 `preferences`로 전달 가능한 구조로 정리한다.

## 작업 내용

- [ ] 주요 장소 payload를 `TargetPlaceCreateRequest`/`TargetPlaceUpdateRequest` 기준으로 정리
- [ ] `category` enum: `SCHOOL`, `WORK_PLACE`, `HOME`, `SUBWAY_STATION`, `BUS_TERMINAL`, `ETC` 반영
- [ ] 주소, 위도/경도, 메모 필드 확인
- [ ] 선호 조건은 `RecommendationRequest.preferences` 문자열 배열로 변환
- [ ] 화면 이동 또는 새로고침 시 유지해야 하는 상태 범위 정리

## 완료 기준

- [ ] 온보딩 입력값이 target-place request payload 형태로 변환된다.
- [ ] 추천 검색 흐름에서 target place와 preferences를 활용할 수 있다.
- [ ] 상태 유지 범위가 정리되어 있다.
```

---

## FE-06

**Title**  
`추천 응답 기반 인프라 및 경로 데이터 Mock API 연결`

**Priority**  
`Medium`

**Labels**  
`frontend`, `infra`, `map`, `mock`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

인프라 보기 화면과 거리/경로 표시를 recommendation 응답 및 route endpoint 기반 mock API 응답으로 연결한다.

## 작업 내용

- [ ] 추천 결과의 `infrastructures` 배열을 인프라 리스트/마커의 기본 데이터로 사용
- [ ] `firstTargetPlaceRoute`의 요약 경로 데이터를 결과 카드와 지도 화면에 매핑
- [ ] 지도 geometry가 필요한 경우 `GET /api/v1/recommendations/{recommendationId}/route?detail=SUMMARY|DETAIL` 사용
- [ ] Tmap POI 검색 로직과 백엔드 recommendation/route 데이터의 역할 구분
- [ ] 인프라 지도와 리스트가 API 응답을 사용하도록 변경

## 완료 기준

- [ ] 인프라 화면이 recommendation ID 기반 mock API 응답으로 동작한다.
- [ ] 주변 시설, 거리, 경로 정보가 안정적으로 표시된다.
- [ ] 백엔드 데이터와 외부 지도 API 데이터의 역할이 구분된다.
```

---

## FE-07

**Title**  
`매물별 3D 모델 URL 연결 구조 구현`

**Priority**  
`Medium`

**Labels**  
`frontend`, `3d`, `spline`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

3D 보기 화면이 고정 URL이 아니라 `GET /api/v1/properties/{id}/3d` 응답을 사용하도록 구조를 변경한다.

## 작업 내용

- [ ] 3D 보기 화면에서 property ID 사용
- [ ] `modelUrl`, `modelType`, `previewImageUrl`, `has3DModel` 응답 구조 반영
- [ ] 평면도/상세 이미지는 별도 images endpoint 또는 기존 mock asset과의 관계 정리
- [ ] 3D 데이터가 없는 매물에 대한 fallback UI 추가

## 완료 기준

- [ ] 매물별 3D `modelUrl`을 사용할 수 있다.
- [ ] 3D URL이 없는 경우 빈 상태가 표시된다.
- [ ] 실제 API 응답으로 교체 가능한 구조이다.
```

---

## FE-08

**Title**  
`주요 화면 Loading, Error, Empty 상태 추가`

**Priority**  
`Medium`

**Labels**  
`frontend`, `ux`, `state`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

실제 API 연결에 대비하여 주요 화면의 로딩, 실패, 데이터 없음 상태를 처리한다.

## 작업 내용

- [ ] 매물 목록 loading/error/empty 상태 추가
- [ ] 추천 결과 loading/error/empty 상태 추가
- [ ] 매물 상세 loading/error/empty 상태 추가
- [ ] 인프라 화면 loading/error/empty 상태 추가
- [ ] 3D 화면 loading/error/empty 상태 추가
- [ ] mock API 지연/실패 상황 테스트 가능하도록 구성

## 완료 기준

- [ ] 주요 화면에서 로딩 중, 실패, 데이터 없음 상태가 표시된다.
- [ ] 실제 API 연결 시 빈 값이나 예외로 화면이 깨지지 않는다.
- [ ] 네트워크 지연 상황에서도 사용자 흐름이 유지된다.
```

---

## FE-09

**Title**  
`검색-결과-지도-상세 상태 흐름 정리`

**Priority**  
`High`

**Labels**  
`frontend`, `state`, `flow`

**Milestone**  
`Week 13-14: OpenAPI 기반 통합 준비`

**Body**

```md
## 목적

AI 검색, 추천 결과, 지도, 매물 상세 사이의 상태 전달 방식을 실제 API 연결에도 유지 가능한 구조로 정리한다.

## 작업 내용

- [ ] AI 검색 완료 여부 상태 관리 방식 정리
- [ ] 추천 결과 상태 관리 방식 정리
- [ ] 선택 매물 상태 관리 방식 정리
- [ ] MY 매물 상태 관리 방식 정리
- [ ] 지도 표시 상태 관리 방식 정리
- [ ] 새로고침 또는 직접 URL 접근 시 동작 정의
- [ ] 불필요한 sessionStorage 의존 축소

## 완료 기준

- [ ] 검색 -> 결과 -> 지도 -> 상세 화면의 상태 전달 방식이 명확하다.
- [ ] 화면 이동 후에도 핵심 상태가 예측 가능하게 유지된다.
- [ ] 실제 API 연결 이후에도 유지 가능한 구조이다.
```

---

## FE-10

**Title**  
`실제 서버 API 연결 환경 구성`

**Priority**  
`High`

**Labels**  
`frontend`, `api`, `integration`

**Milestone**  
`Week 15: 실제 서버 API 1차 연결`

**Body**

```md
## 목적

백엔드 서버 배포 이후 프론트엔드가 실제 API를 호출할 수 있도록 API 연결 환경을 구성한다.

## 작업 내용

- [ ] 백엔드 서버 base URL 환경변수 설정
- [ ] 개발 환경 mock API / 데모 환경 real API 전환 방식 정리
- [ ] API 요청 공통 처리 구조 추가
- [ ] API 에러 처리 구조 추가
- [ ] `Authorization: Bearer ...` 또는 `ROOMING_ACCESS_TOKEN` 쿠키 기반 credential 처리 방식 확인
- [ ] CORS, endpoint path, request/response 형식 차이 점검

## 완료 기준

- [ ] 실제 백엔드 서버 URL로 API 요청을 보낼 수 있다.
- [ ] mock/real API 전환 기준이 명확하다.
- [ ] API 연결 실패 시 화면에서 에러 상태가 처리된다.
```

---

## FE-11

**Title**  
`실제 Property API 연결`

**Priority**  
`High`

**Labels**  
`frontend`, `property`, `integration`

**Milestone**  
`Week 15: 실제 서버 API 1차 연결`

**Body**

```md
## 목적

실제 백엔드 property API를 지도 화면, 매물 리스트, 매물 상세 화면에 연결한다.

## 작업 내용

- [ ] `GET /api/v1/properties` 매물 목록 API 연결
- [ ] `GET /api/v1/properties/{id}` 매물 상세 API 연결
- [ ] `GET /api/v1/properties/{id}/images` 이미지 API 연결 필요 여부 확인
- [ ] 실제 응답의 이미지, 가격, 위치, 면적, 설명 필드 매핑
- [ ] 추천 이유는 recommendation 응답에서만 표시하도록 화면 책임 분리
- [ ] mock 응답과 실제 응답 차이에 따른 mapper 수정
- [ ] 데이터 없음/서버 오류 상태 처리

## 완료 기준

- [ ] 실제 서버의 매물 목록이 지도/리스트에 표시된다.
- [ ] 실제 서버의 매물 상세 정보가 상세 화면에 표시된다.
- [ ] 데이터 없음 또는 서버 오류 상태가 처리된다.
```

---

## FE-12

**Title**  
`실제 Recommendation API 연결`

**Priority**  
`High`

**Labels**  
`frontend`, `recommendation`, `ai`, `integration`

**Milestone**  
`Week 15: 실제 서버 API 1차 연결`

**Body**

```md
## 목적

AI 검색 입력과 선호 조건을 실제 recommendation API에 전달하고, 실제 추천 결과를 화면 흐름에 연결한다.

## 작업 내용

- [ ] AI 검색 입력값을 `POST /api/v1/recommendations`의 `query`로 전달
- [ ] 온보딩/필터 조건 중 선호 항목을 `preferences` 배열에 포함
- [ ] `topN`은 1~5 범위에서 전달
- [ ] 실제 추천 응답의 `data.results`를 추천 결과 화면에 연결
- [ ] 추천된 매물 목록을 지도 화면 매물 리스트와 연결
- [ ] 추천된 매물 목록을 지도 마커와 연결
- [ ] 응답 지연 시 loading 상태 표시

## 완료 기준

- [ ] 실제 서버를 통해 추천 요청을 보낼 수 있다.
- [ ] 추천 결과 화면이 실제 추천 응답으로 렌더링된다.
- [ ] 추천 결과가 지도 화면 흐름과 연결된다.
```

---

## FE-13

**Title**  
`실제 Recommendation Infra/Route 데이터 연결`

**Priority**  
`Medium`

**Labels**  
`frontend`, `infra`, `route`, `integration`

**Milestone**  
`Week 15: 실제 서버 API 1차 연결`

**Body**

```md
## 목적

추천 결과에 포함된 주변 인프라와 saved recommendation route 정보를 실제 서버 API와 연결한다.

## 작업 내용

- [ ] recommendation 응답의 `infrastructures`를 인프라 화면에 연결
- [ ] recommendation 응답의 `firstTargetPlaceRoute`를 거리/경로 요약 UI에 연결
- [ ] `GET /api/v1/recommendations/{recommendationId}/route`를 지도 geometry 표시와 연결
- [ ] Tmap 표시 로직과 백엔드 응답 데이터 mapper 정리
- [ ] 응답 누락 시 fallback UI 표시

## 완료 기준

- [ ] 실제 서버의 recommendation 인프라 데이터가 지도와 리스트에 표시된다.
- [ ] 실제 서버의 route summary/geometry 데이터가 화면에 표시된다.
- [ ] 응답 누락 시 fallback UI가 표시된다.
```

---

## FE-14

**Title**  
`실제 Property 3D API 및 modelUrl 연결`

**Priority**  
`Medium`

**Labels**  
`frontend`, `3d`, `spline`, `integration`

**Milestone**  
`Week 15: 실제 서버 API 1차 연결`

**Body**

```md
## 목적

매물별 3D 정보 API를 연결하여 실제 `modelUrl` 기반 3D 화면을 표시한다.

## 작업 내용

- [ ] `GET /api/v1/properties/{id}/3d` 연결
- [ ] 실제 `modelUrl`을 iframe/viewer에 반영
- [ ] `modelType`, `previewImageUrl`, `has3DModel` 매핑
- [ ] 평면도/이미지는 `/api/v1/properties/{id}/images` 또는 별도 asset 정책과 연결
- [ ] 3D 모델이 없는 매물에 대한 fallback 화면 정리

## 완료 기준

- [ ] 실제 API 응답의 3D URL로 3D 화면이 열린다.
- [ ] 매물별로 다른 3D 모델을 표시할 수 있다.
- [ ] 3D 데이터가 없는 경우에도 화면이 깨지지 않는다.
```

---

## FE-15

**Title**  
`Saved Recommendation Favorite API 연결`

**Priority**  
`Medium`

**Labels**  
`frontend`, `favorite`, `integration`

**Milestone**  
`Week 15: 실제 서버 API 1차 연결`

**Body**

```md
## 목적

MY 매물에 해당하는 saved recommendation 조회, favorite 지정, 해제 흐름을 실제 recommendation favorite API와 연결한다.

## 작업 내용

- [ ] `GET /api/v1/recommendations/favorites` 조회 API 연결
- [ ] `POST /api/v1/recommendations/{recommendationId}/favorite` 선택 API 연결
- [ ] `DELETE /api/v1/recommendations/{recommendationId}/favorite` 해제 API 연결
- [ ] 지도 화면 추천 매물/MY 매물 전환을 recommendation favorite 데이터 기반으로 수정
- [ ] API 실패 시 상태 표시

## 완료 기준

- [ ] 실제 API 기반으로 favorite recommendation 목록을 조회할 수 있다.
- [ ] MY 선택/해제 흐름이 recommendation favorite API 구조와 연결된다.
- [ ] 실패 시 사용자에게 적절한 상태가 표시된다.
```

---

## FE-16

**Title**  
`Auth/OAuth 연동 후 사용자 세션 처리`

**Priority**  
`Medium`

**Labels**  
`frontend`, `auth`, `integration`

**Milestone**  
`Week 15-16: 최종 데모 안정화`

**Body**

```md
## 목적

백엔드 OAuth/JWT 흐름이 확정된 이후 프론트엔드 API 호출에 인증 상태를 반영한다.

## 작업 내용

- [ ] seeker/broker OAuth entry endpoint 확인
- [ ] `/oauth2/redirect` 이후 토큰 또는 쿠키 처리 방식 반영
- [ ] 인증이 필요한 API 요청에 Bearer header 또는 cookie credential 설정
- [ ] 인증 실패 상태 처리
- [ ] 토큰 만료 또는 미로그인 상태 처리
- [ ] 최종 데모용 로그인/우회 시나리오 정리

## 완료 기준

- [ ] 실제 인증 흐름이 제공될 경우 프론트엔드 API 호출에 반영할 수 있다.
- [ ] 인증 실패 시 사용자 흐름이 깨지지 않는다.
- [ ] 최종 데모에 필요한 로그인 또는 우회 시나리오가 정리되어 있다.
```

---

## FE-17

**Title**  
`Lint 오류 및 TypeScript 경고 정리`

**Priority**  
`High`

**Labels**  
`frontend`, `quality`, `lint`

**Milestone**  
`Week 16: 최종 데모 안정화`

**Body**

```md
## 목적

최종 데모 전 코드 품질 리스크를 줄이기 위해 lint 오류와 TypeScript 경고를 정리한다.

## 작업 내용

- [ ] 현재 `npm run lint` 오류 수정
- [ ] React hook 관련 경고 수정
- [ ] 불필요한 `any` 타입 축소
- [ ] 사용하지 않는 변수 정리
- [ ] 사용하지 않는 표현식 정리
- [ ] 실제 API 연결 이후 새로 생긴 타입 오류 정리

## 완료 기준

- [ ] `npm run build`가 통과한다.
- [ ] 가능한 범위에서 `npm run lint`가 오류 없이 통과한다.
- [ ] 실제 API 연동 전후 코드 품질 리스크가 줄어든다.
```

---

## FE-18

**Title**  
`UX 및 브랜딩 일관성 개선`

**Priority**  
`Medium`

**Labels**  
`frontend`, `ux`, `design`

**Milestone**  
`Week 16: 최종 데모 안정화`

**Body**

```md
## 목적

최종 데모에서 하나의 제품처럼 보이도록 주요 화면의 UX와 브랜딩 일관성을 정리한다.

## 작업 내용

- [ ] 버튼 스타일 정리
- [ ] 카드/패널 스타일 정리
- [ ] 모달 스타일 정리
- [ ] 지도, AI 패널, 결과 화면, 상세 화면 사이의 시각적 연결감 개선
- [ ] 실제 API 응답 길이에 대응하는 레이아웃 정리
- [ ] 빈 값 또는 긴 텍스트 처리
- [ ] Rooming 브랜드 톤에 맞는 색상, 간격, 문구 정리

## 완료 기준

- [ ] 주요 사용자 흐름에서 UI 스타일이 일관되게 보인다.
- [ ] 실제 데이터가 들어와도 텍스트와 레이아웃이 깨지지 않는다.
- [ ] 발표 시 화면 전환이 하나의 제품처럼 보인다.
```

---

## FE-19

**Title**  
`최종 데모 End-to-End QA`

**Priority**  
`High`

**Labels**  
`frontend`, `demo`, `qa`

**Milestone**  
`Week 16: 최종 데모 안정화`

**Body**

```md
## 목적

실제 서버/API 기반 최종 데모 사용자 시나리오를 점검하고 발표 가능한 상태로 안정화한다.

## 작업 내용

- [ ] 최종 데모 사용자 시나리오 확정
- [ ] 온보딩 -> AI 검색 -> 추천 결과 -> 지도 -> 매물 상세 -> 인프라 -> 3D 보기 흐름 점검
- [ ] 실제 API 기반 시연 성공 여부 확인
- [ ] 화면 깨짐, 빈 데이터, 이동 오류, API 오류 정리
- [ ] API 불안정 상황에 대비한 fallback/mock 전환 방식 준비
- [ ] 알려진 제한 사항 문서화

## 완료 기준

- [ ] 실제 서버/API 기반 발표용 시연 경로가 문서화되어 있다.
- [ ] 시연 흐름이 최소 1회 이상 처음부터 끝까지 성공한다.
- [ ] 알려진 제한 사항과 fallback 시나리오가 정리되어 있다.
```

---

## 추천 진행 순서

1. FE-01 OpenAPI 타입 정의
2. FE-02 API client/mock adapter 구조 생성
3. FE-03 매물 목록 및 상세 API 구조 연결
4. FE-04 AI 추천 검색 mock API 연결
5. FE-09 상태 흐름 정리
6. FE-06 추천 응답 기반 인프라/경로 데이터 mock API 연결
7. FE-07 매물별 Property 3D 모델 URL 연결
8. FE-08 loading/error/empty 상태 추가
9. FE-10 실제 서버 API 연결 환경 구성
10. FE-11 실제 Property API 연결
11. FE-12 실제 Recommendation API 연결
12. FE-13 실제 Recommendation Infra/Route 데이터 연결
13. FE-14 실제 Property 3D API 및 modelUrl 연결
14. FE-15 Saved Recommendation Favorite API 연결
15. FE-16 Auth/OAuth 연동 후 사용자 세션 처리
16. FE-17 lint/type 정리
17. FE-18 UX/브랜딩 개선
18. FE-19 최종 데모 End-to-End QA

---

## GitHub Issue 작성 템플릿

```md
## 목적

이 이슈에서 해결하려는 문제 또는 구현하려는 기능을 설명한다.

## 작업 내용

- [ ] 작업 1
- [ ] 작업 2
- [ ] 작업 3

## 완료 기준

- [ ] 사용자가 기대한 흐름이 동작한다.
- [ ] 실제 API 또는 mock API 기준으로 화면이 정상 렌더링된다.
- [ ] `npm run build`가 통과한다.
- [ ] 필요한 경우 `npm run lint`가 통과한다.

## 참고 사항

- 작업 브랜치: `<type>/<issue-number>-<short-description>` (예: `feature/9-frontend-polish`)
- 관련 화면:
- 관련 OpenAPI endpoint:
- 의존 이슈:
- 실제 서버 연결 필요 여부:
```
