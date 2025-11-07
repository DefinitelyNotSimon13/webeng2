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

      <Popup id="coord-popup">
        <Page>
          <Navbar>
            <NavLeft>
              <Link iconIos="f7:close" iconMd="material:close" popupClose />
            </NavLeft>
            <NavTitle>Koordinaten</NavTitle>
          </Navbar>
          <Block>
            <CoordPicker onSearch={handleSearch} />
          </Block>
        </Page>
      </Popup>

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
