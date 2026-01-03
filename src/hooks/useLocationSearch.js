import { useCallback, useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import searchLocation from "../services/locationSearchService";
import { useSettings } from "../components/settings";

function useLocationSearch(currentLocation) {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);

  const settings = useSettings();

  const debouncedQuery = useDebounce(query, 500);

  const fetchLocations = useCallback(
    async (searchQuery, lang, currentLocation) => {
      if (!searchQuery || searchQuery.length < 3) {
        setLocations([]);
        return;
      }
      const locations = await searchLocation(
        searchQuery,
        currentLocation,
        lang,
      );
      setLocations(locations);
    },
    [],
  );

  useEffect(() => {
    fetchLocations(debouncedQuery, settings.language, currentLocation);
  }, [debouncedQuery, fetchLocations, settings.language, currentLocation]);

  return { locations, query, setQuery };
}
export default useLocationSearch;
