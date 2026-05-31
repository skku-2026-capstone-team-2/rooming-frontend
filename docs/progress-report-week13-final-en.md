# Team #2 Progress Report - Week #13

> Scope: Frontend progress reorganized as the work completed over the last two weeks

## What were the goals for the last 2 weeks?

### Frontend part - Yejin

- Organize frontend API response types and view models based on the OpenAPI document.
- Build an API client, shared HTTP client, and mock/real API switching structure for backend integration.
- Convert mock-data-based screens into API-function-based and React Query-based data fetching flows.
- Align the property list, property detail, AI recommendation result, infrastructure view, and 3D view with the API response structure.
- Convert onboarding target places and preferences into the target-place API and recommendation request format.
- Implement Google OAuth redirect handling and user-type-based routing.
- Start testing available real server endpoints.
- Prepare frontend-side requirements for future Spline React integration.

## What goals were accomplished this week?

### Frontend part

- Added the OpenAPI document and defined TypeScript types based on the API schema.
- Separated API response types from view models used in the UI.
- Added `VITE_API_BASE_URL` and `VITE_USE_MOCK` to switch between mock and real APIs.
- Implemented a shared HTTP client for request handling, credentials, API errors, and 401 responses.
- Created domain API modules for property, recommendation, and target-place data.
- Added mock adapters so the frontend can be tested before full backend availability.
- Introduced React Query for property, recommendation, route, 3D model, and favorite data fetching.
- Refactored property list/detail screens to use API functions and mapper-based view models.
- Added actual Property API and Recommendation API connection structures.
- Connected the AI recommendation flow to the recommendation API structure.
- Added recommendation-based infrastructure/route mock data and map visualization.
- Added per-property 3D `modelUrl` support and fallback UI when 3D data is unavailable.
- Converted onboarding target places into API payloads and connected target-place creation.
- Replaced onboarding place search with Tmap POI REST API.
- Implemented OAuth redirect screen, callback parameter handling, session state, and user-type routing.
- Confirmed partial real API behavior:
  - Google OAuth login -> redirect works correctly.
  - `POST /api/v1/user/seeker/target-place` returns `201 Created`.
  - `POST /api/v1/recommendations` returns `200 OK`.
- Cleaned up state flow between search, result, map, and detail screens.
- Extracted shared UI components such as `CenteredMessage` and `PropertyImagePlaceholder`.
- Documented API specification issues and backend handoff items.
- Confirmed `npm run build` passes and `npm run lint` has no errors.

## Reflect critically on any goals not accomplished.

### Frontend part

Most major API connection structures are now implemented, but full real-server testing is not complete yet. Google OAuth redirect, target-place creation, and recommendation creation were verified, but the AI recommendation result currently returns an empty array. Because of this, follow-up flows related to recommended properties, recommendation routes, infrastructure display, and MY properties still need additional testing once the server and AI modules return actual recommendation data.

The OAuth flow has been verified up to redirect handling and user-type routing, but JWT, cookie, or Authorization-header-based authentication should be tested further with the backend.

For 3D, the current implementation displays each property’s `modelUrl` through an iframe. For the final demo, the team needs to coordinate with the 3D/Spline side on the Spline scene delivery method, fixed object/variable/event names, and clickable object list. The frontend plan is to move from iframe display to `@splinetool/react-spline`.

Code quality has improved, but lint warnings remain, mainly around Tmap-related `any` types, hook dependency warnings, and an unused mock request parameter.

## What are the goals for next two weeks?

### Frontend part

- Connect the actual server URL through `VITE_API_BASE_URL` and verify the full flow with `VITE_USE_MOCK=false`.
- Test property list, map markers, property detail, and 3D view with actual Property API responses.
- Test AI search, recommendation results, recommendation routes, and infrastructure display with actual Recommendation API responses.
- Continue follow-up testing once AI recommendation results return actual recommended properties.
- Verify onboarding target-place save/retrieve flow.
- Connect Favorite/MY property list, selection, and removal to the real API.
- Verify OAuth/JWT or cookie-based authentication with the backend.
- Reflect actual route geometry and infrastructure data in the map visualization.
- Finalize Spline collaboration details and begin converting the 3D screen to `@splinetool/react-spline`.
- Improve loading, error, and empty states for real API failures or delays.
- Reduce remaining lint warnings.
- Complete at least one successful end-to-end final demo run using the real server/API.

## How many hours were spent on each goal noted above?

### Frontend part

- API foundation and type setup (OpenAPI analysis, TypeScript types, API client, HTTP client, mock/real switching): 7 hours
- Data fetching and property integration (React Query, property mapper, actual Property API structure, price unit cleanup): 6 hours
- Recommendation and user flow integration (Recommendation API structure, mock recommendation flow, actual API structure, search -> result -> map -> detail state flow): 6 hours
- Onboarding and authentication flow (target-place payload, Tmap POI search, preference storage, OAuth redirect, session state, user-type routing): 5 hours
- Infrastructure and 3D integration (recommendation route mock API, map visualization, per-property 3D modelUrl, fallback UI, Spline integration research): 6 hours
- Testing, cleanup, and documentation (partial actual API testing, shared component extraction, API specification issues, Week 13 report cleanup, build/lint verification): 5.5 hours

## Verification

- Google OAuth login -> redirect works correctly.
- `POST /api/v1/user/seeker/target-place` -> `201 Created`
- `POST /api/v1/recommendations` -> `200 OK`
- AI recommendation results currently return an empty array, so recommendation-based follow-up APIs need more testing.
- `npm run build`: passed
- `npm run lint`: 0 errors, 37 warnings

## Suggested Screenshots

- OAuth login redirect result: after login successfully routes to onboarding or the main flow.
- Onboarding target-place creation: registered place list after `POST /target-place`.
- AI recommendation request result: recommendation screen or network response showing `200 OK`.
- Map screen: property markers, recommendation/MY list mode, and AI panel.
- Property detail or 3D screen: per-property detail data and `modelUrl`/fallback behavior.
