import { createContext } from "react";

const LocationContext = createContext({
  currentLocation: null,
  setCurrentLocation: () => {},

  targetLocation: null,
  setTargetLocation: () => {},

  centerLocation: null,
  setCenterLocation: () => {},

  zoom: null,
  setZoom: () => {},
});

export default LocationContext;
