# KALA Developer Documentation

This document is for future maintainers. It explains the intent, architecture, data model, relation logic, visualization systems, AI API contract, operational caveats, and verification workflow behind KALA.

## 1. Product Intent

KALA is a cinematic intelligence workbench for exploring declassified UAP archive metadata, related DOD video references, and AI-assisted document interpretation.

The goal is not to make the interface appear authoritative by style alone. The goal is to help a reader move through an evidence set with more context than a file browser provides. A reader should be able to answer:

- What is in this archive?
- Which agencies dominate the current dataset?
- Which years, eras, and locations repeat?
- Which records are connected by shared metadata?
- Which files are redacted?
- Which records deserve deeper review?
- What does KALA AI infer, and how confident is that inference?

The interface deliberately uses a HUD/intelligence visual language because the source material is agency-heavy and pattern-oriented. Decorative visuals are acceptable only when they do not block research workflows.

## 2. Reader Mental Model

Think of KALA as four layers over one manifest:

1. Orientation: hero, boot sequence, archive stats, agency and era summaries.
2. Spatial analysis: map markers and location group panels.
3. Relationship analysis: D3 network edges from shared metadata.
4. Interpretation support: vault handoff and KALA AI structured analysis.

Every section should help the reader ask a better next question. Avoid UI copy that implies the app has proven a case. Prefer language that describes evidence, metadata, confidence, relation strength, or source context.

## 3. Runtime Architecture

KALA is a Vite React single-page app. It uses section-based navigation rather than a router.

Top-level layout in `src/App.jsx`:

```text
EntryLoader
ImmersiveStars
Navigation
HeroSection
StatsPanel
GlobeView
NetworkGraph
DataCorrelation
DocumentVault
VideoArchive
AIDecoder
Footer
```

The heavier sections are lazy-loaded with React `lazy` and wrapped in `Suspense` plus `ErrorBoundary`:

```text
GlobeView
NetworkGraph
DocumentVault
VideoArchive
AIDecoder
DataCorrelation
```

The root section ids live in `App.jsx`:

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

Treat those ids as canonical. Navigation and scroll handoffs depend on them.

## 4. Main Data Sources

The canonical app data lives in `src/data/manifest.js`.

Exports:

```text
AGENCIES
TYPES
ERAS
LOCATIONS
DOCUMENTS
VIDEOS
computeRelations(docs)
computeCommunities(docs)
STATS
```

The current manifest has:

```text
130 document records
24 video records
6 document agencies
22 location keys
20 counted non-Unknown, non-Space locations
4 redacted records
approximately 104 computed document relations
```

Because some FBI B-series sizes are generated with `Math.random`, `STATS.totalSizeGB` may vary slightly between runs. Do not rely on that value for strict tests until sizes are made deterministic.

## 5. Agency Model

`AGENCIES` maps agency codes to display metadata:

```js
DOW: {
  label: "Dept. of War",
  color: "#00d4ff",
  bg: "rgba(0,212,255,0.12)",
  icon: "..."
}
```

Current agency keys:

```text
DOW
FBI
NASA
DOS
USAF
ARMY
VIDEO
```

`VIDEO` is used for video metadata but is not counted as a document agency because videos live in the separate `VIDEOS` array.

Current document counts by agency:

```text
FBI   53
DOW   44
USAF  13
NASA  12
ARMY   6
DOS    2
```

When adding an agency:

1. Add a stable agency key to `AGENCIES`.
2. Provide a readable label.
3. Provide a color that works on the dark UI.
4. Confirm all components using `Object.keys(AGENCIES)` still make sense.
5. Confirm network colors, vault filters, stats bars, and map legends remain readable.

## 6. Type Model

`TYPES` maps document categories to display labels and colors.

Current active type counts:

```text
intelligence       35
mission-report     31
photo-series       24
photo              14
transcript          7
range-fouler        5
email               3
incident-summary    3
cable               2
composite-sketch    1
event-report        1
launch-summary      1
press-release       1
report              1
statement           1
```

Types affect:

- vault badges
- correlation matrix
- relation weights
- reader expectations about source format

Use existing type keys before creating new ones. If a new type is required, add it to `TYPES` first so every component has a label and color.

## 7. Era Model

Era classification is currently a fixed threshold function:

```js
function era(year) {
  if (year <= 1945) return "WWII"
  if (year <= 1960) return "POSTWAR"
  if (year <= 1979) return "COLDWAR"
  if (year <= 2010) return "MODERN1"
  if (year <= 2020) return "MODERN2"
  return "CURRENT"
}
```

Era ranges:

```text
WWII      1944-1945
POSTWAR   1946-1960
COLDWAR   1961-1979
MODERN1   1980-2010
MODERN2   2011-2020
CURRENT   2021-2026
```

Important caveat: `null <= 1945` evaluates to `true` in JavaScript. Unknown-year records therefore classify as `WWII` today.

If analytical accuracy matters more than preserving current counts, change the function to:

```js
function era(year) {
  if (!Number.isFinite(year)) return "UNKNOWN"
  if (year <= 1945) return "WWII"
  if (year <= 1960) return "POSTWAR"
  if (year <= 1979) return "COLDWAR"
  if (year <= 2010) return "MODERN1"
  if (year <= 2020) return "MODERN2"
  return "CURRENT"
}
```

That change will affect:

- stats panel era distribution
- data correlation matrix
- vault era filters
- network relation weights
- any AI prompts that include derived era

Do it as a deliberate migration, not as an incidental cleanup.

## 8. Location Model

`LOCATIONS` maps location names to latitude, longitude, and region:

```js
"Arabian Gulf": {
  lat: 26,
  lng: 52,
  region: "Middle East"
}
```

The map excludes:

```text
Unknown
Space
```

Reasons:

- `Unknown` cannot produce a useful geographic marker.
- `Space` is not a terrestrial incident zone and would distort the map.

Location names are also a high-weight relation signal. Renaming a location changes map grouping, relation edges, hot zone counts, and correlation charts. Prefer adding aliases deliberately in code only if there is a clear source reason.

## 9. Document Records

Document shape:

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

The exported `DOCUMENTS` array appends `era` to each row:

```js
].map(d => ({ ...d, era: era(d.year) }))
```

Required expectations:

- `id` must be unique and stable.
- `agency` should exist in `AGENCIES`.
- `type` should exist in `TYPES`.
- `location` should exist in `LOCATIONS`.
- `size` should be a number of bytes.
- `redacted` should be explicit.
- `year` can be `null`, but the current era behavior for `null` is known to be inaccurate.

Adding documents without matching agency/type/location definitions can produce missing labels, fallback colors, map omissions, or unclear filter output.

## 10. Video Records

Video shape:

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

`VideoArchive.jsx` also contains a `DVIDS_IDS` map used for actual embeds and links:

```js
const DVIDS_IDS = {
  "DOD-V01": 1006104
}
```

Keep manifest video metadata and the embed id map aligned. If a video has no known DVIDS embed id, the UI falls back to a DVIDS search link.

## 11. Statistics

`STATS` is computed in `manifest.js`:

```js
export const STATS = {
  totalDocs: DOCUMENTS.length,
  totalVideos: VIDEOS.length,
  agencies: [...new Set(DOCUMENTS.map(d => d.agency))].length,
  locations: [...new Set(DOCUMENTS.map(d => d.location).filter(l => l !== "Unknown" && l !== "Space"))].length,
  yearRange: [1944, 2026],
  redacted: DOCUMENTS.filter(d => d.redacted).length,
  totalSizeGB: (DOCUMENTS.reduce((s, d) => s + d.size, 0) / 1e9).toFixed(1),
}
```

`yearRange` is currently hard-coded. If records outside 1944-2026 are added, either update the hard-coded range or derive it from finite years.

## 12. Relation Algorithm

`computeRelations(docs)` creates an undirected weighted graph over the supplied document set.

For every unordered document pair:

```text
weight = 0
type = null

if same non-Unknown location:
  weight += 3
  type = "location"

if same agency:
  weight += 1
  type = type || "agency"

if same era:
  weight += 1
  type = type || "era"

if same document type:
  weight += 0.5
  type = type || "type"

if weight >= 3:
  emit { source, target, weight, type }
```

Design reasoning:

- Location is the strongest low-noise metadata signal.
- Agency alone is too broad.
- Era alone is too broad.
- Type alone is too broad.
- A same-location edge should exist even when agency or type differs.
- Supporting matches increase edge strength but should not flood the graph.

Current behavior examples:

```text
Same known location only                    -> 3.0, edge emitted
Same agency + same era + same type          -> 2.5, no edge
Same location + same agency                 -> 4.0, edge emitted
Same location + same agency + same era      -> 5.0, edge emitted
Same location + same agency + same era/type -> 5.5, edge emitted
```

The `type` stored on the edge is the first relation category that contributed to the edge, with location taking priority. It is a label, not a full explanation of every contributing factor.

## 13. Community Utility

`computeCommunities(docs)` is not graph modularity or machine-learned clustering. It returns deterministic groupings:

```text
byLocation[location] -> [doc ids]
byAgency[agency]     -> [doc ids]
byEra[era]           -> [doc ids]
```

Use it for categorical grouping. Do not describe it as inferred community detection unless the implementation changes.

## 14. Section Behavior

### Entry Loader

`EntryLoader` is a temporary boot screen displayed for about 2.2 seconds. It mounts its own starfield and loading UI, then the main app renders.

### Global Starfield

`ImmersiveStars.jsx` renders Three.js point clouds behind the app. The global instance is mounted in `App.jsx`:

```jsx
<ImmersiveStars
  density={1900}
  intensity={0.9}
  speed={3.4}
  className="fixed inset-0 z-0 opacity-100"
/>
```

Rules:

- Keep the global starfield behind app content.
- Keep decorative canvas layers non-interactive.
- Avoid adding additional full-page canvases without measuring performance.

### Hero Spaceship

`GlobalSpaceship.jsx` is historically named but should only be mounted inside `HeroSection`.

The intended behavior is forward/receding motion with subtle drift. The product decision is that the spaceship belongs to the first viewport, not every section.

Core motion logic uses:

```text
scroll progress
time drift
smootherstep depth easing
pointer nudge
z-depth interpolation
scale interpolation
pitch, yaw, and bank interpolation
```

The important perceived effect is depth, not lateral sliding.

### Stats Panel

`StatsPanel.jsx` derives counts from `DOCUMENTS` and `STATS`. It shows:

- total files
- document count
- video count
- year span
- agency bars
- era distribution
- top locations
- redaction notice

If counts look wrong, inspect `manifest.js` first.

### Globe View

`GlobeView.jsx` groups documents by mappable location, renders a Leaflet map, and displays active zones.

Implementation details:

- Uses Carto dark tiles.
- Groups records with `useIncidentGroups`.
- Excludes `Unknown` and `Space`.
- Defaults selected zone to the largest available group.
- Uses `flyTo` for marker focus and reset.

### Network Graph

`NetworkGraph.jsx` uses D3 force simulation over filtered documents.

Important details:

- Agency filters rebuild the graph.
- Relations are recomputed against the filtered document list.
- Links are sliced before rendering to cap visual complexity.
- Nodes can be dragged.
- The selected node panel shows document metadata and related docs.
- Edge hover shows source, target, relation label, and weight.

The `relationMode` state currently changes button styling only. It does not filter edges. If relation mode should become functional, filter `relations` or `filteredLinks` by selected mode.

### Data Correlation

`DataCorrelation.jsx` renders exploratory charts from `DOCUMENTS`:

- yearly bar chart
- agency donut
- location bars
- era by document type matrix
- key correlation summary

These are descriptive charts. Avoid copy that implies causal findings.

### Document Vault

`DocumentVault.jsx` provides:

- search by title, id, location, filename
- agency filter
- era filter
- paginated cards
- document detail modal
- handoff to decoder

The modal displays an expected local file path derived from:

```js
const FILE_ROOT = "C:/Users/HP OMEN/KALA/data/Release_1/Release_1/"
```

That path is environment-specific. If this project must run on other machines, replace it with a configurable or relative display strategy.

### Video Archive

`VideoArchive.jsx` renders video metadata tiles, thumbnail attempts, modal embeds, and DVIDS links.

Important details:

- Some videos have known embed ids in `DVIDS_IDS`.
- Unknown embed ids fall back to search.
- Thumbnails are loaded from DVIDS when an id is available.
- The app stores metadata, not local video files.

### AI Decoder

`AIDecoder.jsx` supports selected manifest records and user-uploaded files.

Client-side modes:

```text
text   -> FileReader text
image  -> base64 image
video  -> extract 3 frames with canvas
pdf    -> binary/base64 placeholder path
record -> metadata-only selected document
```

The decoder shows:

- selected file or document
- file type badge
- image/video preview when available
- structured analysis output
- collection-level metadata question box

The selected document handoff uses:

```js
sessionStorage.setItem("kala-decode-doc", JSON.stringify(doc))
document.getElementById("decoder")?.scrollIntoView({ behavior: "smooth" })
```

## 15. KALA AI API Contract

The visible product name is KALA AI. Keep provider implementation details out of user-facing UI.

### `api/analyze.js`

Purpose: structured analysis of document text, selected metadata, images, or video frames.

Accepted POST body fields:

```text
content
filename
docId
docMeta
imageData
fileType
```

Request modes:

```text
imageData without isVideo -> single image analysis
imageData with isVideo    -> sampled video frame analysis
content text              -> text or PDF placeholder analysis
docMeta                   -> metadata-only analysis
```

Current model call:

```js
client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1500,
  system: systemPrompt,
  messages: [{ role: "user", content: messageContent }]
})
```

Expected output schema:

```json
{
  "summary": "2-3 sentence executive summary",
  "visual_description": "for images/video: what is visually depicted",
  "classification_era": "WWII|POSTWAR|COLDWAR|MODERN1|MODERN2|CURRENT",
  "document_type": "single word type",
  "key_entities": {
    "locations": [],
    "dates": [],
    "objects": [],
    "witnesses": [],
    "agencies": [],
    "classifications": []
  },
  "incident_details": {
    "description": "",
    "behavior": "",
    "duration": "",
    "sensor_data": ""
  },
  "significance": "LOW|MEDIUM|HIGH|CRITICAL",
  "significance_reason": "",
  "related_topics": [],
  "redaction_level": "NONE|PARTIAL|HEAVY",
  "confidence_score": 0.0
}
```

Metadata-only analysis must keep `confidence_score` below `0.4`.

Parsing behavior:

```js
const jsonMatch = raw.match(/\{[\s\S]*\}/)
parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw }
```

Risk: if the model returns prose containing more than one JSON-like object, the regex may capture too much or the wrong object. A stricter JSON extraction strategy would be safer.

### `api/meta-analyze.js`

Purpose: answer collection-level questions using manifest metadata.

Behavior:

1. Imports `DOCUMENTS` from the manifest.
2. Filters by `docIds` if provided.
3. Uses up to 50 rows.
4. Formats each row as id, title, agency, type, year, and location.
5. Asks the model to cite document ids.
6. Strips simple markdown characters before returning text.

Use this route for questions like:

- Which records are most related?
- Which locations repeat?
- Which agencies dominate this subset?
- What patterns appear across this filtered group?

## 16. Local Development Notes

Install dependencies:

```bash
npm install
```

Run frontend dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

Vite config includes a proxy:

```js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
    }
  }
}
```

Plain Vite does not automatically run Vercel-style API files. For local AI route testing, run an API-compatible dev server or adapt the routes into a local backend.

Environment variable required for AI routes:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

## 17. Build And Chunking

`vite.config.js` defines manual chunks:

```text
three
d3
framer
react
leaflet
```

Three.js is the largest visual dependency. Keep full-scene Three.js usage intentional. The current design has one global starfield and one hero-only spaceship.

## 18. Styling And UX Rules

Follow these rules to preserve the app's character and usability:

- Keep KALA AI wording stable in visible UI.
- Keep provider names out of visible UI.
- Keep section ids canonical in `App.jsx`.
- Do not mount the spaceship globally.
- Keep decorative visuals behind operational controls.
- Preserve dark contrast for map, graph, and vault surfaces.
- Use existing color tokens and agency colors before adding new palettes.
- Keep controls readable at mobile widths.
- Respect reduced-motion expectations when adding new animation.
- Avoid implying that AI output is source truth.

## 19. Adding New Documents

Checklist:

1. Add new location to `LOCATIONS` if needed.
2. Add or reuse a `TYPES` key.
3. Confirm agency exists in `AGENCIES`.
4. Add a unique deterministic `id`.
5. Add a clear `title`.
6. Add `year` or explicitly use `null`.
7. Add exact `location`.
8. Add source `filename`.
9. Add deterministic byte `size`.
10. Set `redacted` explicitly.
11. Verify derived era is acceptable.
12. Run `npm run build`.
13. Manually inspect stats, vault filters, relation graph, and map grouping.

Avoid runtime randomness in new metadata. Counts and builds are easier to reason about when records are stable.

## 20. Adding New Videos

Checklist:

1. Add a stable `id`.
2. Add title, location, year, agency `VIDEO`, and size.
3. Add source DVIDS metadata if available.
4. Update `DVIDS_IDS` in `VideoArchive.jsx` if an embeddable id exists.
5. Confirm the modal opens.
6. Confirm fallback search behavior for missing ids.
7. Run `npm run build`.

## 21. Known Risks And Maintenance Debt

Known issues:

- Unknown years classify as `WWII`.
- Some strings contain encoding artifacts.
- Random FBI B-series sizes make size stats non-deterministic.
- PDF uploads do not perform true PDF text extraction.
- AI JSON parsing is regex-based.
- `relationMode` in the network UI is visual state only.
- The document vault file root is machine-specific.
- Vite dev proxy expects a separate API server on port 3001.
- Manifest video `dvidshubId` and `VideoArchive.jsx` embed ids can drift if only one is updated.

Recommended cleanup order:

1. Fix unknown-year era handling with an explicit `UNKNOWN` migration.
2. Replace random sizes with fixed byte values.
3. Add real PDF text extraction.
4. Make network relation mode filter edges.
5. Move environment-specific file root to configuration.
6. Replace regex JSON parsing with a stricter structured output strategy.
7. Normalize encoding artifacts carefully with targeted edits.

## 22. Verification Checklist

Run:

```bash
npm run build
```

Manual verification:

```text
Boot loader appears and exits.
Hero renders.
Spaceship appears only in the hero section.
Global stars remain behind content.
Navigation scrolls to all section ids.
Stats counts match manifest expectations.
Map markers render and selected zones focus correctly.
Network graph renders, drags, zooms, and shows selected nodes.
Correlation charts render without label overlap.
Vault search, agency filter, era filter, pagination, and modal work.
Vault handoff scrolls to the decoder and selects the document.
Video tiles open modals and DVIDS links behave correctly.
KALA AI labels do not expose provider names in visible UI.
API routes return useful errors when the API key is missing.
API routes work when the API key and compatible backend are present.
```

## 23. Project Philosophy In One Sentence

KALA is a research instrument wrapped in cinematic atmosphere: the atmosphere invites exploration, but the data model, relation weights, confidence scoring, and source metadata keep the work grounded.
