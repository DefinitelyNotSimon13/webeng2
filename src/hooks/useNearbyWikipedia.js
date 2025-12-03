// src/hooks/useNearbyWikipedia.js
import { useEffect, useRef, useState } from "react";
import { fetchNearby } from "../services/wikiGeoService.js";

function distanceInMeters(a, b) {
  const R = 6371_000;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function useNearbyWikipedia({
  center,
  radius,
  lang,
  minMoveDistance = 100,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const lastCenterRef = useRef(null);

  useEffect(() => {
    if (
      !center ||
      !Number.isFinite(center.lat) ||
      !Number.isFinite(center.lng)
    ) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (radius < 10 || radius > 10000) {
      console.error("Radius out of bounds (10-10000):", radius);
      return;
    }

    if (lastCenterRef.current) {
      const moved = distanceInMeters(lastCenterRef.current, center);
      if (moved < minMoveDistance) {
        return;
      }
    }
    lastCenterRef.current = center;

    const abortController = new AbortController();

    async function loadPois() {
      setLoading(true);
      setError(null);

      try {
        const pois = await fetchNearby({
          lat: center.lat,
          lng: center.lng,
          radius,
          lang,
          signal: abortController.signal,
        });

        setData(pois);
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error while loading POIs";

        setError(errorMessage);
        setData([]);
        setLoading(false);
      }
    }

    loadPois();

    return () => {
      abortController.abort();
    };
  }, [center?.lat, center?.lng, radius, lang, minMoveDistance]);

  return [loading, error, data];
}
