# Team #2 Progress Report - Week #13

> 범위: 최근 구현 사항을 지난 2주간의 프론트엔드 작업으로 재구성

## What were the goals for the last 2 weeks?

### Frontend part - Yejin

- OpenAPI 문서를 기준으로 프론트엔드 API 응답 타입과 화면용 view model을 정리한다.
- 백엔드 연동을 대비하여 API client, 공통 HTTP client, mock/real API 전환 구조를 구축한다.
- 기존 mock 데이터 기반 화면을 API 함수 및 React Query 기반 데이터 패칭 흐름으로 전환한다.
- 매물 목록, 매물 상세, AI 추천 결과, 인프라 보기, 3D 보기 화면을 API 응답 구조에 맞게 정리한다.
- 온보딩 주요 장소와 선호 조건을 target-place API 및 추천 요청 형식에 맞게 변환한다.
- Google OAuth redirect 처리와 사용자 유형별 라우팅을 구현한다.
- 연결 가능한 실제 서버 endpoint부터 테스트를 시작한다.
- 향후 Spline React 연동을 위해 프론트엔드 측 협업 필요 사항을 정리한다.

## What goals were accomplished this week?

### Frontend part

- OpenAPI 문서를 추가하고 API schema 기준 TypeScript 타입을 정의했다.
- API 응답 타입과 UI 렌더링용 view model 타입을 분리했다.
- `VITE_API_BASE_URL`, `VITE_USE_MOCK` 기반 mock/real API 전환 구조를 추가했다.
- 요청 처리, credential, API error, 401 응답 처리를 위한 공통 HTTP client를 구현했다.
- property, recommendation, target-place 도메인 API 모듈을 생성했다.
- 백엔드 전체 연결 전에도 테스트할 수 있도록 mock adapter를 추가했다.
- React Query를 도입하여 매물, 추천, 경로, 3D 모델, 찜 목록 데이터 패칭 구조를 정리했다.
- 매물 목록/상세 화면을 API 함수와 mapper 기반 view model 구조로 리팩토링했다.
- 실제 Property API와 Recommendation API 연결 구조를 추가했다.
- AI 추천 흐름을 recommendation API 구조와 연결했다.
- 추천 응답 기반 인프라/경로 mock data와 지도 시각화를 추가했다.
- 매물별 3D `modelUrl` 지원과 3D 데이터가 없는 경우의 fallback UI를 추가했다.
- 온보딩 주요 장소를 API payload로 변환하고 target-place 생성 API를 연결했다.
- 온보딩 장소 검색을 Tmap POI REST API 기반으로 교체했다.
- OAuth redirect screen, callback parameter 처리, 세션 상태, 사용자 유형별 라우팅을 구현했다.
- 실제 API 테스트를 일부 수행했다.
  - Google OAuth login -> redirect 정상 확인
  - `POST /api/v1/user/seeker/target-place` -> `201 Created` 확인
  - `POST /api/v1/recommendations` -> `200 OK` 확인
- 검색, 결과, 지도, 상세 화면 사이의 상태 흐름을 정리했다.
- `CenteredMessage`, `PropertyImagePlaceholder` 등 공용 UI 컴포넌트를 추출했다.
- API 명세 이슈와 백엔드 전달 사항을 문서화했다.
- `npm run build` 통과와 `npm run lint` 오류 없음 상태를 확인했다.

## Reflect critically on any goals not accomplished.

### Frontend part

대부분의 주요 API 연결 구조는 구현했지만, 실제 서버 기반 전체 테스트는 아직 완료되지 않았다. Google OAuth redirect, target-place 생성, recommendation 생성은 정상 응답을 확인했지만, 현재 AI 추천 결과가 빈 배열로 응답되고 있어 추천 매물 기반 후속 흐름은 충분히 테스트하지 못했다.

따라서 추천 결과 기반 매물 목록, 추천 경로, 인프라 표시, MY 매물 관련 흐름은 서버/AI 모듈이 실제 추천 데이터를 반환한 뒤 추가 테스트가 필요하다.

OAuth 흐름은 redirect와 사용자 유형별 라우팅까지 확인했지만, JWT, 쿠키, Authorization header 기반 인증이 필요한 API는 백엔드와 함께 추가 검증해야 한다.

3D 기능은 현재 매물별 `modelUrl`을 iframe으로 표시하는 구조까지 구현되어 있다. 최종 데모에서 더 풍부한 3D 상호작용을 제공하려면 3D/Spline 담당자와 Spline scene 제공 방식, object/variable/event 이름 규칙, 클릭 가능 오브젝트 목록을 협의해야 한다. 프론트엔드는 향후 iframe 방식에서 `@splinetool/react-spline` 기반 구조로 전환할 계획이다.

코드 품질 측면에서는 `npm run lint`가 오류 없이 통과하지만, Tmap 관련 `any` 타입, 일부 hook dependency 경고, 사용하지 않는 mock request parameter 등 경고가 남아 있다.

## What are the goals for next two weeks?

### Frontend part

- 실제 서버 주소를 `VITE_API_BASE_URL`에 연결하고 `VITE_USE_MOCK=false` 환경에서 전체 흐름을 검증한다.
- 실제 Property API 응답으로 지도, 매물 리스트, 매물 상세, 3D 보기 화면을 테스트한다.
- 실제 Recommendation API 응답으로 AI 검색, 추천 결과, 지도 마커, 추천 경로 연결을 테스트한다.
- AI 추천 결과가 실제 추천 매물로 응답되면 후속 화면을 end-to-end로 테스트한다.
- target-place API를 통한 온보딩 주요 장소 저장/조회 흐름을 검증한다.
- Favorite/MY 매물 선택, 해제, 목록 조회를 실제 API와 연결한다.
- OAuth/JWT 또는 쿠키 기반 인증 흐름을 백엔드와 맞춰 검증한다.
- 실제 route geometry와 인프라 응답을 지도 시각화 로직에 반영한다.
- 3D/Spline 담당자와 Spline scene 제공 방식, object/variable/event naming rule, clickable object 목록을 확정한다.
- 기존 iframe 기반 3D 표시를 `@splinetool/react-spline` 기반 구조로 전환하기 시작한다.
- 실제 API 누락, 지연, 실패 상황에 대한 loading/error/empty 상태를 보강한다.
- 남은 lint warning을 정리한다.
- 실제 서버/API 기반 최종 데모 시나리오를 최소 1회 이상 end-to-end로 성공시킨다.

## How many hours were spent on each goal noted above?

### Frontend part

- API 기반 구조 및 타입 정리 (OpenAPI 분석, TypeScript 타입, API client, HTTP client, mock/real 전환 구조): 7 hours
- 데이터 패칭 및 매물 API 연동 (React Query, property mapper, 실제 Property API 구조, 가격 단위 정리): 6 hours
- 추천 및 사용자 흐름 연동 (Recommendation API 구조, mock 추천 흐름, 실제 API 구조, 검색 -> 결과 -> 지도 -> 상세 상태 흐름): 6 hours
- 온보딩 및 인증 흐름 구현 (target-place payload, Tmap POI 검색, 선호 조건 저장, OAuth redirect, 세션 상태, 사용자 유형별 라우팅): 5 hours
- 인프라 및 3D 연동 (추천 경로 mock API, 지도 시각화, 매물별 3D modelUrl, fallback UI, Spline 연동 방식 조사): 6 hours
- 테스트, 정리, 문서화 (실제 API 일부 테스트, 공용 컴포넌트 추출, API 명세 이슈, Week13 보고서 정리, build/lint 검증): 5.5 hours

## Verification

- Google OAuth login -> redirect 정상 확인
- `POST /api/v1/user/seeker/target-place` -> `201 Created`
- `POST /api/v1/recommendations` -> `200 OK`
- AI 추천 결과가 빈 배열로 응답되어 추천 매물 기반 후속 API는 추가 테스트 필요
- `npm run build`: 통과
- `npm run lint`: 오류 0개, 경고 37개

## Suggested Screenshots

- OAuth 로그인 후 onboarding 또는 main flow로 redirect된 화면
- 온보딩에서 target-place 등록이 완료된 장소 목록 화면
- AI 추천 요청 후 `200 OK`를 확인할 수 있는 추천 결과 화면 또는 네트워크 응답 화면
- 지도 화면: 매물 마커, 추천/MY 리스트 모드, AI 패널이 함께 보이는 화면
- 매물 상세 또는 3D 화면: 매물별 `modelUrl` 표시 또는 fallback 상태
