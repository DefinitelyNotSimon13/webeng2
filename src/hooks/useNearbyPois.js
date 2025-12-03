import { useContext } from "react";
import LocationContext from "../js/context";
import { useSettings } from "../components/settings";
import { useNearbyWikipedia } from "./useNearbyWikipedia";

export default function useNearbyPois({ radius = 2000 } = {}) {
  const settings = useSettings();
  const { targetLocation, currentLocation, centerLocation } =
    useContext(LocationContext);

  const activeLocation = targetLocation || currentLocation || centerLocation;
  const center = activeLocation ? activeLocation : null;

  return useNearbyWikipedia({
    center,
    radius,
    lang: settings.language,
  });
}
