import React, { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import LocationContext from "../../js/context.js";
import NearbyPoiMarkers from "./NearbyPoiMarkers.jsx";

import "../../css/Map.css";
import MapEventHandler from "./MapEventHandler.jsx";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function InvalidateOnResize({ observeEl }) {
  const map = useMap();
  useEffect(() => {
    if (!observeEl) return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(observeEl);
    requestAnimationFrame(() => map.invalidateSize());
    return () => ro.disconnect();
  }, [map, observeEl]);
  return null;
}

InvalidateOnResize.propTypes = {
  observeEl: PropTypes.any,
};

function MapViewUpdater() {
  const map = useMap();
  const { centerLocation, zoom } = useContext(LocationContext);

  useEffect(() => {
    if (!map) return;
    if (
      centerLocation &&
      Number.isFinite(centerLocation.lat) &&
      Number.isFinite(centerLocation.lng)
    ) {
      map.panTo([centerLocation.lat, centerLocation.lng], zoom);
    }
  }, [map, centerLocation?.lat, centerLocation?.lng, zoom]);

  return null;
}

function Locator() {
  const map = useMap();
  useEffect(() => {
    map.locate();
  }, [map]);
}

export default function Map({ enableGeolocation, children }) {
  const { centerLocation, zoom } = useContext(LocationContext);

  const wrapperRef = useRef(null);

  return (
    <div className="map-wrapper" ref={wrapperRef}>
      <MapContainer
        center={[centerLocation.lat, centerLocation.lng]}
        zoom={zoom}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InvalidateOnResize observeEl={wrapperRef.current} />

        <MapViewUpdater />
        <MapEventHandler />
        <NearbyPoiMarkers />

        {enableGeolocation && <Locator />}

        {children}
      </MapContainer>
    </div>
  );
}

Map.propTypes = {
  enableGeolocation: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
