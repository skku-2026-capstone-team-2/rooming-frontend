import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api";

export const userKeys = {
  seekerProfile: ["user", "seeker", "profile"] as const,
};

export function useSeekerProfile(enabled = true) {
  return useQuery({
    queryKey: userKeys.seekerProfile,
    queryFn: () => authApi.getSeekerProfile(),
    enabled,
  });
}
