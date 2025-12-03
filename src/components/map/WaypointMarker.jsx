import React from "react";
import { useContext } from "react";
import LocationContext from "../../js/context";
import { Marker, Popup } from "react-leaflet";
import { createMarkerIcon } from "./customMarkerIcon";

const waypointIcon = createMarkerIcon("#fcd12a", 12);

export default function WaypointMarker() {
  const { routeWaypoints } = useContext(LocationContext);

  return (
    <>
      {routeWaypoints.map((wp, index) => (
        <Marker key={index} position={[wp.lat, wp.lng]} icon={waypointIcon}>
          <Popup>
            Waypoint {index + 1}:<br />
            {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
