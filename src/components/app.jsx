import React from "react";

import { f7ready, App, View } from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";

import { SETTINGS_CONFIG } from "./settings";

import PoiList from "./poi-list";
import DefaultPopUp from "./DefaultPopUp";

const MyApp = () => {
  const f7params = {
    name: "Map App", // App name
    theme: "auto", // Automatic theme detection

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

      {/* Popup */}
      <DefaultPopUp id="POI-list" title="Nearby Points of Interest">
        <PoiList
          items={[
            {
              title: "POI 1",
              description: "Description for POI 1",
              image:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/TestingCup-Polish-Championship-in-Software-Testing-Katowice-2016.jpg/250px-TestingCup-Polish-Championship-in-Software-Testing-Katowice-2016.jpg",
              link: "https://google.com",
            },
            {
              title: "POI 1",
              description: "Description for POI 1",
              image:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/TestingCup-Polish-Championship-in-Software-Testing-Katowice-2016.jpg/250px-TestingCup-Polish-Championship-in-Software-Testing-Katowice-2016.jpg",
              link: "https://google.com",
            },
          ]}
        />
      </DefaultPopUp>
    </App>
  );
};
export default MyApp;
