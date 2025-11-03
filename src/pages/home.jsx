import React from "react";
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Button,
} from "framework7-react";

import LeafletMap from "../components/LeafletMap";
import "../css/leaflet_map.css";

const HomePage = () => (
  <Page name="home">
    {/* Top Navbar */}
    <Navbar large sliding={false}>
      <NavLeft>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
      </NavLeft>
      <NavTitle sliding>My App</NavTitle>
      <NavRight>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="right" />
      </NavRight>
      <NavTitleLarge>My App</NavTitleLarge>
    </Navbar>

    {/* Toolbar */}
    <Toolbar bottom>
      <Link>Left Link</Link>
      <Link>Right Link</Link>
    </Toolbar>

    {/* Page content */}
    <Block>
      <p>
        Here is your blank Framework7 app. Let&apos;s see what we have here.
      </p>
    </Block>

    <BlockTitle>Navigation</BlockTitle>
    <List strong inset dividersIos>
      <ListItem link="/about/" title="About" />
      <ListItem link="/form/" title="Form" />
    </List>

    <BlockTitle>Modals</BlockTitle>
    <Block className="grid grid-cols-2 grid-gap">
      <Button fill popupOpen="#my-popup">
        Popup
      </Button>
      <Button fill loginScreenOpen="#my-login-screen">
        Login Screen
      </Button>
    </Block>

    <BlockTitle>Panels</BlockTitle>
    <Block className="grid grid-cols-2 grid-gap">
      <Button fill panelOpen="left">
        Left Panel
      </Button>
      <Button fill panelOpen="right">
        Right Panel
      </Button>
    </Block>

    <List strong inset dividersIos>
      <ListItem
        title="Dynamic (Component) Route"
        link="/dynamic-route/blog/45/post/125/?foo=bar#about"
      />
      <ListItem
        title="Default Route (404)"
        link="/load-something-that-doesnt-exist/"
      />
      <ListItem
        title="Request Data & Load"
        link="/request-and-load/user/123456/"
      />
    </List>

    {/* Map directly below the request box */}
    <BlockTitle>Map</BlockTitle>
    <div className="mapSection">
      <LeafletMap
        initialCenter={[47.651, 9.479]}
        initialZoom={13}
        enableGeolocation={true}
        onMapClick={(latlng) => {
          // Minimal test: logs coordinates, later can start routing or show POIs
          console.log(
            "User clicked:",
            latlng.lat.toFixed(5),
            latlng.lng.toFixed(5),
          );
        }}
      />
    </div>
  </Page>
);

export default HomePage;
