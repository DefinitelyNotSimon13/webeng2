import { useState, useMemo } from "react";
import { RoutingStatus } from "../js/context.js";
import { DEFAULT_ZOOM, FRIEDRICHSHAFEN_COORDS } from "../consts.js";

export default function useLocationState(settings) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [targetLocation, setTargetLocation] = useState(null);
  const [centerLocation, setCenterLocation] = useState(
    settings.lat && settings.lng
      ? { lat: Number(settings.lat), lng: Number(settings.lng) }
      : FRIEDRICHSHAFEN_COORDS,
  );
  const [routingStatus, setRoutingStatus] = useState(RoutingStatus.INACTIVE);
  const [routeWaypoints, setRouteWaypoints] = useState([]);

  const [fullRoute, setFullRoute] = useState([]);
  const [locationError, setLocationError] = useState(null);

  const calculateRoute = () => {
    if (currentLocation) {
      setFullRoute([currentLocation, ...routeWaypoints, targetLocation]);
    } else {
      setFullRoute([...routeWaypoints, targetLocation]);
    }
    setRoutingStatus(RoutingStatus.ROUTING);
  };

  const clearRoute = () => {
    setRouteWaypoints([]);
    setFullRoute([]);
    setTargetLocation(null);
    setRoutingStatus(RoutingStatus.INACTIVE);
  };

  const contextValue = useMemo(
    () => ({
      currentLocation,
      setCurrentLocation,
      targetLocation,
      setTargetLocation,
      centerLocation,
      setCenterLocation,
      zoom,
      setZoom,
      locationError,
      setLocationError,
      routingStatus,
      setRoutingStatus,
      routeWaypoints,
      setRouteWaypoints,
    }),
    [
      currentLocation,
      targetLocation,
      centerLocation,
      zoom,
      locationError,
      routingStatus,
      routeWaypoints,
    ],
  );

  return { contextValue, fullRoute, calculateRoute, clearRoute };
}
