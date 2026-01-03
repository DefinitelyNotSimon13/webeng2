const BASE_URL = "https://nominatim.openstreetmap.org/search";

function distanceInMeters(pos1, pos2) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(pos2.lat - pos1.lat);
  const dLng = toRad(pos2.lng - pos1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function searchLocation(query, currentLocation, lang) {
  const queryParams = new URLSearchParams({
    q: query,
    format: "geocodejson",
    addressdetails: 1,
    polygon_geojson: 1,
    "accept-language": lang,
  });
  const url = `${BASE_URL}?${queryParams}`;

  const searchResponse = await fetch(url);
  if (!searchResponse.ok) {
    throw new Error(
      `Failed to search location: ${searchResponse.status} ${searchResponse.statusText}`,
    );
  }

  const searchData = await searchResponse.json();

  const getDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return null;
    return distanceInMeters(pos1, pos2);
  };

  return searchData.features.map((feature) => {
    const position = getFeaturePosition(feature);

    return {
      position,
      geometry: feature.geometry,
      details: feature.properties.geocoding,
      distance: getDistance(currentLocation, position),
    };
  });
}

function getFeaturePosition(feature) {
  const geom = feature.geometry;
  if (!geom) return null;

  if (geom.type === "Point") {
    const [lng, lat] = geom.coordinates;
    return { lat, lng };
  }

  if (geom.type === "Polygon") {
    const ring = geom.coordinates[0];
    if (!ring || ring.length === 0) return null;

    let sumLat = 0;
    let sumLng = 0;

    for (const [lng, lat] of ring) {
      sumLat += lat;
      sumLng += lng;
    }

    const count = ring.length;
    return {
      lat: sumLat / count,
      lng: sumLng / count,
    };
  }

  if (geom.type === "LineString") {
    const points = geom.coordinates;
    if (!points.length) return null;

    let sumLat = 0;
    let sumLng = 0;

    for (const [lng, lat] of points) {
      sumLat += lat;
      sumLng += lng;
    }

    const count = points.length;

    return {
      lat: sumLat / count,
      lng: sumLng / count,
    };
  }
  if (geom.type === "MultiPolygon") {
    const polygons = geom.coordinates;
    if (!polygons?.length) return null;

    let sumLat = 0;
    let sumLng = 0;
    let count = 0;

    for (const polygon of polygons) {
      const ring = polygon[0];
      if (!ring?.length) continue;

      for (const [lng, lat] of ring) {
        sumLat += lat;
        sumLng += lng;
        count += 1;
      }
    }

    if (!count) return null;

    return {
      lat: sumLat / count,
      lng: sumLng / count,
    };
  }

  console.error("Unkown feature: ", geom.type);
  return null;
}

export default searchLocation;
