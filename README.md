# KALA

KALA is an investigative interface for exploring declassified UAP-related documents, video metadata, geospatial clusters, relationship networks, and AI-assisted document analysis.

The project is built as a React/Vite single-page app with Three.js visual layers, D3 relationship rendering, Leaflet geospatial views, Framer Motion transitions, and serverless API routes for KALA AI analysis.

## Philosophy

KALA treats archival research as navigation through evidence, not as a static file list. The interface is designed around four principles:

- Context first: every document is connected to agency, era, location, type, and related files.
- Evidence before speculation: AI output is structured with confidence and should support investigation, not replace source review.
- Spatial thinking: maps, networks, timelines, and correlations are first-class views of the same archive.
- Cinematic but usable: the starfield, 3D spaceship, scanlines, and HUD styling are decorative layers with `pointer-events: none` so the research workflow remains usable.

## Features

- KALA hero page with localized 3D spaceship motion.
- Immersive Three.js starfield across all page backgrounds.
- Intelligence overview with count-up statistics, agency breakdowns, era distribution, and hot zones.
- Geospatial map of document locations.
- GitNexus relationship graph for related documents.
- Correlation dashboard for agency, type, era, and location patterns.
- Document vault with agency and era filters.
- DOD video archive metadata and DVIDS links.
- KALA AI decoder for text, PDFs, images, video frames, and metadata-only assessments.

## Tech Stack

- React 18
- Vite
- Tailwind CSS 4
- Three.js, `@react-three/fiber`, `@react-three/drei`
- D3
- Leaflet and React Leaflet
- Framer Motion
- Recharts
- PDF.js
- Anthropic SDK behind the KALA AI API wrapper

## Getting Started

Install dependencies:

```bash
npm install
```

Run the Vite dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment

Create `.env` from `.env.example`.

Required for AI analysis routes:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

The app presents this capability as KALA AI. The current server implementation uses Anthropic's Messages API as the backing model provider.

## Project Structure

```text
api/
  analyze.js          KALA AI structured analysis endpoint
  meta-analyze.js     Metadata question-answer endpoint
public/
  spaceship.gltf      3D model used on the KALA hero page
src/
  App.jsx             App shell, loading screen, routing-by-section layout
  components/         UI, visualizations, starfield, 3D ship, archive tools
  data/manifest.js    Canonical archive metadata and relation algorithms
  index.css           Global styling and visual system
```

## Core Algorithms

The archive model starts with `DOCUMENTS`, `VIDEOS`, `AGENCIES`, `TYPES`, `ERAS`, and `LOCATIONS` in `src/data/manifest.js`.

Era classification:

```text
year <= 1945        -> WWII
year <= 1960        -> POSTWAR
year <= 1979        -> COLDWAR
year <= 2010        -> MODERN1
year <= 2020        -> MODERN2
otherwise           -> CURRENT
```

Document relations are computed pairwise:

```text
same non-Unknown location -> +3.0
same agency               -> +1.0
same era                  -> +1.0
same type                 -> +0.5
emit edge if weight >= 3
```

This intentionally makes location the strongest signal. Agency, era, and type act as supporting evidence rather than creating weak edges by themselves.

## AI Model Contract

KALA AI returns structured JSON with:

- executive summary
- visual description
- classification era
- document type
- key entities
- incident details
- significance
- related topics
- redaction level
- confidence score

Metadata-only analysis is required to keep `confidence_score` below `0.4`, because no document body or visual evidence has been decoded yet.

## Developer Notes

- Keep user-facing language branded as `KALA AI`.
- Do not mount the spaceship globally. It should stay in the KALA hero page only.
- Starfield canvases must remain `pointer-events: none`.
- When adding archive records, prefer deterministic metadata. Avoid runtime randomness for values that affect totals, layout, or tests.
- If adding new model providers, keep the UI brand stable and isolate provider names to backend documentation/config.

## License

See `LICENSE`.
