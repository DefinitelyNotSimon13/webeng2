import React, { useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeoLocation.js";
import "../css/map.css";

function AutoLocateOnce({ pos, zoom }) {
  const map = useMap();
  const jumped = React.useRef(false);

  // nach dem Mount einmal neu layouten
  React.useEffect(() => {
    map.invalidateSize();
  }, [map]);

  // sobald Position da ist genau einmal springen
  React.useEffect(() => {
    if (!pos || jumped.current) return;
    const la = Number(pos.lat);
    const lg = Number(pos.lng);
    if (Number.isFinite(la) && Number.isFinite(lg)) {
      jumped.current = true;
      map.setView([la, lg], typeof zoom === "number" ? zoom : map.getZoom(), {
        animate: true,
      });
    }
  }, [map, pos, zoom]);

  return null;
}

function InvalidateOnResize({ observeEl }) {
  const map = useMap();
  useEffect(() => {
    if (!observeEl) return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(observeEl);
    // einmal nach dem nächsten Paint
    requestAnimationFrame(() => map.invalidateSize());
    return () => ro.disconnect();
  }, [map, observeEl]);
  return null;
}

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
  initialCenter = { lat: 47.651, lng: 9.479 },
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

  const wrapperRef = useRef(null);

  return (
    <div className="map-wrapper" ref={wrapperRef}>
      <MapContainer
        center={[center.lat, center.lng]} // oder dein Tuple
        zoom={initialZoom}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InvalidateOnResize observeEl={wrapperRef.current} />
        {autoLocate && <AutoLocateOnce pos={position} zoom={initialZoom} />}
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
