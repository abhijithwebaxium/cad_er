import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
// Manual registration to bypass DigitalOcean CDN cache using the build time.
// updateViaCache: "none" forces the browser to send Cache-Control: no-cache
// when fetching sw.js, which bypasses DigitalOcean's CDN edge cache.
if ("serviceWorker" in navigator) {
  const buildTime = typeof __BUILD_TIME__ !== "undefined" ? __BUILD_TIME__ : Date.now();
  const swUrl = `/sw.js?v=${encodeURIComponent(buildTime)}`;

  navigator.serviceWorker
    .register(swUrl, {
      // Forces browser to always bypass HTTP cache AND CDN cache when fetching sw.js
      updateViaCache: "none",
    })
    .then((reg) => {
      console.log("Service Worker registered:", reg.scope);

      // Check for updates every 1 hour
      setInterval(() => reg.update(), 60 * 60 * 1000);

      // Check for updates when the user switches back to the tab
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reg.update();
      });
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });

  // Reload page once the new service worker takes control.
  // registerType: "autoUpdate" makes the new SW call skipWaiting() automatically,
  // so this event fires as soon as the new SW is installed.
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
