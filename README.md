# KALA

KALA is an investigative web interface for exploring declassified UAP-related archive material. It combines document metadata, DOD video references, geospatial clustering, document relationship graphs, correlation dashboards, and AI-assisted document analysis into a single React/Vite application.

The project is designed for readers who need to understand an archive before drawing conclusions from it. Instead of presenting files as a flat list, KALA lets a reader ask: where did this record come from, what era does it belong to, what location does it describe, what other records are nearby in the data model, and how confident should an AI-assisted interpretation be?

## Research Context

KALA was developed under CreativeDev.Lab's SciFact to SciFi Interfaces research program at CreativeLabTH Group.

The interface uses the language of intelligence displays, star maps, relationship systems, and mission dashboards because the source material is archival, agency-heavy, and pattern-oriented. The visual design is cinematic, but the product goal is research support: make the archive easier to inspect, filter, connect, and question.

## What A Reader Can Do

KALA is useful when a reader wants to move through the archive from multiple angles:

- Start with the hero and archive overview to understand the size and time span of the collection.
- Use agency, era, type, and location summaries to see which parts of the archive dominate.
- Open the geospatial map to find repeated incident zones and location clusters.
- Explore the GitNexus document graph to inspect relationships between records.
- Use the correlation dashboard to compare years, agencies, document types, and locations.
- Search the document vault by title, id, location, filename, agency, type, and era.
- Open DOD video metadata and embedded DVIDS streams where public video ids are available.
- Send uploaded files, selected metadata records, images, or video frames to KALA AI for structured analysis.

KALA does not try to prove a claim by itself. It is an evidence navigation layer. The application helps the reader decide which records are worth opening, comparing, or questioning next.

## Core Principles

- Context first: every archive record should be connected to an agency, era, type, location, filename, size, redaction state, and related records.
- Evidence before speculation: AI output is structured, confidence-scored, and meant to support source review rather than replace it.
- Spatial thinking: maps, graphs, timelines, and correlation views are treated as first-class ways to read the same archive.
- Deterministic metadata: counts, filters, relations, and charts should come from stable manifest data whenever possible.
- Cinematic but usable: starfields, scanlines, HUD panels, and the 3D spaceship support atmosphere without blocking navigation or controls.

## Current Archive Scope

The current manifest contains:

| Area | Current Scope |
| --- | --- |
| Documents | 130 metadata records |
| Videos | 24 DOD video metadata records |
| Agencies represented in documents | 6 |
| Location zones counted in stats | 20 |
| Manifest location keys | 22 |
| Year range | 1944 to 2026 |
| Redacted records | 4 |
| Computed document relations | about 104 with the current manifest |

Document counts by agency:

| Agency | Count | Notes |
| --- | ---: | --- |
| FBI | 53 | Photo sets, 62-HQ-83894 sections, intelligence records |
| DOW | 44 | Mission reports, range fouler debriefs, emails, event records |
| USAF | 13 | Project Blue Book and related historical records |
| NASA | 12 | Apollo-era photo and transcript material |
| ARMY | 6 | Historical intelligence and flying disc records |
| DOS | 2 | Diplomatic cable records |

The video archive is modeled separately from documents. Videos use agency key `VIDEO`, but `VIDEO` is not included in the document agency count because the document and video collections are separate arrays.

## Main Product Areas

### Archive Intelligence

The statistics panel gives the reader a fast sense of scale. It shows total files, document count, video count, year span, agency distribution, era distribution, top locations, and redaction count.

This view answers basic orientation questions:

- How large is the collection?
- Which agencies appear most often?
- Which periods are overrepresented?
- Which locations repeat?
- How much of the collection has redaction flags?

### Global Incident Map

The map groups documents by known geographic location. `Unknown` and `Space` are intentionally excluded from map markers because they either cannot be mapped to a meaningful place or represent orbital context rather than a ground location.

Each marker represents a location group. Marker radius increases with the number of records in that group. Selecting a marker focuses the map and opens a panel listing related documents for that zone.

### GitNexus Document Network

The network graph uses D3 force simulation. Nodes represent documents, node color follows agency color, node size is influenced by file size, and edges represent computed relationships.

Relations are generated from shared metadata:

```text
same known location -> +3.0
same agency         -> +1.0
same era            -> +1.0
same type           -> +0.5
emit edge if weight >= 3
```

This keeps the graph from becoming too dense. A shared known location creates a strong edge on its own. Agency, era, and type are supporting signals.

### Data Correlation

The correlation dashboard gives the reader multiple chart views over the same manifest:

- incidents by year
- agency distribution
- top incident zones
- document type by era
- top agency, top location, peak year, and redaction count

These charts are not a statistical model. They are exploratory views that help a reader notice concentrations and gaps.

### Document Vault

The vault is the main document browsing surface. It supports search, agency filter, era filter, pagination, document details, file metadata, and handoff into the decoder.

Selecting a document opens a modal with:

- document id
- agency
- type
- year
- location
- era
- file size
- redaction status
- expected local archive path

The `DECODE WITH AI` action passes the selected document metadata into the decoder through `sessionStorage` and scrolls to the decoder section.

### UAP Footage

The video archive displays 24 DOD video metadata records. Some records have known DVIDS video ids and can be embedded or opened on DVIDS. Records without known public video ids fall back to a DVIDS search link.

This section is metadata-driven. The app does not store large video files in the repository.

### KALA AI Decoder

The decoder supports four analysis modes:

- metadata-only assessment from a selected manifest record
- text analysis for `.txt` and `.md`
- image analysis for common image formats
- video frame analysis by extracting representative frames client-side

PDF handling currently sends a binary/base64-derived placeholder path rather than true PDF text extraction. If full PDF understanding is required, add a dedicated client or server PDF text extraction step and send extracted text to the API.

KALA AI returns structured JSON with:

- executive summary
- visual description
- classification era
- document type
- key entities
- incident details
- significance
- significance reason
- related topics
- redaction level
- confidence score

Metadata-only analysis is required to keep confidence below `0.4` because no document body, image evidence, or video frame evidence has been decoded.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 4 through `@tailwindcss/vite`
- Three.js, `@react-three/fiber`, and `@react-three/drei`
- D3 for the document network
- Leaflet and React Leaflet for the map
- Framer Motion for transitions
- Recharts dependency available for charting
- PDF.js dependency available for future PDF extraction work
- Anthropic SDK behind the serverless KALA AI API routes

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

The user-facing product name is KALA AI. The current backend provider is configured in the API routes and should stay out of visible UI copy.

## API Routes

`api/analyze.js`

Handles structured analysis for selected metadata, text content, images, and sampled video frames. The route expects a POST request and returns `{ success, analysis, docId }` when successful.

`api/meta-analyze.js`

Handles collection-level questions over manifest metadata. It imports the manifest server-side, limits the prompt to the first 50 matching rows, asks the model to answer with document ids, then strips basic markdown characters from the returned text.

## Project Structure

```text
api/
  analyze.js          Structured KALA AI analysis endpoint
  meta-analyze.js     Metadata question-answer endpoint
public/
  spaceship.gltf      3D spaceship model used in the hero section
src/
  App.jsx             App shell, boot loader, section layout, lazy loading
  components/         UI sections, visual systems, archive tools
  data/manifest.js    Canonical archive metadata and relation functions
  index.css           Global styling, fonts, layout, HUD visual system
vite.config.js        Vite, Tailwind plugin, dev proxy, chunk splitting
```

## Important Implementation Details

The app is a single-page, section-based interface. Section ids are defined in `App.jsx` and used as scroll targets:

```text
hero
stats
globe
network
correlation
vault
video
decoder
```

The global starfield is mounted once behind all content. The 3D spaceship is mounted only in the hero section. Decorative canvas layers should not capture pointer events.

The manifest is the source of truth for records, agencies, types, eras, locations, videos, computed relations, computed communities, and summary stats.

## Data Model Summary

Documents are stored in `DOCUMENTS` with this shape:

```js
{
  id: "DOW-D3",
  agency: "DOW",
  type: "mission-report",
  year: 2020,
  title: "Mission Report - Arabian Gulf",
  location: "Arabian Gulf",
  filename: "DOW-UAP-D3-Mission-Report-Arabian-Gulf-2020.pdf",
  size: 101111,
  redacted: false
}
```

The `era` field is derived automatically from `year`.

Videos are stored in `VIDEOS` with this shape:

```js
{
  id: "DOD-V01",
  dvidshubId: "111688723",
  title: "UAP Encounter - Arabian Gulf",
  location: "Arabian Gulf",
  year: 2020,
  agency: "VIDEO",
  size: 6814452
}
```

## Known Caveats

- Unknown years currently classify as `WWII` because JavaScript evaluates `null <= 1945` as true.
- Some source strings contain mojibake from encoding issues. Clean these carefully instead of running broad replacements.
- FBI B-series photo sizes use runtime randomness in the manifest. That makes `totalSizeGB` non-deterministic between runs.
- PDF upload support does not currently extract semantic PDF text.
- The Vite dev proxy points `/api` to `http://localhost:3001`, but Vercel-style API routes are not automatically served by plain Vite. Local API testing may require a compatible serverless/dev setup.
- Some video records have DVIDS ids in manifest metadata and a separate embed id map in `VideoArchive.jsx`; keep those aligned when adding videos.

## Development Guidance

- Keep user-facing AI language as `KALA AI`.
- Keep provider names in backend or developer documentation, not visible product copy.
- Add archive records in `src/data/manifest.js` with stable ids and deterministic sizes.
- Add new locations to `LOCATIONS` before assigning documents to them.
- Use existing agency and type keys where possible.
- Run `npm run build` after documentation or code changes that could reveal import, syntax, or bundling issues.

## License

See `LICENSE`.
