import React, { useContext } from "react";
import "../css/poi-list.css";
import { Block, Card, CardContent, CardHeader, Link } from "framework7-react";
import PropTypes from "prop-types";
import { useNearbyWikipedia } from "../hooks/useNearbyWikipedia";
import LocationContext from "../js/context";

/* Component for listing
 * Point of Interests
 */
const PoiList = (props) => {
  const { radius = 2000, lang = "en" } = props;
  const { targetLocation, centerLocation } = useContext(LocationContext);

  const activeLocation = targetLocation || centerLocation;
  const center = activeLocation
    ? { lat: activeLocation.lat, lon: activeLocation.lng }
    : null;
  const [loading, error, items] = useNearbyWikipedia({ center, radius, lang });

  if (loading) {
    return (
      <Block>
        <p>Loading...</p>
      </Block>
    );
  }

  if (error) {
    return (
      <Block>
        <p>No additional info available.</p>
      </Block>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Block>
        <p>No POIs found nearby.</p>
      </Block>
    );
  }

  return (
    <Block>
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader>{item.title}</CardHeader>
          <CardContent>
            <div className="poi-horizontal-box">
              <img src={item.image} className="poi-image" alt={item.title} />
              <div className="poi-vertical-box">
                <p>{item.description}</p>
                <p>
                  <Link href={item.link} external>
                    Open the wikipedia site
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </Block>
  );
};

PoiList.propTypes = {
  radius: PropTypes.number,
  lang: PropTypes.string,
};

export default PoiList;
