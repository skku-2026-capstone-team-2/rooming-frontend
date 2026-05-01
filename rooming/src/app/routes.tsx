import { createBrowserRouter } from "react-router";
import WelcomeScreen from "./pages/WelcomeScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import MainMapScreen from "./pages/MainMapScreen";
import AIPanelScreen from "./components/AIPanel";
import ResultScreen from "./pages/ResultScreen";
import PropertyDetailScreen from "./pages/PropertyDetailScreen";
import InfraSearchModal from "./pages/InfraSearchModal";
import InfraViewScreen from "./pages/InfraViewScreen";
import ThreeDViewScreen from "./pages/ThreeDViewScreen";
import AdminScreen from "./pages/AdminScreen";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomeScreen,
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
    path: "/ai-search",
    Component: AIPanelScreen,
  },
  {
    path: "/ai-panel",
    Component: AIPanelScreen,
  },
  {
    path: "/results",
    Component: ResultScreen,
  },
  {
    path: "/property/:id",
    Component: PropertyDetailScreen,
  },
  {
    path: "/property-detail",
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
]);