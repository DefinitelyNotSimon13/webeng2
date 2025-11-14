import React, { useContext, useState } from "react";
import "../css/coordPicker.css";
import { Block, List, ListInput, Segmented, Button } from "framework7-react";
import LocationContext from "../js/context";

function parseCoord(valueStr, hemisphere, isLat) {
  const v = Number(
    String(valueStr ?? "")
      .trim()
      .replace(",", "."),
  );
  if (!Number.isFinite(v)) return null;
  const abs = Math.abs(v);
  const max = isLat ? 90 : 180;
  if (abs > max) return null;
  if (isLat) return hemisphere === "S" ? -abs : abs;
  return hemisphere === "W" ? -abs : abs;
}

const CoordPicker = () => {
  const { centerLocation, setCenterLocation } = useContext(LocationContext);

  const [lat, setLat] = useState(Math.abs(centerLocation.lat).toString() ?? "");
  const [lng, setLng] = useState(Math.abs(centerLocation.lng).toString() ?? "");
  const [latHem, setLatHem] = useState(centerLocation.lat < 0 ? "S" : "N");
  const [lngHem, setLngHem] = useState(centerLocation.lng < 0 ? "W" : "O");

  const handleSearch = () => {
    const newLat = parseCoord(lat, latHem, true);
    const newLng = parseCoord(lng, lngHem, false);
    if (!newLat || !newLng) {
      console.warn("Invalid coordinates provided");
      return;
    }
    setCenterLocation({ lat: newLat, lng: newLng });
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
        <Button className="coord-search" fill onClick={handleSearch} popupClose>
          Search
        </Button>
      </div>
    </Block>
  );
};

export default CoordPicker;
