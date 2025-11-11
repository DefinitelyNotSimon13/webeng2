import React from "react";
import "../css/poi-list.css";
import { Block, Card, CardContent, CardHeader, Link } from "framework7-react";
import PropTypes from "prop-types";

/* Component for listing
 * Point of Interests
 */
const PoiList = (props) => {
  const { items } = props;
  return (
    <Block>
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader>{item.title}</CardHeader>
          <CardContent>
            <div className="poi-horizontal-box">
              <img src={item.image} className="poi-image" />
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
  items: PropTypes.arrayOf({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
};

export default PoiList;
