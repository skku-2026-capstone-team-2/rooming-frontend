import { propertyApi } from "../api";
import { mapPropertyToCardView } from "../api/mappers/propertyMapper";
import { favoriteListDummyData } from "../data/dummyFavorites";
import type { PropertyCardView } from "../types";

export type ListMode = "recommended" | "favorites";

function formatPriceToManwon(value: number) {
  return `${Math.floor(value / 10000)}`;
}

/**
 * 지도 전체(추천) 매물 목록.
 *
 * `GET /api/v1/properties` 응답을 카드 view model로 변환한다.
 * mock ↔ real 전환은 propertyApi 내부(USE_MOCK)에서 처리된다.
 */
export async function fetchRecommendedProperties(): Promise<PropertyCardView[]> {
  const properties = await propertyApi.getProperties();
  return properties.map(mapPropertyToCardView);
}

/**
 * MY(찜) 매물 목록.
 *
 * 찜/추천은 recommendation 도메인이라 실제 API 연동은 후속 이슈에서 다룬다.
 * 여기서는 더미 snapshot을 카드 view model로 변환만 한다.
 */
export function getFavoriteProperties(): PropertyCardView[] {
  return favoriteListDummyData.data.map((favorite) => {
    const { snapshot } = favorite;

    const depositText = formatPriceToManwon(snapshot.price.depositAmount);
    const monthlyRentText = formatPriceToManwon(snapshot.price.monthlyRent);

    const mainImage =
      snapshot.images.find((image) => image.isMain)?.imageUrl ??
      snapshot.images[0]?.imageUrl ??
      null;

    const routeMinutes = snapshot.keyPlaceRoutes[0]?.routeJson.totalTime;
    const explanation = snapshot.matchReasons.join(" · ");

    return {
      propertyId: snapshot.propertyId,
      title: snapshot.title,
      address: snapshot.roadAddress,
      tradeType: snapshot.price.transactionType,
      priceLabel: `${depositText} / ${monthlyRentText}`,
      areaLabel: `${snapshot.areaM2}㎡`,
      description: explanation,
      imageUrl: mainImage,
      lat: snapshot.location.latitude,
      lng: snapshot.location.longitude,
      tags: [],
      has3DModel: snapshot.hasProperty3D,
      favorite: true,
      explanation,
      routeDurationLabel:
        routeMinutes !== undefined ? `${routeMinutes}분` : null,
    };
  });
}
