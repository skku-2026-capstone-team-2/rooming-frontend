import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./styles/index.css";
import { router } from "./routes";
import { queryClient } from "./api/queryClient";
import { setOnUnauthorized } from "./api/http";
import { clearAuth } from "./store/authStore";

setOnUnauthorized(() => {
  clearAuth();
  window.location.href = "/";
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);
