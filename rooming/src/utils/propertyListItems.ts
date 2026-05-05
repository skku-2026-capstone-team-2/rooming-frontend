import { properties as dummyProperties } from "../data/dummyProperties";
import { favoriteListDummyData } from "../data/dummyFavorites";

export type ListMode = "recommended" | "favorites";

export type PropertyListItem = {
  id: number;
  title: string;
  price: string;
  description?: string;
  area?: string;
  distance?: string;
  lat: number;
  lng: number;
  mode: ListMode;
  matchScore?: number;
};

function formatPriceToManwon(value: number) {
  return `${Math.floor(value / 10000)}`;
}

function getRecommendedProperties(): PropertyListItem[] {
  return dummyProperties.slice(0, 3).map((property) => ({
    id: property.id,
    title: property.title,
    price: property.price,
    description: property.description,
    area: property.area,
    distance: property.distance,
    lat: property.lat,
    lng: property.lng,
    mode: "recommended",
  }));
}

function getFavoriteProperties(): PropertyListItem[] {
  return favoriteListDummyData.data.slice(0, 3).map((favorite) => {
    const { snapshot } = favorite;

    const depositText = formatPriceToManwon(snapshot.price.depositAmount);
    const monthlyRentText = formatPriceToManwon(snapshot.price.monthlyRent);

    return {
      id: snapshot.propertyId,
      title: snapshot.title,
      price: `${depositText} / ${monthlyRentText}`,
      description: snapshot.matchReasons.join(" · "),
      area: `${snapshot.areaM2}㎡`,
      distance:
        snapshot.keyPlaceRoutes[0]?.routeJson.totalTime !== undefined
          ? `${snapshot.keyPlaceRoutes[0].routeJson.totalTime}분`
          : undefined,
      lat: snapshot.location.latitude,
      lng: snapshot.location.longitude,
      mode: "favorites",
      matchScore: snapshot.matchScore,
    };
  });
}

export function getPropertiesByListMode(listMode: ListMode): PropertyListItem[] {
  return listMode === "recommended"
    ? getRecommendedProperties()
    : getFavoriteProperties();
}