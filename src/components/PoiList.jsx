import React from "react";
import "../css/poi-list.css";
import { Block, Card, CardContent, CardHeader, Link } from "framework7-react";
import useNearbyPois from "../hooks/useNearbyPois";

const PoiList = () => {
  const [loading, error, items] = useNearbyPois();

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

export default PoiList;
