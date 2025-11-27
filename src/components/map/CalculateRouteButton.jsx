import React, { useContext } from "react";
import LocationContext from "../../js/context";
import { Button } from "framework7-react";
import "./CalculateRouteButton.css";
import { useMapEvents } from "react-leaflet";

function CalculateRouteButton({ onCalculateRoute }) {
  const { targetLocation, currentLocation } = useContext(LocationContext);

  return (
    <div className={"bottom-button-container " + (targetLocation && currentLocation ? "" : "hidden")} >
      <Button
        raised
        round
        tonal
        large
        class="bottom-center-button"
        onClick={onCalculateRoute}>
        Calculate Route
      </Button>
    </div >
  )
}

export default CalculateRouteButton
