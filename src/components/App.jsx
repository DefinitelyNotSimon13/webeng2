import React from "react";

import { f7ready, App, View } from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";
import { SETTINGS_CONFIG } from "./settings";

const MyApp = () => {
  const f7params = {
    name: "Map App", // App name
    theme: "md", // Always use Material-Design, because iOS is overrated

    // App store
    store: store,
    // App routes
    routes: routes,

    serviceWorker:
      import.meta.env.MODE === "production"
        ? {
            path: "/service-worker.js",
          }
        : {},
  };

  f7ready(() => {
    store.dispatch("loadSettings", SETTINGS_CONFIG);
  });

  return (
    <App {...f7params}>
      {/* Your main view, should have "view-main" class */}
      <View main className="safe-areas" url="/"></View>
    </App>
  );
};
export default MyApp;
