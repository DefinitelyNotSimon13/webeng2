import React from "react";
import {
  Page,
  Navbar,
  NavRight,
  NavLeft,
  NavTitle,
  Link,
  Block,
  Icon,
  Fab,
  FabButton,
  FabButtons,
  f7,
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
            iconIos="f7:info_circle"
            iconMd="material:info"
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

      <SmallPopup id="coord-popup" title="Insert Coordinates">
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

      <Fab position="right-bottom" slot="fixed">
        <Icon ios="f7:placemark_fill" md="material:location_pin" />
        <Icon ios="f7:xmark" md="material:close" />
        <FabButtons position="top">
          <FabButton
            label="POIs"
            onClick={() => {
              f7.popup.open("#POI-list");
            }}
          >
            <Icon ios="f7:compass_fill" md="material:explore" />
          </FabButton>
          <FabButton
            label="Insert Coordinates"
            onClick={() => {
              f7.popup.open("#coord-popup");
            }}
          >
            <Icon ios="f7:globe" md="material:language" />
          </FabButton>
        </FabButtons>
      </Fab>
    </Page>
  );
};

export default HomePage;
