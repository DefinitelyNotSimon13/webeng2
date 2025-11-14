import React from "react";
import { useContext } from "react";
import LocationContext from "../../js/context";
import { Marker, Popup } from "react-leaflet";

export default function CurrentLocationMarker() {
  const { currentLocation } = useContext(LocationContext);
  return (
    <>
      {currentLocation && (
        <Marker position={[currentLocation.lat, currentLocation.lng]}>
          <Popup>
            Current Position:
            {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </>
  );
}
