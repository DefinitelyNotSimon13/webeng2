import { createContext } from "react";

export const RoutingStatus = Object.freeze({
  INACTIVE: "inactive",
  PLANNING: "planning",
  ROUTING: "routing",
  ROUTE_FOUND: "route_found",
  ROUTING_FAILED: "routing_failed",
});

const LocationContext = createContext({
  currentLocation: null,
  setCurrentLocation: () => {},

  targetLocation: null,
  setTargetLocation: () => {},

  centerLocation: null,
  setCenterLocation: () => {},

  routeWaypoints: null,
  setRouteWaypoints: () => {},

  zoom: null,
  setZoom: () => {},

  routingStatus: RoutingStatus.INACTIVE,
  setRoutingStatus: () => {},
});

export default LocationContext;
