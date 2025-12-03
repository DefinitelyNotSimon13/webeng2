import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import PropTypes from "prop-types";
import { Link } from "framework7-react";
import useNearbyPois from "../../hooks/useNearbyPois";

export default function NearbyPoiMarkers() {
  const [loading, error, items] = useNearbyPois();

  if (loading || error || !items || items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item) => {
        return (
          <CircleMarker
            key={`${item.coord}-${item.title}`}
            center={item.coord}
            radius={6}
            pathOptions={{
              color: "#adcdeb",
              fillColor: "#3182ce",
              fillOpacity: 1,
              weight: 2,
            }}
          >
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
  radius: PropTypes.number,
};
