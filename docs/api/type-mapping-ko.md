# 더미 데이터 ↔ OpenAPI 타입 매핑

이 문서는 기존 더미 데이터 구조([src/data/dummyProperties.ts](../../src/data/dummyProperties.ts), [src/data/dummyFavorites.ts](../../src/data/dummyFavorites.ts), [src/data/dummyInfraPlaces.ts](../../src/data/dummyInfraPlaces.ts))와 OpenAPI(`docs/api/openapi.yaml`) 스키마의 차이를 정리한 것이다. 실제 API 연동 시(FE-02 이후) mapper/adapter에서 이 차이를 흡수해야 한다.

API 타입 정의: [src/types/api.ts](../../src/types/api.ts) · 화면용 타입: [src/types/view.ts](../../src/types/view.ts)

## 1. Property (매물)

기준: 더미 `Property` (dummyProperties.ts) → OpenAPI `Property` / `PropertyDetail`

| 더미 필드 | 타입(더미) | OpenAPI 필드 | 타입(OpenAPI) | 비고 |
|-----------|-----------|--------------|---------------|------|
| `id` | number | `propertyId` | number | 이름 변경 |
| `title` | string | `title` | string | 동일 |
| `price` | string `"500 / 55"` | `deposit` + `monthlyRent` + `tradeType` | number, number, enum | 문자열 → 숫자 분리. 라벨 가공은 view에서 |
| `area` | string `"23.5m²"` | `areaM2` | number | 문자열 → 숫자 |
| `distance` | string `"11분"` | (매물 필드 아님) | — | 거리/소요시간은 매물이 아니라 `RecommendationTargetPlaceRoute.durationMinutes`에서 파생 |
| `description` | string | `description` | string \| null | nullable |
| `image` | string? | `imageUrls` | string[] \| null | 목록은 배열. 상세 이미지는 `GET /properties/{id}/images` |
| `lat`/`lng` | number | `latitude`/`longitude` | number \| null | 목록만 보유, `PropertyDetail`에는 없음 |
| — | — | `roomType`, `floorInfo`, `maintenanceFee`, `tags`, `has3DModel`, `splineUrl` | 다양 | 더미에 없던 필드 |

> 추천 이유: 더미에는 매물에 직접 없지만, OpenAPI에서는 매물이 아니라 `RecommendationResult.explanation`에 있다. (FE-03에서 화면 책임 분리)

## 2. Favorite / Recommendation (찜·추천)

기준: 더미 `FavoriteItem.snapshot` (dummyFavorites.ts) → OpenAPI `RecommendationResult`

| 더미 필드 | OpenAPI 대응 | 비고 |
|-----------|--------------|------|
| `favoriteId` | `recommendationId` + `favorite: boolean` | 찜은 saved recommendation의 favorite 상태 |
| `snapshot.{title, roadAddress, location, price, areaM2}` | `RecommendationResult.property` (`RecommendationPropertyDetails`) | `price` 객체 → `tradeType`/`depositAmount`/`monthlyRent`/`maintenanceFee` |
| `snapshot.price.transactionType` | `tradeType` | 더미는 `"MONTHLY_RENT"`만, OpenAPI는 `MONTHLY_RENT \| DEPOSIT_BASIS` |
| `snapshot.matchScore` (number) | **없음** | OpenAPI에 매칭 점수 필드 없음. 제거 대상 |
| `snapshot.matchReasons` (string[]) | `explanation` (string) | 배열 → 단일 문자열 |
| `snapshot.standardInfra` + `runtimeInfra` | `infrastructures` (단일 배열) | 두 배열 통합. 요소 타입은 `RecommendationInfrastructureDetails` |
| `snapshot.keyPlaceRoutes[]` | `firstTargetPlaceRoute` (단일) | 배열 → 첫 목적지 1건 요약. 전체 geometry는 `GET /recommendations/{id}/route` |
| `snapshot.hasProperty3D` | `Property.has3DModel` | 이름 변경 |
| `snapshot.property3D.{viewerUrl, assetUrl, thumbnailUrl}` | `Property3D.{modelUrl, modelType, previewImageUrl}` | 3D는 별도 endpoint `GET /properties/{id}/3d` |
| `createdAt`/`updatedAt` | **없음** | OpenAPI 추천 결과에 타임스탬프 없음 |

## 3. Infra (인프라)

기준: 더미 `InfraPlace` (dummyInfraPlaces.ts) / `InfraItem` (dummyFavorites.ts) → OpenAPI `RecommendationInfrastructureDetails`

| 더미 | OpenAPI | 비고 |
|------|---------|------|
| `InfraPlace.type` `"cafe"\|"gym"\|"store"\|"bus"` (소문자) | `category` `CAFE\|GYM\|MART\|...` (대문자 enum) | 값 체계 전면 변경. OpenAPI enum 12종(`CONVENIENT_STORE, MART, PHARMACY, HOSPITAL, LAUNDRY, CAFE, SUBWAY, BANK, GYM, KARAOKE, PC_ROOM, ETC`) |
| `InfraItem.category` `"CONVENIENCE_STORE"\|"FOOD"\|"BUS_STOP"...` | `category` enum | 더미 값(`CONVENIENCE_STORE`, `FOOD`, `BUS_STOP`)은 OpenAPI enum과 **불일치** — `CONVENIENT_STORE` 등으로 매핑 필요 |
| `label`/`name` | `name` | string \| null |
| `distance` `"도보 5분"` (문자열) | `walkingMinutes` (number) | 문자열 → 숫자. 라벨은 view에서 가공 |
| `location` | `location` (`CoordinateDto`) | 동일 구조 |

## 4. TransportMode (이동 수단)

| 더미 | OpenAPI | 비고 |
|------|---------|------|
| `"WALK" \| "TRANSIT"` | `"PUBLIC_TRANSPORT" \| "WALK"` | `TRANSIT` → `PUBLIC_TRANSPORT` 로 매핑 |

## 5. Route (경로)

기준: 더미 `RouteJson`/`RoutePath` → OpenAPI `RecommendationTargetPlaceRoute`(요약) / `RecommendationRoutePath`(geometry)

| 더미 필드 | OpenAPI 대응 | 비고 |
|-----------|--------------|------|
| `RouteJson.totalTime` | `durationMinutes` / `totalTime` | 분 단위 |
| `RouteJson.totalDistance` | **없음**(요약) | 요약 경로엔 총거리 필드 없음, 구간별 `distance`만 |
| `RouteJson.payment` | **없음** | OpenAPI에 요금 필드 없음 |
| `RoutePath.stationCount` | `transferCount`(경로 단위) | 의미 차이 — 환승 횟수는 경로 레벨 |
| `RoutePath.{type, time, distance, lane}` | `RecommendationRouteSubPath*.{type, time, distance, lane}` | 구간 단위. type enum: `SUBWAY\|BUS\|WALK\|UNKNOWN` |
| — | `points: CoordinateDto[]` | geometry 표시용 좌표 배열 (`detail=SUMMARY\|DETAIL`) |

## 요약: 후속 작업에 필요한 핵심 변환

1. **문자열 → 숫자 분리**: 가격(`price`)·면적(`area`)·거리(`distance`)는 OpenAPI에서 숫자이며, 라벨 가공은 view model에서 수행한다.
2. **추천 = saved recommendation**: 찜/추천 이유/인프라/경로는 모두 `RecommendationResult` 하위에 있다. 별도 favoriteApi/infraApi는 없다.
3. **enum 정규화**: infra category·transport mode·trade type의 더미 값을 OpenAPI enum으로 매핑해야 한다.
4. **3D 분리**: 3D는 매물 하위 endpoint(`/properties/{id}/3d`)이며 `modelUrl/modelType/previewImageUrl`을 쓴다.
5. **제거 대상**: `matchScore`, route `payment`, `createdAt/updatedAt` 등 OpenAPI에 없는 필드.
