# rooming-frontend

대학생을 위한 AI 기반 3D 자취방 탐색 및 생활권 분석 서비스 `rooming`의 프론트엔드 레포지토리입니다.

사용자는 자연어로 원하는 자취방 조건을 입력하고, 추천 매물을 지도, 주변 인프라, 통학 경로, 3D 공간 정보와 함께 비교할 수 있습니다. 공급자는 중개사 인증 후 매물과 3D 자산을 등록할 수 있습니다.

## Features

- Google OAuth 기반 SEEKER/BROKER 사용자 플로우
- 온보딩 기반 주요 장소 및 선호 조건 등록
- AI 추천 검색 결과, 추천 이유, 찜(MY) 매물 관리
- T-map 기반 매물/인프라 마커, POI 검색, 도보 경로 표시
- Spline 기반 매물 3D 뷰어 및 사진 보기
- OpenAPI 기반 API 타입, mock/real API 전환 구조
- 중개인 admin 매물 등록 및 인증 정보 입력 화면

## Tech Stack

| Category | Stack |
| --- | --- |
| Framework | React 19, TypeScript, Vite |
| Routing | React Router 7 |
| Server State | TanStack Query 5 |
| Styling | Tailwind CSS 4 |
| UI | lucide-react, class-variance-authority, clsx, tailwind-merge |
| Map / 3D | T-map SDK/API, Spline Viewer |
| Quality | ESLint, TypeScript build |

## Getting Started

### Prerequisites

- Node.js 20 이상 권장
- npm
- T-map API Key

### Installation

```bash
npm install
```

### Environment Variables

`.env.example`을 참고해 로컬 환경 파일을 생성합니다.

```bash
cp .env.example .env.local
```

```env
VITE_TMAP_APP_KEY=
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK=true
```

| Variable | Description |
| --- | --- |
| `VITE_TMAP_APP_KEY` | T-map SDK/API 호출에 사용하는 앱 키 |
| `VITE_API_BASE_URL` | 백엔드 API base URL |
| `VITE_USE_MOCK` | `"false"`일 때만 실제 API 호출, 그 외에는 mock adapter 사용 |

### Run

```bash
npm run dev
```

기본 Vite 개발 서버 주소는 `http://localhost:5173`입니다.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | TypeScript 빌드 및 production bundle 생성 |
| `npm run lint` | ESLint 검사 |
| `npm run preview` | production build preview 실행 |

## Project Structure

```text
src/
  api/          API client, domain API, mock adapter, mapper
  components/   재사용 UI 및 도메인 컴포넌트
  figma/        디자인 시스템 primitive 및 데모
  hooks/        React Query hooks, 화면 공유 hooks
  pages/        라우트 단위 페이지
  store/        auth 등 클라이언트 상태
  styles/       Tailwind, theme, font 스타일
  types/        OpenAPI 타입 및 화면 view model 타입
  utils/        T-map marker, route drawing, 추천 선택 유틸
docs/
  api/          OpenAPI 명세 및 타입 매핑 문서
  product-spec-ko.md
```

## Routes

| Path | Screen |
| --- | --- |
| `/` | Welcome / Login |
| `/oauth2/redirect` | OAuth callback |
| `/onboarding` | 사용자 주요 장소 및 선호 조건 등록 |
| `/map` | 메인 지도 및 AI 추천 검색 |
| `/ai-result` | AI 추천 결과 상세 |
| `/property/:id` | 매물 상세 |
| `/infra-search` | 인프라 검색 |
| `/infra-view` | 인프라 지도 보기 |
| `/3d-view` | 3D / 사진 보기 |
| `/my` | 마이페이지 |
| `/admin` | 중개인 admin |
| `/figma` | 디자인 시스템 데모 |

## API Strategy

- OpenAPI 스키마 기반 타입은 `src/types/api.ts`에서 관리합니다.
- 도메인별 API 호출은 `src/api/*Api.ts`에 둡니다.
- 화면은 API 응답에 직접 의존하지 않고 `src/api/mappers`의 view model 변환 결과를 사용합니다.
- `VITE_USE_MOCK` 값으로 mock adapter와 실제 API 호출을 전환합니다.
- 추천, 찜, 경로, 주요 장소 등 서버 상태는 TanStack Query hook으로 관리합니다.

## Convention

### Branch

기존 작업 흐름을 기준으로 아래 prefix를 사용합니다.

```text
feat/*
fix/*
refactor/*
docs/*
design/*
```

### Commit

Conventional Commit 스타일을 따릅니다.

```text
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 동작 변경 없는 구조 개선
docs: 문서 수정
style: 스타일 또는 포맷 수정
chore: 설정, 패키지, 기타 작업
```

필요한 경우 scope를 붙입니다.

```text
feat(api): recommendation API 연결
fix(map): 마커 중심점 계산 수정
docs: 기획 문서 갱신
```

### Pull Request

- 작업 단위는 가능한 한 하나의 기능 또는 이슈로 제한합니다.
- PR에는 변경 요약, 확인한 명령어, 남은 이슈를 작성합니다.
- 병합 전 `npm run lint`, `npm run build` 통과를 확인합니다.

## Documents

- [기획 문서](./docs/product-spec-ko.md)
- [API 문서](./docs/api/README.md)
- [OpenAPI 명세](./docs/api/openapi.yaml)
- [더미 데이터와 OpenAPI 타입 매핑](./docs/api/type-mapping-ko.md)
