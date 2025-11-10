import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeoLocation.js";
import "../css/map.css";

function MapViewUpdater({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
      map.setView([center.lat, center.lng], zoom ?? map.getZoom(), {
        animate: true,
      });
    }
  }, [map, center?.lat, center?.lng, zoom]);

  return null;
}

MapViewUpdater.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  zoom: PropTypes.number.isRequired,
};

export default function Map({
  initialCenter = { lat: 0, lng: 0 },
  initialZoom = 13,
  autoLocate = true,
  geoOptions,
}) {
  const { position } = useGeolocation(
    geoOptions ?? {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 2000,
      strategy: "watch",
      refreshMs: 0,
      minDistance: 1,
    },
  );

  const center = autoLocate && position ? position : initialCenter;

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={initialZoom}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewUpdater center={center} zoom={initialZoom} />
      </MapContainer>
    </div>
  );
}

Map.propTypes = {
  initialCenter: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  initialZoom: PropTypes.number.isRequired,
  autoLocate: PropTypes.bool.isRequired,
  geoOptions: PropTypes.shape({
    enableHighAccuracy: PropTypes.bool,
    timeout: PropTypes.number,
    maximumAge: PropTypes.number,
    refreshMs: PropTypes.number,
    strategy: PropTypes.oneOf(["auto", "poll", "watch"]),
    minDistance: PropTypes.number,
  }),
};
