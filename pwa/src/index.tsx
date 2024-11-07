import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import reportWebVitals from './reportWebVitals';

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ErrorBoundary } from "./Components/ErrorBoundary";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <ErrorBoundary
      onError={() => {
        localStorage.clear();
        document.location.reload();
      }}
      actionText="Odhlásit a restartovat rozhraní"
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
