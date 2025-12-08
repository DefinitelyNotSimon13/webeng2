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
        setTargetLocation(e.latlng);
      }

      if (currentLocation) {
        map.flyToBounds(
          [currentLocation, e.latlng, ...routeWaypoints, targetLocation],
          { padding: [10, 10] },
        );
      } else if (targetLocation) {
        map.flyToBounds([...routeWaypoints, e.latlng, targetLocation], {
          padding: [10, 10],
        });
      } else if (routeWaypoints.length > 0) {
        map.flyToBounds([...routeWaypoints, e.latlng], { padding: [10, 10] });
      }
    },
    locationfound(e) {
      if (!currentLocation) {
        map.setView(e.latlng, map.getZoom(), { animate: true });
      }

      setCurrentLocation(e.latlng);
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
