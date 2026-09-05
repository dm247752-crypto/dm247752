import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Native-app feel: disable browser pinch / double-tap zoom in WebView and mobile browsers.
const preventZoom = (event: Event) => event.preventDefault();
document.addEventListener("gesturestart", preventZoom, { passive: false });
document.addEventListener("gesturechange", preventZoom, { passive: false });
document.addEventListener("gestureend", preventZoom, { passive: false });
document.addEventListener(
  "wheel",
  (event) => {
    if (event.ctrlKey) event.preventDefault();
  },
  { passive: false }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
