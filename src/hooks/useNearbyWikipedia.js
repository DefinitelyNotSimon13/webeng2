// src/hooks/useNearbyWikipedia.js
import { useEffect, useRef, useState } from "react";
import { fetchNearby } from "../services/wikiGeoService.js";

export function useNearbyWikipedia({ center, radius, lang }) {
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
  }, [center?.lat, center?.lng, radius, lang]);

  return [loading, error, data];
}
