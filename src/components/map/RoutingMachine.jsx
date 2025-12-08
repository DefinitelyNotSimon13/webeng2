import { useContext, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // important!
import "leaflet-routing-machine";
import LocationContext, { RoutingStatus } from "../../js/context";

function RoutingMachine({
  waypoints,
  draggable = false,
  showAlternatives = true,
  serviceUrl = "https://router.project-osrm.org/route/v1",
}) {
  const map = useMap();
  const controlRef = useRef(null);

  const { routingStatus, setRoutingStatus } = useContext(LocationContext);

  if (routingStatus === RoutingStatus.PLANNING) {
    waypoints = [];
  }

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
      return;
    }

    if (!controlRef.current) {
      controlRef.current = L.Routing.control({
        waypoints: waypoints.map((w) => L.latLng(w)),
        router: L.Routing.osrmv1({ serviceUrl }),
        routeWhileDragging: true,
        addWaypoints: draggable,
        showAlternatives,
        collapsible: true,
        show: false,
        fitSelectedRoutes: "smart",
        createMarker: () => {
          return null;
        },
        lineOptions: {
          styles: [
            { color: "black", opacity: 0.15, weight: 9 },
            { color: "white", opacity: 0.8, weight: 6 },
            { color: "red", opacity: 1, weight: 2 },
          ],
        },
        altLineOptions: {
          styles: [
            { color: "black", opacity: 0.15, weight: 9 },
            { color: "white", opacity: 0.8, weight: 6 },
            { color: "blue", opacity: 1, weight: 2 },
          ],
        },
      }).addTo(map);

      controlRef.current.on("routesfound", () => {
        setRoutingStatus(RoutingStatus.ROUTE_FOUND);
      });

      controlRef.current.on("routingerror", (e) => {
        console.error("[RoutingMachine] Failed to find route", e);
        setRoutingStatus(RoutingStatus.ROUTING_FAILED);
      });
    } else {
      controlRef.current.setWaypoints(waypoints.map((w) => L.latLng(w)));
    }

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, waypoints, draggable, showAlternatives, serviceUrl]);

  return null;
}

RoutingMachine.propTypes = {
  waypoints: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
  ).isRequired,
  draggable: PropTypes.bool,
  showAlternatives: PropTypes.bool,
  serviceUrl: PropTypes.string,
};

export default RoutingMachine;
