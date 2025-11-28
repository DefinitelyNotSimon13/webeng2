import React from "react";
import { useContext } from "react";
import LocationContext from "../../js/context";
import { Marker, Popup } from "react-leaflet";

export default function WaypointMarker() {
  const { routeWaypoints } = useContext(LocationContext);

  return (
    <>
      {routeWaypoints.map((wp, index) => (
        <Marker key={index} position={[wp.lat, wp.lng]}>
          <Popup>
            Waypoint {index + 1}:<br />
            {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
