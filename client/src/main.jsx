import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { registerSW } from "virtual:pwa-register";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Automatically triggers the new service worker to take control and reloads the page
    if (updateSW) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Offline ready");
  },
});

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
