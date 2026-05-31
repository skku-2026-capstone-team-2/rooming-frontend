import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { setAuth } from "../store/authStore";
import type { AccountType } from "../types";

export default function OAuthRedirectScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const rawType = searchParams.get("accountType");
    const profileComplete = searchParams.get("profileComplete") === "true";

    if (rawType !== "SEEKER" && rawType !== "BROKER") {
      navigate("/", { replace: true });
      return;
    }

    const accountType = rawType as AccountType;
    setAuth({ accountType, profileComplete });

    if (accountType === "SEEKER") {
      navigate(profileComplete ? "/map" : "/onboarding", { replace: true });
    } else {
      navigate("/admin", { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-text-tertiary">로그인 처리 중...</p>
    </div>
  );
}
