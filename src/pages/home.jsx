import React from "react";
import {
  Page,
  Navbar,
  NavRight,
  NavLeft,
  NavTitle,
  Link,
  Block,
  Button,
  Popup,
} from "framework7-react";
import ExampleSettingsUsage from "../components/settings/ExampleSettingsUsage";
import Map from "../../src/components/Map.jsx";
import CoordPicker from "../components/coordPicker";
import SmallPopup from "../components/small-popup/SmallPopup.jsx";

const HomePage = () => {
  const handleSearch = (coords) => {
    console.log("Search coords:", coords);
  };

  return (
    <Page name="home">
      <Navbar>
        <NavRight>
          <Link
            iconIos="f7:doc"
            iconMd="material:description"
            openIn="sheet"
            href="/about/"
          />
          <Link
            iconIos="f7:settings"
            iconMd="material:settings"
            openIn="panel"
            href="/settings/"
          />
        </NavRight>
        <NavLeft>
          <img className="nav-icon" src="/icons/favicon.png" />
        </NavLeft>
        <NavTitle>Map</NavTitle>
      </Navbar>

      <Button className="coord-fab" fill popupOpen="#coord-popup" small>
        Coord
      </Button>

      <SmallPopup id="coord-popup" title="CHANGEMEEE">
        <CoordPicker onSearch={handleSearch} />
      </SmallPopup>

      <Block strong inset>
        <Map
          initialCenter={{ lat: 47.651, lng: 9.479 }}
          initialZoom={13}
          autoLocate={true}
        />
      </Block>

      <ExampleSettingsUsage />

      <Button className="poi-fab" fill popupOpen="#POI-list" small>
        POIs
      </Button>
    </Page>
  );
};

export default HomePage;
