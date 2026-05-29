# API 문서

백엔드에서 전달받은 OpenAPI 문서는 이 디렉터리에서 관리한다.

- 최신 명세: [openapi.yaml](./openapi.yaml)
- API 버전: Rooming API `0.2.0`
- 로컬 서버: `http://localhost:8080`
- 인증 방식: `Authorization: Bearer ...` 또는 `ROOMING_ACCESS_TOKEN` 쿠키

## 프론트엔드 연동 기준

- Property: `/api/v1/properties`, `/api/v1/properties/{id}`, `/api/v1/properties/{id}/images`, `/api/v1/properties/{id}/3d`
- Recommendation: `/api/v1/recommendations`, `/api/v1/recommendations/favorites`, `/api/v1/recommendations/{recommendationId}/route`, `/api/v1/recommendations/{recommendationId}/favorite`
- Target Places: `/api/v1/user/seeker/target-place`, `/api/v1/user/seeker/target-place/{targetPlaceId}`
- Auth/Profile: `/api/v1/auth/*`, `/oauth2/redirect`, `/api/v1/user/*/me`
- Broker/Admin: `/api/v1/broker-offices`, `/api/v1/user/broker/me/properties`

현재 명세에는 독립적인 `infra`, `favorite`, `user preference` API가 따로 있지 않다. 인프라와 경로는 recommendation 응답 및 route endpoint에 포함되고, 찜은 saved recommendation의 favorite 상태로 제공되며, 사용자 주요 장소는 target-place API로 관리한다.
