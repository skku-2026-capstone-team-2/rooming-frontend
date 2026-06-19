import { useQuery } from "@tanstack/react-query";
import { targetPlaceApi } from "../../api";

export const targetPlaceKeys = {
  list: ["target-places"] as const,
};

export function useTargetPlaces(enabled = true) {
  return useQuery({
    queryKey: targetPlaceKeys.list,
    queryFn: () => targetPlaceApi.getTargetPlaces(),
    enabled,
    retry: false,
  });
}
