import React, { useContext } from "react";
import { Block, List, Searchbar, ListItem, f7 } from "framework7-react";
import LocationContext from "../../js/context";
import useLocationSearch from "../../hooks/useLocationSearch";
import { useMap } from "react-leaflet";
import "./LocationSearch.css";

const LocationSearch = () => {
  const { currentLocation, setHighlightedFeature, setTargetLocation } =
    useContext(LocationContext);
  const { locations, query, setQuery } = useLocationSearch(currentLocation);
  const map = useMap();

  const meterFormatter = new Intl.NumberFormat(navigator.language, {
    style: "unit",
    unit: "meter",
    unitDisplay: "short",
    maximumFractionDigits: 0,
  });
  const kilometerFormatter = new Intl.NumberFormat(navigator.language, {
    style: "unit",
    unit: "kilometer",
    unitDisplay: "short",
    maximumFractionDigits: 1,
  });

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return meterFormatter.format(distance);
    } else {
      return kilometerFormatter.format(distance / 1000);
    }
  };

  const geometryToLatLngs = (geometry) => {
    if (!geometry) return [];
    const { type, coordinates } = geometry;

    if (type === "Point") {
      const [lng, lat] = coordinates;
      return [[lat, lng]];
    }

    if (type === "LineString") {
      return coordinates.map(([lng, lat]) => [lat, lng]);
    }

    if (type === "Polygon") {
      const ring = coordinates[0] || [];
      return ring.map(([lng, lat]) => [lat, lng]);
    }

    if (type === "MultiPolygon") {
      return coordinates.flatMap((polygon) => {
        const ring = polygon[0] || [];
        return ring.map(([lng, lat]) => [lat, lng]);
      });
    }

    console.warn("Unsupported geometry type:", type);
    return [];
  };

  const selectLocation = (location) => {
    f7.popup.close("#search-popup");
    const { geometry } = location;

    setHighlightedFeature(null);
    const latLngs = geometryToLatLngs(geometry);
    if (!latLngs.length) return;

    if (latLngs.length === 1) {
      map.flyTo(latLngs[0], undefined, { duration: 2 });
    } else {
      map.flyToBounds(latLngs, { duration: 2 });
    }
    if (geometry.type != "Point") setHighlightedFeature(geometry);
    setTargetLocation(location.position);
  };

  const formatAddress = (details) => {
    return `${details.postcode || ""} ${details.city || details.county || details.state || ""} , ${details.country}`;
  };

  const formatName = (details) => {
    return details.name || details.label;
  };

  return (
    <Block className="location-search-block">
      <Searchbar
        className="popup-searchbar"
        value={query}
        customSearch={true}
        backdrop={false}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onSearchbarClear={() => {
          setQuery("");
        }}
      />

      {locations.length > 0 && (
        <div className="location-search-list-wrapper">
          <List
            strong
            inset
            dividers
            mediaList
            className="location-search-list"
          >
            {locations.map((location) => (
              <ListItem
                key={location.details.place_id}
                link="#"
                text={formatAddress(location.details)}
                title={formatName(location.details)}
                onClick={() => selectLocation(location)}
                badge={
                  location.distance ? formatDistance(location.distance) : null
                }
              />
            ))}
          </List>
        </div>
      )}
    </Block>
  );
};

export default LocationSearch;
