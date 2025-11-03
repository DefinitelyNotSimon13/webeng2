import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  Link,
  Block,
  Button,
  List,
  ListInput,
  Segmented,
} from "framework7-react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";

const CenterOnLoad = (zoom = 20) => {
  const map = useMap();
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation nicht verfügbar");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const latlng = [p.coords.latitude, p.coords.longitude];
        setPos(latlng);
        map.setView(latlng, zoom, { animate: true });
      },
      (err) => {
        console.warn("Geolocation Fehler:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      },
    );
  }, [map, zoom]);
};

const HomePage = () => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [latHem, setLatHem] = useState("N");
  const [lngHem, setLngHem] = useState("O");

  const handleSearch = () => {
    console.log("Search coords:", { lat, latHem, lng, lngHem });
  };

  return (
    <Page name="home">
      <Navbar>
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
        </NavLeft>
        <NavTitle>MapP</NavTitle>
      </Navbar>

      <Block className="coord-box">
        <div className="coord-pair">
          <List className="coord-input-list" inset>
            <ListInput
              label="Lat"
              type="text"
              placeholder="Latitude"
              value={lat}
              onInput={(e) => setLat(e.target.value)}
              clearButton
            />
          </List>

          <div className="coord-seg">
            <Segmented strong outlineIos>
              <Button
                small
                active={latHem === "N"}
                onClick={() => setLatHem("N")}
              >
                N
              </Button>
              <Button
                small
                active={latHem === "S"}
                onClick={() => setLatHem("S")}
              >
                S
              </Button>
            </Segmented>
          </div>
        </div>

        <div className="coord-pair">
          <List className="coord-input-list" inset>
            <ListInput
              label="Lng"
              type="text"
              placeholder="Longitude"
              value={lng}
              onInput={(e) => setLng(e.target.value)}
              clearButton
            />
          </List>

          <div className="coord-seg">
            <Segmented strong outlineIos>
              <Button
                small
                active={lngHem === "O"}
                onClick={() => setLngHem("O")}
              >
                O
              </Button>
              <Button
                small
                active={lngHem === "W"}
                onClick={() => setLngHem("W")}
              >
                W
              </Button>
            </Segmented>
          </div>
        </div>

        <div className="coord-actions">
          <Button className="coord-search" fill onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Block>

      <Block strong inset style={{ padding: 0 }}>
        <div style={{ height: "60vh", width: "100%" }}>
          <MapContainer
            center={[0, 0]}
            zoom={13}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CenterOnLoad zoom={13} showMarker />
          </MapContainer>
        </div>
      </Block>

      <Button className="poi-fab" fill popupOpen="#POI-list" small>
        POIs
      </Button>
    </Page>
  );
};
export default HomePage;
