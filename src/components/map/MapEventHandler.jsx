import { useContext } from "react";
import { useMapEvents } from "react-leaflet";
import LocationContext from "../../js/context";

export default function MapEventHandler() {
  const {
    currentLocation,
    setCurrentLocation,
    setTargetLocation,
    setCenterLocation,
    setZoom,
  } = useContext(LocationContext);

  const map = useMapEvents({
    click(e) {
      console.log(e.latlng);
      setTargetLocation(e.latlng);

      if (currentLocation) {
        map.flyToBounds(
          [[currentLocation.lat, currentLocation.lng], e.latlng],
          { padding: [10, 10] },
        );
      } else {
        map.panTo(e.latlng);
      }
    },
    locationfound(e) {
      setCurrentLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.setView(e.latlng, map.getZoom(), { animate: true });
    },
    moveend() {
      const center = map.getCenter();
      setCenterLocation({ lat: center.lat, lng: center.lng });
      setZoom(map.getZoom());
    },
  });

  return null;
}
