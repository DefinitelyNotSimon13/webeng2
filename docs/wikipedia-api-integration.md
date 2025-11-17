# Wikipedia Geosearch API Integration

## Übersicht

Diese Implementierung erfüllt die User Story "Setup basic connection to Wikipedia Geosearch API" und ermöglicht es, Wikipedia-Artikel in der Nähe einer geografischen Position zu finden.

## Erstellte Dateien

### Core-Service

- **`src/config/wikiConfig.js`** - Konfiguration für Sprache und Standard-Radius
- **`src/services/wikiGeoService.js`** - Wikipedia API Service mit `fetchNearby()` Funktion

### React Integration

- **`src/hooks/useNearbyWikipedia.js`** - React Hook für State-Management (loading/error/data)
- **`src/components/poi-list.jsx`** - UI-Komponente zur Anzeige der POIs
- **`src/css/poi-list.css`** - Styling für die POI-Liste

### Demo

- **`src/pages/wikipedia-pois.jsx`** - Demo-Seite zum Testen der Integration

### Konfiguration

- **`.env`** - Environment-Variablen für Sprache und Radius

## API-Struktur

### `fetchNearby({ lat, lon, radius, lang })`

**Parameter:**

- `lat` (number, required): Breitengrad [-90, 90]
- `lon` (number, required): Längengrad [-180, 180]
- `radius` (number, optional): Suchradius in Metern (Standard: 1000m aus .env)
- `lang` (string, optional): Wikipedia-Sprache (Standard: 'de' aus .env)

**Rückgabe:**

```javascript
[
  {
    title: "Brandenburger Tor",
    description: "Das Brandenburger Tor ist ein...",
    image: "https://upload.wikimedia.org/...",
    link: "https://de.wikipedia.org/wiki/Brandenburger_Tor",
    distance: 234, // Meter
    coord: { lat: 52.5163, lon: 13.3777 },
  },
  // ... sortiert nach distance aufsteigend
];
```

**Fehlerbehandlung:**

- `ValidationError`: Bei ungültigen Parametern (lat/lon/radius/lang)
- `ApiError`: Bei Netzwerk- oder API-Fehlern
- Leeres Array: Wenn keine POIs gefunden wurden (kein Error)

## Verwendung

### Einfaches Beispiel mit dem Hook

```javascript
import { useNearbyWikipedia } from "../hooks/useNearbyWikipedia";
import PoiList from "../components/poi-list";

function MyComponent() {
  const { loading, error, data } = useNearbyWikipedia({
    center: { lat: 52.52, lon: 13.405 }, // Berlin
    radius: 1000, // optional
    lang: "de", // optional
  });

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler: {error}</div>;
  return <PoiList items={data} />;
}
```

### Direkter Service-Aufruf

```javascript
import { fetchNearby } from "../services/wikiGeoService";

async function searchPois() {
  try {
    const pois = await fetchNearby({
      lat: 48.1351,
      lon: 11.582,
      radius: 2000,
      lang: "de",
    });
    console.log(`${pois.length} POIs gefunden`);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Ungültige Parameter:", error.message);
    } else if (error.name === "ApiError") {
      console.error("API-Fehler:", error.message);
    }
  }
}
```

## Konfiguration

Die Datei `.env` im Projekt-Root:

```env
VITE_WIKI_LANG=de
VITE_WIKI_DEFAULT_RADIUS=1000
```

Diese Werte werden als Fallback verwendet, wenn keine Parameter übergeben werden.

## Acceptance Criteria - Erfüllt ✓

- ✅ **API-Request**: Wird bei Aufruf mit gültiger center-Position ausgeführt
- ✅ **Loading State**: Hook liefert `loading: true` während des Requests
- ✅ **Erfolgreiche Response**:
  - Array sortiert nach `distance` aufsteigend
  - Jedes Item enthält: `title`, `link`, `distance`, `coord`
  - `description` und `image` werden aus Wikipedia-API geladen
- ✅ **Fehlerbehandlung**:
  - Klare Fehlermeldung bei Netzwerk-/API-Fehler
  - App bleibt stabil
- ✅ **Parameter-Validierung**:
  - Ungültige lat/lon/radius → ValidationError
  - Kein Netzwerk-Request bei Validation-Fehler
- ✅ **Keine Treffer**: Leeres Array, kein Error
- ✅ **Konfigurierbar**: Sprache und Radius über .env/.config

## Wikipedia API Details

Der Service nutzt zwei API-Aufrufe:

1. **Geosearch** (`action=query&list=geosearch`):
   - Liefert: pageid, title, distance, coordinates

2. **Page Details** (`prop=pageimages|extracts|info`):
   - Liefert: description (extract), image (thumbnail), link (fullurl)

Beide werden kombiniert zu einem vollständigen POI-Objekt.

## Demo ausprobieren

1. Die Demo-Seite in `src/js/routes.js` einbinden:

```javascript
import WikipediaPoisPage from "../pages/wikipedia-pois.jsx";

const routes = [
  // ... existing routes
  {
    path: "/wikipedia-pois/",
    component: WikipediaPoisPage,
  },
];
```

2. App starten und `/wikipedia-pois/` aufrufen
3. Standard-Koordinaten sind Berlin Mitte (52.5200, 13.4050)
4. "POIs suchen" klicken

## Nächste Schritte

- Integration mit einer Karten-Komponente (z.B. Leaflet, MapLibre)
- Auto-Fetch bei Map-Movement
- Caching der Ergebnisse
- Pagination für mehr als 50 POIs
- Erweiterte Metadaten (Kategorien, Wikidata-IDs)
