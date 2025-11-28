import { useEffect, useState } from "react";
import { fetchNearby } from "../services/wikiGeoService.js";

export function useNearbyWikipedia({ center, radius, lang }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (
      center === undefined ||
      !Number.isFinite(center.lat) ||
      !Number.isFinite(center.lng)
    ) {
      console.error("Invalid center coordinates:", center);
      return;
    }

    if (radius < 10 || radius > 10000) {
      console.error("Radius out of bounds (10-10000):", radius);
      return;
    }

    const abortController = new AbortController();

    async function loadPois() {
      setLoading(true);
      setError(null);
      setData([]);

      try {
        const pois = await fetchNearby({
          lat: center.lat,
          lng: center.lng,
          radius,
          lang,
          signal: abortController.signal,
        });

        setLoading(false);
        setData(pois);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error while loading POIs";

        setLoading(false);
        setError(errorMessage);
        setData([]);
      }
    }

    (async () => await loadPois())();

    return () => {
      abortController.abort();
    };
  }, [center?.lat, center?.lng, radius, lang]);

  return [loading, error, data];
}
