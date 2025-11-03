import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // base leaflet styles from npm
import "../css/leaflet_map.css"; // project specific styles (no inline styles)

/**
 * Small helper to validate a [lat, lng] tuple.
 */
function isLatLngTuple(value) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    Number.isFinite(value[0]) &&
    typeof value[1] === "number" &&
    Number.isFinite(value[1])
  );
}

/**
 * Hook: optionally recenter the map to the current browser location.
 * If geolocation fails or is denied, it keeps the provided center.
 */
function useGeolocate(enableGeolocation, setCenter) {
  useEffect(() => {
    if (!enableGeolocation || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter([latitude, longitude]);
      },
      (err) => {
        // Log the error to help with debugging; do not alert users here
        // Possible codes: 1 PERMISSION_DENIED, 2 POSITION_UNAVAILABLE, 3 TIMEOUT
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }, [enableGeolocation, setCenter]);
}

/**
 * Component: attaches flexible click handling via props.
 * Calls onMapClick(LatLng) when user clicks on the map.
 */
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      try {
        onMapClick?.(e.latlng);
      } catch (error) {
        console.error("onMapClick handler threw:", error);
      }
    },
  });
  return null;
}

/**
 * LeafletMap
 * Props:
 * - initialCenter: [lat, lng] for first render (default Friedrichshafen)
 * - initialZoom: number (default 13)
 * - enableGeolocation: boolean, if true tries to center on current location
 * - tileUrl: URL template, default OSM
 * - tileAttribution: attribution HTML string
 * - onMapClick: function(latlng) -> void, default logs click, designed to be replaced by routing or POI logic later
 */
export default function LeafletMap({
  initialCenter = [47.651, 9.479],
  initialZoom = 13,
  enableGeolocation = true,
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileAttribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
  onMapClick = (latlng) => console.log("Map clicked at:", latlng),
}) {
  // Validate and normalize the initial center
  const safeInitialCenter = isLatLngTuple(initialCenter)
    ? initialCenter
    : [47.651, 9.479];
  if (!isLatLngTuple(initialCenter)) {
    console.warn(
      "Invalid initialCenter prop. Falling back to Friedrichshafen:",
      initialCenter,
    );
  }

  const [center, setCenter] = useState(safeInitialCenter);
  const [zoom, setZoom] = useState(initialZoom);

  // Try to recenter to the current device location if enabled
  useGeolocate(enableGeolocation, setCenter);

  // Memo tile layer props to avoid unnecessary rerenders
  const tileProps = useMemo(
    () => ({ url: tileUrl, attribution: tileAttribution, maxZoom: 19 }),
    [tileUrl, tileAttribution],
  );

  const mapRef = useRef(null);
  const tileRef = useRef(null);

  // Basic runtime checks as lightweight tests
  useEffect(() => {
    if (!mapRef.current) return;
    const size = mapRef.current.getSize();
    console.assert(
      size.y > 0,
      "Map container has no height. Ensure CSS src/css/leaflet_map.css is loaded.",
    );
    console.assert(
      typeof tileUrl === "string" && tileUrl.length > 0,
      "tileUrl must be a non empty string",
    );
  }, [tileUrl]);

  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    try {
      const hasLayer = mapRef.current.hasLayer(tileRef.current);
      console.assert(hasLayer, "Tile layer not attached to the map");
    } catch (err) {
      // If the ref is not a Leaflet layer instance in a given react-leaflet version, log and continue
      console.debug("Tile layer ref check skipped:", err);
    }
  }, [tileProps.url]);

  return (
    <MapContainer
      whenCreated={(m) => {
        mapRef.current = m;
        const size = m.getSize();
        console.assert(size.y > 0, "Map container height is zero");
      }}
      center={center}
      zoom={zoom}
      className="mapRoot"
      zoomControl
    >
      <TileLayer
        ref={tileRef}
        url={tileProps.url}
        attribution={tileProps.attribution}
        maxZoom={tileProps.maxZoom}
      />
      <ClickHandler onMapClick={onMapClick} />
      {/* No default markers or overlays. Keep the canvas clean. */}
    </MapContainer>
  );
}
