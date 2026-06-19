import type { RecommendationResult } from "../types";

export function parseRecommendationId(value: string | null): number | null {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function parsePropertyId(value: string | null): number | null {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function findRecommendationForProperty({
  propertyId,
  recommendationId,
  groups,
}: {
  propertyId: number;
  recommendationId: number | null;
  groups: RecommendationResult[][];
}): RecommendationResult | null {
  const recommendations = groups.flat();

  if (recommendationId != null) {
    const matchedById = recommendations.find(
      (recommendation) =>
        recommendation.recommendationId === recommendationId &&
        recommendation.propertyId === propertyId
    );
    if (matchedById) return matchedById;
  }

  return (
    recommendations.find(
      (recommendation) =>
        recommendation.propertyId === propertyId && recommendation.favorite
    ) ??
    recommendations.find(
      (recommendation) => recommendation.propertyId === propertyId
    ) ??
    null
  );
}
