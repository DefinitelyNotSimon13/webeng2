import React, { useEffect, useRef } from "react";
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
  Button,
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
import PoiList from "../components/PoiList.jsx";
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

  const notifRef = useRef(null);
  const requestLocationRetry = () => {
    if (!navigator?.geolocation) {
      contextValue?.setLocationError?.(
        "Geolocation is not supported by this browser.",
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        contextValue?.setCurrentLocation?.({ lat, lng });
        contextValue?.setCenterLocation?.({ lat, lng });
        contextValue?.setLocationError?.(null);
      },
      (err) => {
        const msg =
          "Location access not possible — please allow location access in your browser/device settings.";
        if (contextValue?.setLocationError) {
          contextValue.setLocationError(null);
          setTimeout(() => contextValue.setLocationError(msg), 50);
        }
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
    );
  };
  useEffect(() => {
    const msg = contextValue?.locationError;
    if (msg) {
      try {
        if (notifRef.current) {
          notifRef.current.close();
        }
        notifRef.current = f7.notification.create({
          text: msg,
          position: "top",
          closeTimeout: 0,
          closeButton: true,
        });
        notifRef.current.open();
      } catch (e) {
        console.warn("Failed to show Framework7 notification:", e);
      }
    } else {
      if (notifRef.current) {
        notifRef.current.close();
        notifRef.current = null;
      }
    }

    return () => {
      if (notifRef.current) {
        notifRef.current.close();
        notifRef.current = null;
      }
    };
  }, [contextValue?.locationError]);

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
          <img className="nav-icon" src="icon.webp" />
        </NavLeft>
        <NavTitle>Map</NavTitle>
      </Navbar>

      {contextValue?.locationError && (
        <Button
          className="retry-location-btn"
          fill
          small
          onClick={requestLocationRetry}
          aria-label="Retry Location Request"
        >
          Retry Location Request
        </Button>
      )}

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
          <FabButton
            label="Center"
            onClick={() => {
              const loc = contextValue?.currentLocation;
              if (!loc) return;
              contextValue?.setCenterLocation?.({ ...loc });
            }}
          >
            <Icon ios="f7:locate" md="material:my_location" />
          </FabButton>
        </FabButtons>
      </Fab>
    </Page>
  );
};

export default HomePage;
