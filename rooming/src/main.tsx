import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./styles/index.css";
import { router } from "./routes";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);