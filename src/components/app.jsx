import React from "react";

import {
  f7ready,
  App,
  View,
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
} from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";
import { SETTINGS_CONFIG } from "./settings";

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
      <Popup id="POI-list">
        <View>
          <Page>
            <Navbar title="POI List">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>
              <p>POI list here.</p>
            </Block>
          </Page>
        </View>
      </Popup>
    </App>
  );
};
export default MyApp;
