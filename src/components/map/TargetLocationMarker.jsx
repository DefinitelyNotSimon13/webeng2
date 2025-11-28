import React from "react";
import { useContext } from "react";
import LocationContext from "../../js/context";
import { Marker, Popup } from "react-leaflet";
import { createMarkerIcon } from "./customMarkerIcon";

const targetLocationIcon = createMarkerIcon("#e53e3e");

export default function TargetLocationMarker() {
  const { targetLocation } = useContext(LocationContext);
  return (
    <>
      {targetLocation && (
        <Marker
          position={[targetLocation.lat, targetLocation.lng]}
          icon={targetLocationIcon}
        >
          <Popup>
            Target Position:
            {targetLocation.lat.toFixed(5)}, {targetLocation.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </>
  );
}
