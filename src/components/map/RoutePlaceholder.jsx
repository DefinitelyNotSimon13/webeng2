import React, { useContext } from "react";
import LocationContext, { RoutingStatus } from "../../js/context";
import { Polyline } from "react-leaflet";

export default function RoutePlaceholder() {
  const { currentLocation, routeWaypoints, targetLocation, routingStatus } =
    useContext(LocationContext);

  if (!targetLocation) return null;
  if (routingStatus === RoutingStatus.ROUTE_FOUND) return null;

  const points = currentLocation
    ? [currentLocation, ...routeWaypoints, targetLocation]
    : [...routeWaypoints, targetLocation];

  return (
    <Polyline
      positions={points}
      pathOptions={{
        color: "red",
        weight: 2,
        dashArray: "7 12",
      }}
    />
  );
}
