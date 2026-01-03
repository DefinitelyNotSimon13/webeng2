import { useContext, useRef } from "react";
import { useMapEvents } from "react-leaflet";
import LocationContext, { RoutingStatus } from "../../js/context";
import { f7 } from "framework7-react";

function distanceInMeters(pos1, pos2) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(pos2.lat - pos1.lat);
  const dLng = toRad(pos2.lng - pos1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

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
      if (!currentLocation) {
        map.setView(e.latlng, map.getZoom(), { animate: true });
      }

      if (currentLocation) {
        const distance = distanceInMeters(currentLocation, e.latlng);
        if (distance < 5) return;
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
      const mapCenter = map.getCenter();
      const center = {
        lat: mapCenter.lat.toFixed(5),
        lng: mapCenter.lng.toFixed(5),
      };
      setCenterLocation(center);
      setZoom(Number(map.getZoom()));
    },
  });

  return null;
}
