import React, { useState } from "react";
import {
  Page,
  Navbar,
  NavRight,
  NavLeft,
  NavTitle,
  Link,
  Block,
  Button,
  List,
  ListInput,
  Segmented,
} from "framework7-react";
import ExampleSettingsUsage from "../components/settings/ExampleSettingsUsage";
import Map from "../../src/components/Map.jsx";


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
        <NavRight>
          <Link
            iconIos="f7:doc"
            iconMd="material:description"
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

      <Block strong inset>
        <Map
          initialCenter={{ lat: 47.651, lng: 9.479 }}
          initialZoom={13}
          autoLocate={true}
        />
      </Block>

      <ExampleSettingsUsage />

      <Button className="poi-fab" fill popupOpen="#POI-list" small>
        POIs
      </Button>
    </Page>
  );
};

export default HomePage;
