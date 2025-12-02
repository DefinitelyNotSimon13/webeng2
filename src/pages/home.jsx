import React from "react";
import {
  Fab,
  FabButton,
  FabButtons,
  Icon,
  Link,
  NavLeft,
  NavRight,
  NavTitle,
  Navbar,
  Page,
  f7,
} from "framework7-react";
import {
  Map,
  CurrentLocationMarker,
  TargetLocationMarker,
} from "../components/map";
import CoordPicker from "../components/CoordPicker.jsx";
import SmallPopup from "../components/small-popup/SmallPopup.jsx";
import DefaultPopUp from "../components/DefaultPopUp.jsx";
import PoiList from "../components/poi-list.jsx";
import LocationContext from "../js/context.js";
import { useSettings } from "../components/settings";
import RoutingMachine from "../components/map/RoutingMachine.jsx";
import CalculateRouteButton from "../components/map/CalculateRouteButton.jsx";
import WaypointMarker from "../components/map/WaypointMarker.jsx";
import useLocationState from "../hooks/useLocationState.js";
import RoutePlaceholder from "../components/map/RoutePlaceholder.jsx";

const HomePage = () => {
  const settings = useSettings();

  const { contextValue, fullRoute, calculateRoute, clearRoute } =
    useLocationState(settings);

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

      <LocationContext.Provider value={contextValue}>
        <SmallPopup id="coord-popup" title="Insert Coordinates">
          <CoordPicker />
        </SmallPopup>

        <DefaultPopUp id="POI-list" title="Nearby Points of Interest">
          <PoiList />
        </DefaultPopUp>

        <Map enableGeolocation={settings.enableGeolocation ?? true}>
          <CurrentLocationMarker />
          <TargetLocationMarker />
          <RoutePlaceholder />
          <WaypointMarker />
          <RoutingMachine waypoints={fullRoute} />
        </Map>
        <CalculateRouteButton
          onCalculateRoute={calculateRoute}
          onClearRoute={clearRoute}
        />
      </LocationContext.Provider>

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
            label="Goto Coordinates"
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
