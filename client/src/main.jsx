import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
// Manual registration to bypass DigitalOcean CDN cache using the build time
if ("serviceWorker" in navigator) {
  const buildTime = typeof __BUILD_TIME__ !== "undefined" ? __BUILD_TIME__ : Date.now();
  const swUrl = `/sw.js?v=${encodeURIComponent(buildTime)}`;

  navigator.serviceWorker.register(swUrl)
    .then((reg) => {
      console.log("Service Worker registered with scope:", reg.scope);

      // 1. Check for updates every 1 hour
      setInterval(() => {
        reg.update();
      }, 60 * 60 * 1000);

      // 2. Check for updates whenever the user switches back to the tab
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          reg.update();
        }
      });

      // 3. Handle updates
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // A new service worker is waiting, force it to skip waiting and activate
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        }
      });
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });

  // Reload the page once the new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(

  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StrictMode>
          <App />
        </StrictMode>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>,
);
