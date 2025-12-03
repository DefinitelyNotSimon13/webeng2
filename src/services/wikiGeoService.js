const WIKI_DEFAULT_LANG = "en";
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

function validateParams({ lat, lng, radius, lang }) {
  const errors = [];

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    errors.push("lat must be in range [-90, 90]");
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    errors.push("lng must be in range [-180, 180]");
  }

  const r = radius ?? WIKI_DEFAULT_RADIUS;
  if (!Number.isFinite(r) || r <= 0) {
    errors.push("radius must be > 0");
  }

  const langValue = lang ?? WIKI_DEFAULT_LANG;
  const l = (langValue ? langValue : "").toString().toLowerCase();
  if (!/^[a-z]{2,3}$/.test(l)) {
    errors.push('lang must be an ISO language code like "de" or "en"');
  }

  if (errors.length) {
    throw new ValidationError(`Invalid parameters: ${errors.join("; ")}`);
  }

  return { lat, lng, radius: Math.floor(r), lang: l };
}

function buildQueryString(params) {
  return new URLSearchParams(params).toString();
}

export async function fetchNearby({ lat, lng, radius, lang, signal } = {}) {
  const validated = validateParams({ lat, lng, radius, lang });
  const endpoint = `https://${validated.lang}.wikipedia.org/w/api.php`;

  const geoUrl = `${endpoint}?${buildQueryString({
    action: "query",
    list: "geosearch",
    gscoord: `${validated.lat}|${validated.lng}`,
    gsradius: String(validated.radius),
    gslimit: "50",
    format: "json",
    origin: "*",
  })}`;

  const geoResponse = await fetch(geoUrl, { signal });
  if (!geoResponse.ok) {
    throw new ApiError(
      `Wikipedia API error: ${geoResponse.status} ${geoResponse.statusText}`,
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

  const detailsResponse = await fetch(detailsUrl, { signal });
  if (!detailsResponse.ok) {
    throw new ApiError(
      `Wikipedia API error: ${detailsResponse.status} ${detailsResponse.statusText}`,
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
      coord: { lat: geoItem.lat, lng: geoItem.lng },
    };
  });

  return mappedPois.sort(
    (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
  );
}
