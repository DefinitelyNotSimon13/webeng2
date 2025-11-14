import React from "react";
import { useContext } from "react";
import LocationContext from "../../js/context";
import { Marker, Popup } from "react-leaflet";

export default function TargetLocationMarker() {
  const { targetLocation } = useContext(LocationContext);
  return (
    <>
      {targetLocation && (
        <Marker position={[targetLocation.lat, targetLocation.lng]}>
          <Popup>
            Target Position:
            {targetLocation.lat.toFixed(5)}, {targetLocation.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </>
  );
}
