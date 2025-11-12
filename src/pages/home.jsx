import { React, useState } from "react";
import {
  Block,
  Button,
  Fab,
  FabButton,
  ListInput,
  FabButtons,
  Icon,
  Link,
  List,
  NavLeft,
  NavRight,
  NavTitle,
  Navbar,
  Page,
  Segmented,
  f7,
} from "framework7-react";
import Map from "../../src/components/Map.jsx";
import CoordPicker from "../components/coordPicker";
import SmallPopup from "../components/small-popup/SmallPopup.jsx";

function parseCoord(valueStr, hemisphere, isLat) {
  if (!valueStr) return null;
  const v = Number(String(valueStr).replace(",", "."));
  if (!Number.isFinite(v)) return null;

  const abs = Math.abs(v);
  const max = isLat ? 90 : 180;
  if (abs > max) return null;

  if (isLat) {
    return hemisphere === "S" ? -abs : abs;
  }
  return hemisphere === "W" ? -abs : abs;
}

const HomePage = () => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [latHem, setLatHem] = useState("N");
  const [lngHem, setLngHem] = useState("O");

  const [targetCenter, setTargetCenter] = useState(null);
  const [targetZoom, setTargetZoom] = useState(13);

  const handleSearch = () => {
    const latNum = parseCoord(lat, latHem, true);
    const lngNum = parseCoord(lng, lngHem, false);

    if (latNum == null || lngNum == null) {
      console.warn("Ungueltige Koordinaten");
      return;
    }

    setTargetCenter({ lat: latNum, lng: lngNum });
    setTargetZoom((z) => Math.max(z, 14));
    console.log("Search coords:", { lat: latNum, lng: lngNum });
  };

  return (
    <Page name="home">
      <Navbar>
        <NavRight>
          <Link
            iconIos="f7:info_circle"
            iconMd="material:info"
            openIn="sheet"
            href="/about/"
          />
          <Link
            iconIos="f7:settings"
            iconMd="material:settings"
            openIn="panel"
            href="/settings/"
          />
        </NavRight>
        <NavLeft>
          <img className="nav-icon" src="/icons/favicon.png" />
        </NavLeft>
        <NavTitle>Map</NavTitle>
      </Navbar>

      <Map
        initialCenter={{ lat: 47.651, lng: 9.479 }}
        initialZoom={13}
        autoLocate={true}
        centerOverride={targetCenter}
        zoomOverride={targetZoom}
      />

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

      <SmallPopup id="coord-popup" title="Insert Coordinates">
        <CoordPicker onSearch={handleSearch} />
      </SmallPopup>

      <Fab position="right-bottom" slot="fixed">
        <Icon ios="f7:placemark_fill" md="material:location_pin" />
        <Icon ios="f7:xmark" md="material:close" />
        <FabButtons position="top">
          <FabButton
            label="POIs"
            onClick={() => {
              f7.popup.open("#POI-list");
            }}
          >
            <Icon ios="f7:compass_fill" md="material:explore" />
          </FabButton>
          <FabButton
            label="Insert Coordinates"
            onClick={() => {
              f7.popup.open("#coord-popup");
            }}
          >
            <Icon ios="f7:globe" md="material:language" />
          </FabButton>
        </FabButtons>
      </Fab>
    </Page>
  );
};

export default HomePage;
