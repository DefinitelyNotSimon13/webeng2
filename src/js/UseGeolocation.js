import { useEffect, useState, useRef } from "react";

export function useGeolocation(
  options = { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watcherId = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation nicht verfügbar"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) => setPosition({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (err) => setError(err),
      options,
    );

    return () => {
      if (watcherId.current !== null) {
        navigator.geolocation.clearWatch(watcherId.current);
      }
    };
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  return {
    position,
    error,
    supported: typeof navigator !== "undefined" && !!navigator.geolocation,
  };
}
