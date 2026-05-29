# Progress Report of Team #2 - Week #13

## What were the goals for the last 2 weeks?

### Frontend part - Yejin

- Refactor the previous MVP from an early prototype structure into a route/page/component-based frontend structure.
- Expand the user flow beyond the initial MVP screens into a more complete prototype flow.
- Implement separate screens for onboarding, AI recommendation results, property details, infrastructure view, 3D view, and admin prototype.
- Prepare the frontend for OpenAPI-based backend integration, even though the backend server has not been deployed yet.
- Replace screen-level hardcoding with mock data structures that can later be mapped to backend API responses.
- Improve the consistency of user flow, navigation, and visual branding after the midterm prototype.

## What goals were accomplished this week?

### Frontend part

- Reorganized the frontend around React Router routes instead of keeping the flow in a single MVP-level structure.
- Implemented a connected user flow across onboarding, map, AI result, property detail, infrastructure view, and 3D view screens.
- Added mock-based property, favorite, infrastructure, and commute route data to validate the frontend flow before backend deployment.
- Implemented property list mode switching between recommended properties and MY properties.
- Added property marker visibility controls on the map screen.
- Added infrastructure search UI with category, radius, and keyword-based controls.
- Added infrastructure map visualization using Tmap markers and distance/path display logic.
- Implemented a 3D room viewing screen using a Spline iframe and a floor plan toggle.
- Added an admin prototype screen for property management UI exploration.
- Verified that the project builds successfully with `npm run build`.

## Reflect critically on any goals not accomplished.

### Frontend part

The frontend is still not connected to the real backend server because only the OpenAPI document is available and the server has not been deployed yet. Because of this, real API integration for property data, recommendation results, user preferences, favorites, infrastructure data, and 3D model URLs could not be completed.

Instead, the frontend currently validates the end-to-end user flow with mock data and dummy API-like structures. The next step is to align the frontend data types and API client structure with the OpenAPI specification so that the frontend can be connected quickly once the backend server is deployed.

Also, although the production build succeeds, lint errors and type warnings remain. These need to be resolved before the frontend can be considered stable enough for production-level integration.

## What are the goals for next two weeks?

### Frontend part

- Analyze the OpenAPI document and define matching TypeScript types.
- Create API client modules for property, recommendation, infrastructure, favorite, user preference, and 3D data.
- Convert current mock data into OpenAPI-compatible mock responses.
- Refactor screens to consume mock API functions instead of directly importing hardcoded data.
- Add loading, error, and empty states for future real API calls.
- Connect AI search flow to a mock recommendation API structure.
- Connect property detail, infrastructure, and 3D views through property ID-based mock API responses.
- Fix lint errors and reduce TypeScript warnings.
- Keep `npm run build` passing after refactoring.

## How many hours were spent on each goal noted above?

### Frontend part

- Route/page/component structure refactoring: 3 hours
- Extended user flow implementation after midterm: 5 hours
- Property detail, infrastructure view, and 3D view refinement: 5 hours
- Mock data and dummy API-like flow preparation: 3 hours
- Map marker, infrastructure, and route visualization work: 3 hours
- UI/UX and branding consistency refinement: 4 hours
- Build verification and issue checking: 1 hour
- OpenAPI-based integration planning: 2 hours
