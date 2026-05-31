import { createBrowserRouter } from "react-router";
import WelcomeScreen from "./pages/WelcomeScreen";
import OAuthRedirectScreen from "./pages/OAuthRedirectScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import MainMapScreen from "./pages/MainMapScreen";
import PropertyDetailScreen from "./pages/PropertyDetailScreen";
import InfraSearchModal from "./pages/InfraSearchModal";
import InfraViewScreen from "./pages/InfraViewScreen";
import ThreeDViewScreen from "./pages/ThreeDViewScreen";
import AdminScreen from "./pages/AdminScreen";
import AIResultScreen from "./pages/AIResultScreen";
import DesignSystemDemo from "./figma/DesignSystem";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomeScreen,
  },
  {
    path: "/oauth2/redirect",
    Component: OAuthRedirectScreen,
  },
  {
    path: "/onboarding",
    Component: OnboardingScreen,
  },
  {
    path: "/map",
    Component: MainMapScreen,
  },
  {
    path: "/ai-result",
    Component: AIResultScreen,
  },
  {
    path: "/property/:id",
    Component: PropertyDetailScreen,
  },
  {
    path: "/infra-search",
    Component: InfraSearchModal,
  },
  {
    path: "/infra-view",
    Component: InfraViewScreen,
  },
  {
    path: "/3d-view",
    Component: ThreeDViewScreen,
  },
  {
    path: "/admin",
    Component: AdminScreen,
  },
  {
    path: "/figma",
    Component: DesignSystemDemo,
  },
]);
