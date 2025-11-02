import { useEffect, useState } from "react";
import { fetchNearby } from "../services/wikiGeoService.js";

export function useNearbyWikipedia({ center, radius, lang }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (
      !center ||
      !Number.isFinite(center.lat) ||
      !Number.isFinite(center.lon)
    ) {
      return;
    }

    let cancelled = false;

    async function loadPois() {
      setLoading(true);
      setError(null);
      setData([]);

      try {
        const pois = await fetchNearby({
          lat: center.lat,
          lon: center.lon,
          radius,
          lang,
        });

        if (!cancelled) {
          setLoading(false);
          setData(pois);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Unbekannter Fehler beim Laden der POIs";

          setLoading(false);
          setError(errorMessage);
          setData([]);
        }
      }
    }

    void loadPois();

    return () => {
      cancelled = true;
    };
  }, [center?.lat, center?.lon, radius, lang]);

  return { loading, error, data };
}
