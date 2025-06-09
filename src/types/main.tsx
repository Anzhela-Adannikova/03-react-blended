import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import "modern-normalize";
import App from "../components/App/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClients = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClients}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
