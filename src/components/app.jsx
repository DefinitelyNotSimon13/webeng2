import React, { useState, useEffect } from "react";

import {
  f7,
  f7ready,
  App,
  Panel,
  View,
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
  List,
  ListItem,
} from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";

const MyApp = () => {
  // Login screen demo data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Framework7 Parameters
  const f7params = {
    name: "My App", // App name
    theme: "auto", // Automatic theme detection

    // App store
    store: store,
    // App routes
    routes: routes,

    // Register service worker (only on production build)
    serviceWorker:
      process.env.NODE_ENV === "production"
        ? {
            path: "/service-worker.js",
          }
        : {},
  };
  const alertLoginData = () => {
    f7.dialog.alert(
      "Username: " + username + "<br>Password: " + password,
      () => {
        f7.loginScreen.close();
      },
    );
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
