import React from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useGeolocation } from "../js/UseGeolocation.js";
import "../css/Map.css";

function MapViewUpdater({ center, zoom }) {
  const map = useMap();

  React.useEffect(() => {
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
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  zoom: PropTypes.number,
};

export default function Map({
  initialCenter = { lat: 0, lng: 0 },
  initialZoom = 13,
  autoLocate = true,
}) {
  const { position } = useGeolocation();

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
  }),
  initialZoom: PropTypes.number,
  autoLocate: PropTypes.bool,
};
