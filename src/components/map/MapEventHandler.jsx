import { useContext, useRef } from "react";
import { useMapEvents } from "react-leaflet";
import LocationContext, { RoutingStatus } from "../../js/context";
import { f7 } from "framework7-react";

export default function MapEventHandler() {
  const {
    currentLocation,
    setCurrentLocation,
    setLocationError,

    targetLocation,
    setTargetLocation,

    setCenterLocation,

    routeWaypoints,
    setRouteWaypoints,

    routingStatus,

    setHighlightedFeature,

    setZoom,
  } = useContext(LocationContext);

  const shownError = useRef(null);

  const map = useMapEvents({
    click(e) {
      if (!currentLocation && routeWaypoints.length < 1) {
        setRouteWaypoints([e.latlng]);
      } else if (routingStatus === RoutingStatus.PLANNING) {
        setRouteWaypoints((prev) => [...prev, e.latlng]);
      } else {
        setHighlightedFeature(null);
        setTargetLocation(e.latlng);
      }

      if (currentLocation) {
        map.flyToBounds(
          [currentLocation, e.latlng, ...routeWaypoints, targetLocation],
          { padding: [10, 10], easeLinearity: 0.8 },
        );
      } else if (targetLocation) {
        map.flyToBounds([...routeWaypoints, e.latlng, targetLocation], {
          padding: [10, 10],
          easeLinearity: 0.8,
        });
      } else if (routeWaypoints.length > 0) {
        map.flyToBounds([...routeWaypoints, e.latlng], {
          padding: [10, 10],
          easeLinearity: 0.8,
        });
      }
    },
    locationfound(e) {
      const position = {
        lat: Math.round(e.latlng.lat * 1e5) / 1e5,
        lng: Math.round(e.latlng.lng * 1e5) / 1e5,
      };
      if (!currentLocation) {
        map.setView(position, map.getZoom(), { animate: true });
      }

      setCurrentLocation(position);
      if (setLocationError) setLocationError(null);
    },
    locationerror(e) {
      console.debug("Map locationerror:", e);
      if (e.message === shownError.current?.message) {
        return;
      }

      shownError.current = e;
      f7.notification
        .create({
          title: "Error",
          text: e.message,
          cssClass: "error-notification",
          closeButton: true,
        })
        .open();
    },
    moveend() {
      const center = map.getCenter();
      setCenterLocation(center);
      setZoom(map.getZoom());
    },
  });

  return null;
}
