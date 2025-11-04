import { useEffect, useState, useRef } from "react";

function distanceMeters(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function useGeolocation(options = {}) {
  const {
   enableHighAccuracy = true,
    timeout = 8000,
    maximumAge = 0,
    refreshMs = 0,
    strategy = "auto",
    minDistance = 0,
  } = options;

  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watcherId = useRef(null);
  const intervalId = useRef(null);
  const lastPosRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation nicht verfügbar"));
      return;
    }

    const geoOpts = { enableHighAccuracy, timeout, maximumAge };
    const usePolling =
      strategy === "poll" || (strategy === "auto" && refreshMs > 0);

    const applyPosition = (p) => {
      const next = { lat: p.coords.latitude, lng: p.coords.longitude };
      if (lastPosRef.current) {
        const d = distanceMeters(lastPosRef.current, next);
        if (d < minDistance) return;
      }
      lastPosRef.current = next;
     setPosition(next);
    };

    const onSuccess = (p) => {
      setError(null);
      applyPosition(p);
    };
    const onError = (err) => setError(err);

    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOpts);

    if (usePolling) {
      const tick = () => {
        if (document.visibilityState === "visible") {
          navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOpts);
        }
      };
      intervalId.current = window.setInterval(
        tick,
        Math.max(1000, refreshMs || 5000),
      );
    } else {
      watcherId.current = navigator.geolocation.watchPosition(
        onSuccess,
       onError,
        geoOpts,
      );
    }

    const onVis = () => {
      if (document.visibilityState === "visible") {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOpts);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
     if (watcherId.current !== null) {
        navigator.geolocation.clearWatch(watcherId.current);
        watcherId.current = null;
      }
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [
    enableHighAccuracy,
    timeout,
    maximumAge,
    refreshMs,
    strategy,
    minDistance,
  ]);

    return { position, error, supported: typeof navigator !== "undefined" && !!navigator.geolocation };
}
