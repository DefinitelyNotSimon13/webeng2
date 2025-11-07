import React, { useState } from "react";
import "../css/coordPicker.css";
import { Block, List, ListInput, Segmented, Button } from "framework7-react";

const CoordPicker = ({ onSearch }) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [latHem, setLatHem] = useState("N");
  const [lngHem, setLngHem] = useState("O");

  const handleSearch = () => {
    if (onSearch) onSearch({ lat, latHem, lng, lngHem });
  };
  return (
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
  );
};

export default CoordPicker;
