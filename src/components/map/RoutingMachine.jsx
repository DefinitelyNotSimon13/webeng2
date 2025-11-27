import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // important!
import "leaflet-routing-machine";

function RoutingMachine({
  waypoints,
  draggable = false,
  showAlternatives = false,
  serviceUrl = "https://router.project-osrm.org/route/v1",
}) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return;

    if (!controlRef.current) {
      controlRef.current = L.Routing.control({
        waypoints: waypoints.map((w) => L.latLng(w)),
        router: L.Routing.osrmv1({ serviceUrl }),
        routeWhileDragging: true,
        addWaypoints: draggable,
        showAlternatives,
        collapsible: true,
        show: true,
        fitSelectedRoutes: "smart",
        lineOptions: {
          // styles: [
          //   { color: "#0f172a", opacity: 0.25, weight: 8 },
          //   { color: "#38bdf8", opacity: 0.9, weight: 5 },
          // ],
        },
        altLineOptions: {
          // styles: [
          //   { color: "#0f172a", opacity: 0.15, weight: 6 },
          //   { color: "#64748b", opacity: 0.7, weight: 4, dashArray: "4,8" },
          // ],
        },

      }).addTo(map);
      controlRef.current.on("routingstart", () => {
        console.log("Routing started…");
      });

      controlRef.current.on("routesfound", (e) => {
        console.log("Routes found:", e.routes);
      });

      controlRef.current.on("routingerror", (e) => {
        console.error("Routing error:", e.error);
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
    })
  ).isRequired,
  draggable: PropTypes.bool,
  showAlternatives: PropTypes.bool,
  serviceUrl: PropTypes.string,
};

export default RoutingMachine;
