import "../css/poi-list.css";
import {
  Block,
  BlockTitle,
  Card,
  CardContent,
  CardHeader,
  Link,
} from "framework7-react";

const PoiList = ({ items }) => {
  return (
    <Block>
      <BlockTitle>Nearby Points of Interest</BlockTitle>
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

export default PoiList;
