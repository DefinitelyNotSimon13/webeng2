// src/components/App.jsx
// Framework7-React app merged with the Leaflet React component
// Renders a prominent box "Request Data & Load" and shows the map directly below it.
// Uses only components available in framework7-react (no Card to avoid undefined component issues).
// No inline styles; layout via CSS (see src/css/leaflet_map.css)

import React, { useState } from "react";
import {
  f7,
  f7ready,
  App as F7App,
  Panel,
  View,
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListInput,
  ListButton,
  BlockFooter,
} from "framework7-react";

import LeafletMap from "./LeafletMap";
import "../css/leaflet_map.css"; // ensure map styles are present

import routes from "../js/routes";
import store from "../js/store";

const MyApp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const f7params = {
    name: "Map App",
    theme: "auto",
    store,
    routes,
    serviceWorker:
      import.meta.env.MODE === "production"
        ? { path: "/service-worker.js" }
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
    // Hook Framework7 APIs if needed
  });

  return (
    <F7App {...f7params}>
      {/* Left panel */}
      <Panel left cover dark>
        <View>
          <Page>
            <Navbar title="Left Panel" />
            <Block>Left panel content goes here</Block>
          </Page>
        </View>
      </Panel>

      {/* Right panel */}
      <Panel right reveal dark>
        <View>
          <Page>
            <Navbar title="Right Panel" />
            <Block>Right panel content goes here</Block>
          </Page>
        </View>
      </Panel>

      {/* Main View with the requested UI: box + map below */}
      <View main className="safe-areas">
        <Page>
          <Navbar title="Map" />

          {/* The requested box (Block instead of Card) */}
          <Block className="request-box" strong inset>
            <p>
              <b>Request Data &amp; Load</b>
            </p>
            <p>Provide request parameters here, then load data.</p>
          </Block>

          {/* Map directly below the box */}
          <BlockTitle>Map</BlockTitle>
          <div className="appRoot mapSection">
            <LeafletMap
              initialCenter={[47.651, 9.479]}
              initialZoom={13}
              enableGeolocation={true}
              onMapClick={(latlng) => {
                // TODO: integrate with routing/POI once implemented
                // TEST: should log lat and lng numbers
                console.log(
                  "User clicked:",
                  latlng.lat.toFixed(5),
                  latlng.lng.toFixed(5),
                );
              }}
            />
          </div>
        </Page>
      </View>

      {/* Popup */}
      <Popup id="my-popup">
        <View>
          <Page>
            <Navbar title="Popup">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>
              <p>Popup content goes here.</p>
            </Block>
          </Page>
        </View>
      </Popup>

      {/* Login Screen */}
      <LoginScreen id="my-login-screen">
        <View>
          <Page loginScreen>
            <LoginScreenTitle>Login</LoginScreenTitle>
            <List form>
              <ListInput
                type="text"
                name="username"
                placeholder="Your username"
                value={username}
                onInput={(e) => setUsername(e.target.value)}
              />
              <ListInput
                type="password"
                name="password"
                placeholder="Your password"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
              />
            </List>
            <List>
              <ListButton title="Sign In" onClick={() => alertLoginData()} />
              <BlockFooter>
                Some text about login information.
                <br />
                Click &quot;Sign In&quot; to close Login Screen
              </BlockFooter>
            </List>
          </Page>
        </View>
      </LoginScreen>
    </F7App>
  );
};

export default MyApp;
