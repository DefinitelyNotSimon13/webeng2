const WIKI_DEFAULT_LANG = "de";
const WIKI_DEFAULT_RADIUS = 1000;

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiError";
  }
}

function validateParams({ lat, lon, radius, lang }) {
  const errors = [];

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    errors.push("lat muss in [-90, 90] liegen");
  }

  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    errors.push("lon muss in [-180, 180] liegen");
  }

  const r = radius ?? WIKI_DEFAULT_RADIUS;
  if (!Number.isFinite(r) || r <= 0) {
    errors.push("radius muss > 0 sein");
  }

  const langValue = lang ?? WIKI_DEFAULT_LANG;
  const l = (langValue ? langValue : "").toString().toLowerCase();
  if (!/^[a-z]{2,3}$/.test(l)) {
    errors.push('lang muss ein ISO-Sprachcode wie "de" oder "en" sein');
  }

  if (errors.length) {
    throw new ValidationError(`Ungültige Parameter: ${errors.join("; ")}`);
  }

  return { lat, lon, radius: Math.floor(r), lang: l };
}

function buildQueryString(params) {
  return new URLSearchParams(params).toString();
}

export async function fetchNearby({ lat, lon, radius, lang } = {}) {
  const validated = validateParams({ lat, lon, radius, lang });
  const endpoint = `https://${validated.lang}.wikipedia.org/w/api.php`;

  const geoUrl = `${endpoint}?${buildQueryString({
    action: "query",
    list: "geosearch",
    gscoord: `${validated.lat}|${validated.lon}`,
    gsradius: String(validated.radius),
    gslimit: "50",
    format: "json",
    origin: "*",
  })}`;

  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new ApiError(
      `Wikipedia API Fehler: ${geoResponse.status} ${geoResponse.statusText}`,
    );
  }

  const geoData = await geoResponse.json();
  const geoItems = geoData?.query?.geosearch ?? [];

  if (!geoItems.length) {
    return [];
  }

  const pageIds = geoItems.map((item) => item.pageid).filter(Boolean);
  const detailsUrl = `${endpoint}?${buildQueryString({
    action: "query",
    prop: "pageimages|extracts|info",
    inprop: "url",
    exintro: "1",
    explaintext: "1",
    exchars: "280",
    piprop: "thumbnail",
    pithumbsize: "250",
    pageids: pageIds.join("|"),
    format: "json",
    origin: "*",
  })}`;

  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) {
    throw new ApiError(
      `Wikipedia API Fehler: ${detailsResponse.status} ${detailsResponse.statusText}`,
    );
  }

  const detailsData = await detailsResponse.json();
  const pagesObject = detailsData?.query?.pages ?? {};

  const detailsById = new Map(
    Object.values(pagesObject).map((page) => [
      page.pageid,
      {
        description: page.extract || null,
        image: page.thumbnail?.source || null,
        link:
          page.fullurl ||
          `https://${validated.lang}.wikipedia.org/wiki/${encodeURIComponent((page.title || "").replace(/\s/g, "_"))}`,
      },
    ]),
  );

  const mappedPois = geoItems.map((geoItem) => {
    const details = detailsById.get(geoItem.pageid) || {};
    return {
      title: geoItem.title,
      description: details.description ?? null,
      image: details.image ?? null,
      link: details.link,
      distance: geoItem.dist ?? null,
      coord: { lat: geoItem.lat, lon: geoItem.lon },
    };
  });

  return mappedPois.sort(
    (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
  );
}
