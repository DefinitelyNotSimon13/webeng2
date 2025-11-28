import React from "react";
import { useContext } from "react";
import LocationContext from "../../js/context";
import { Marker, Popup } from "react-leaflet";
import { createMarkerIcon } from "./customMarkerIcon";

const currentLocationIcon = createMarkerIcon("#3182ce");

export default function CurrentLocationMarker() {
  const { currentLocation } = useContext(LocationContext);
  return (
    <>
      {currentLocation && (
        <Marker
          position={[currentLocation.lat, currentLocation.lng]}
          icon={currentLocationIcon}
        >
          <Popup>
            Current Position:
            {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </>
  );
}
