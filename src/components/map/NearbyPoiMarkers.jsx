import React, { useContext, useState } from "react";
import { CircleMarker, Tooltip, Popup, useMap } from "react-leaflet";
import PropTypes from "prop-types";
import LocationContext from "../../js/context";
import { useNearbyWikipedia } from "../../hooks/useNearbyWikipedia";
import { Link } from "framework7-react";

export default function NearbyPoiMarkers({ lang = "en" }) {
  const map = useMap();
  const { targetLocation, centerLocation } = useContext(LocationContext);

  const activeLocation = targetLocation || centerLocation;

  const [activePoiId, setActivePoiId] = useState(null);

  if (!activeLocation) {
    return null;
  }

  const center = {
    lat: activeLocation.lat,
    lon: activeLocation.lng,
  };

  const bounds = map.getBounds();
  const northWest = bounds.getNorthWest();
  const southWest = bounds.getSouthWest();

  const radius = map.distance(
    [northWest.lat, northWest.lng],
    [southWest.lat, southWest.lng],
  );

  const [loading, error, items] = useNearbyWikipedia({
    center,
    radius,
    lang,
  });

  if (loading || error || !items || items.length === 0) {
    return null;
  }

  return (
    <>
      {items
        .filter((item) => {
          if (!item.coord) return false;
          return bounds.contains([item.coord.lat, item.coord.lon]);
        })
        .map((item) => {
          const id = `${item.coord.lat}-${item.coord.lon}-${item.title}`;

          const hasAnyPopupOpen = activePoiId !== null;

          return (
            <CircleMarker
              key={id}
              center={[item.coord.lat, item.coord.lon]}
              radius={10}
              pathOptions={{
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.4,
                weight: 2,
              }}
              eventHandlers={{
                popupopen: () => {
                  setActivePoiId(id);
                },
                popupclose: () => {
                  setActivePoiId(null);
                },
              }}
            >
              {/* Hover Tooltip nur wenn kein Popup offen ist */}
              {!hasAnyPopupOpen && (
                <Tooltip direction="top" offset={[0, -4]} sticky>
                  <div>
                    <strong>{item.title}</strong>
                    {item.description && (
                      <div className="poi-tooltip-description">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Tooltip>
              )}

              {/* Klick Popup bleibt stehen bis woanders geklickt wird */}
              <Popup>
                <div className="poi-popup">
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                  {item.link && (
                    <p>
                      <Link href={item.link} external>
                        Open the wikipedia site
                      </Link>
                    </p>
                  )}

                  {item.distance != null && (
                    <p>Distance: {Math.round(item.distance)} m</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
    </>
  );
}

NearbyPoiMarkers.propTypes = {
  lang: PropTypes.string,
};
