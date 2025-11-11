import React from "react";

import {
  f7ready,
  App,
  Panel,
  View,
  Page,
  Navbar,
  Block,
  List,
  ListItem,
} from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";
import PoiList from "./poi-list";
import DefaultPopUp from "./DefaultPopUp";

const MyApp = () => {
  // Framework7 Parameters
  const f7params = {
    name: "Map App", // App name
    theme: "auto", // Automatic theme detection

    // App store
    store: store,
    // App routes
    routes: routes,

    // Register service worker (only on production build)
    serviceWorker:
      import.meta.env.MODE === "production"
        ? {
            path: "/service-worker.js",
          }
        : {},
  };

  f7ready(() => {
    // Call F7 APIs here
  });

  return (
    <App {...f7params}>
      {/* Left panel with cover effect*/}
      <Panel left cover dark>
        <View>
          <Page>
            <Navbar title="Menu" />
            <Block>Left panel content goes here</Block>
            <List strong inset dividersIos>
              <ListItem link="/about/" title="About" />
              <ListItem link="/settings/" title="Settings" />
            </List>
          </Page>
        </View>
      </Panel>

      {/* Your main view, should have "view-main" class */}
      <View main className="safe-areas" url="/">
        <title>MapP</title>
      </View>

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
