import React from "react";
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  Link,
  Block,
  Button,
} from "framework7-react";

const HomePage = () => (
  <Page name="home">
    {/* Top Navbar */}
    <Navbar>
      <NavLeft>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
      </NavLeft>
      <NavTitle>MapP</NavTitle>
    </Navbar>

    <Block>
      <p>Map here</p>
    </Block>

    {/* Floating POI button */}
    <Button className="poi-fab" fill popupOpen="#POI-list" small>
      POIs
    </Button>
  </Page>
);
export default HomePage;
