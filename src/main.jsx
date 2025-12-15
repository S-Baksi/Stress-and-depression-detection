import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

/* Global styles (Tailwind / base styles / fonts) */
import "./index.css";

import App from "./App";

/*
  Root entry point
  - StrictMode enabled for development best practices
  - BrowserRouter for client-side routing
  - Clean, minimal, production-ready setup
*/

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
