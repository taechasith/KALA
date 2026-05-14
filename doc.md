# KALA Developer Documentation

This document is for future maintainers. It explains the data model, algorithms, visual systems, AI model contract, and project philosophy behind KALA.

## 1. Product Intent

KALA is a cinematic intelligence workbench for declassified UAP archive exploration. The goal is not to prove a claim. The goal is to make large sets of mixed archival evidence easier to inspect, connect, and question.

The interface uses an intelligence/HUD visual language because the archive itself is agency-heavy, document-heavy, and investigative. Visual drama is allowed only when it does not interrupt the workflow. Decorative canvases must not capture pointer events.

## 2. Architecture

KALA is a Vite React SPA with section-based navigation:

```text
App.jsx
  EntryLoader
  ImmersiveStars global background
  Navigation
  HeroSection
  StatsPanel
  GlobeView
  NetworkGraph
  DataCorrelation
  DocumentVault
  VideoArchive
  AIDecoder
```

Lazy-loaded sections are wrapped in `Suspense` and `ErrorBoundary` in `App.jsx`.

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

Do not duplicate these ids inside child components. Navigation uses these ids as canonical scroll targets.

## 3. Data Model

The canonical metadata lives in `src/data/manifest.js`.

### Agencies

`AGENCIES` maps short agency codes to display labels, colors, background tints, and icons.

Current codes:

```text
DOW, FBI, NASA, DOS, USAF, ARMY, VIDEO
```

### Types

`TYPES` maps document categories to labels and colors. Examples:

```text
mission-report
range-fouler
email
photo
transcript
cable
intelligence
incident-summary
video
```

### Documents

Each `DOCUMENTS` item should contain:

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

The `era` field is derived with `.map(d => ({ ...d, era: era(d.year) }))`.

### Videos

`VIDEOS` stores DOD video metadata, including DVIDS ids, year, location, and approximate size.

## 4. Era Model

The era classifier is a fixed threshold model:

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

Important caveat: `null <= 1945` evaluates to `true` in JavaScript because `null` coerces to `0`. Current unknown-year records therefore fall into `WWII`. If future analytical accuracy matters, replace this with an explicit unknown branch:

```js
if (!Number.isFinite(year)) return "UNKNOWN"
```

Changing this affects charts, relation weights, and filters.

## 5. Relation Algorithm

`computeRelations(docs)` creates an undirected weighted graph over the current document set.

For every unordered document pair `(a, b)`:

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

### Design Reasoning

Location gets a weight of `3` because it is the strongest low-noise relationship in this dataset. Agency, era, and type are weaker signals and should not create edges alone. They strengthen an already meaningful relation or create an edge only in combination.

The threshold `weight >= 3` gives these behaviors:

- Same known location creates an edge.
- Same agency plus same era plus same type creates an edge at `2.5`, so it does not pass alone.
- Same location plus agency/era/type increases edge strength.

This keeps the network from becoming a dense hairball.

## 6. Community Algorithm

`computeCommunities(docs)` is not graph modularity. It is a deterministic grouping utility:

```text
byLocation[location] -> [doc ids]
byAgency[agency]     -> [doc ids]
byEra[era]           -> [doc ids]
```

Use it for categorical summaries, not for inferred communities.

## 7. Statistics

`STATS` is derived from manifest data:

```text
totalDocs
totalVideos
agencies
locations
yearRange
redacted
totalSizeGB
```

`locations` excludes `"Unknown"` and `"Space"`.

Developer caution: the current FBI B-series entries use runtime random sizes:

```js
size: 80000 + Math.floor(Math.random() * 100000)
```

That makes `totalSizeGB` and generated bundles non-deterministic. Replace with fixed sizes if reproducibility matters.

## 8. KALA AI Model Contract

The UI should call this feature `KALA AI`.

The current backend implementation uses the Anthropic SDK and a configured Messages model. Keep provider details in backend code and developer docs, not in user-facing copy.

### `/api/analyze.js`

Purpose: structured analysis of text, PDF-derived text, images, video frames, or metadata-only records.

Inputs:

```text
content
filename
docId
docMeta
imageData
fileType
```

Modes:

- Image analysis: sends one base64 image.
- Video analysis: sends sampled frames from beginning, middle, and end.
- Text/PDF analysis: sends text content, truncated to 40,000 characters.
- Metadata-only assessment: uses manifest fields only and requires low confidence.

Output schema:

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

Metadata-only analysis must keep confidence below `0.4`.

### `/api/meta-analyze.js`

Purpose: question-answering over document metadata.

It loads up to 50 manifest rows and asks the model to answer with cited document ids.

Use this for collection-level questions such as:

- Which records are most related?
- Which locations repeat?
- Which agencies dominate a time period?
- What pattern appears in this subset?

## 9. Visualization Systems

### Global Starfield

`ImmersiveStars.jsx` renders layered Three.js point clouds with additive blending and fog.

Key parameters:

```text
density   number of stars
intensity multiplier for speed/visibility
speed     forward movement speed
className positioning and opacity
```

The global instance is mounted in `App.jsx`, behind all app content:

```jsx
<ImmersiveStars
  density={1900}
  intensity={0.9}
  speed={3.4}
  className="fixed inset-0 z-0 opacity-100"
/>
```

It must remain `pointer-events: none`.

### Spaceship

`GlobalSpaceship.jsx` is named historically, but it should only be mounted inside `HeroSection`.

Current hero usage:

```jsx
<GlobalSpaceship className="absolute inset-0" zIndex={1} />
```

Do not mount it in `App.jsx`; the product decision is that the spaceship floats only on the KALA hero page.

The flight model combines:

- scroll progress across the page
- time drift
- smootherstep depth easing
- subtle pointer nudge
- z-depth movement
- scale changes tied to depth
- pitch, yaw, and bank interpolation

The visual goal is forward/receding motion, not left-right sliding or flipping.

Core equations:

```js
phase = progress * 3.25 + drift
wave = phase * Math.PI * 2
approach = (Math.sin(wave - Math.PI / 2) + 1) / 2
depth = THREE.MathUtils.smootherstep(approach, 0, 1)

targetZ = lerp(-9.2, -1.65, depth)
targetScale = lerp(0.62, 1.42, depth)
```

Depth drives the perceived forward motion. Lateral and vertical motion are secondary.

## 10. UI and Interaction Rules

- Decorative canvases must use `pointer-events: none`.
- Navigation target ids belong in `App.jsx`.
- Keep section backgrounds translucent enough for stars to read, but dark enough for text contrast.
- Keep user-facing AI wording as `KALA AI`.
- Avoid provider names in visible UI.
- Respect reduced motion through `prefers-reduced-motion`.
- Do not place the 3D model over operational controls unless it is visually behind them and cannot receive input.

## 11. Performance Notes

Vite manual chunks are configured in `vite.config.js`:

```text
three
d3
framer
react
leaflet
```

Three.js is the largest chunk. Avoid adding more global canvases unless necessary. Prefer one reusable background starfield and one hero-only spaceship.

For long archive lists, consider virtualization if document counts grow above a few hundred visible cards.

## 12. Adding Records

When adding documents:

1. Add the location to `LOCATIONS` if it is new.
2. Add or reuse a `TYPES` key.
3. Add a deterministic `id`.
4. Use fixed `size` values.
5. Set `redacted` explicitly.
6. Confirm the `year` behavior is intended.
7. Run `npm run build`.

When adding videos:

1. Add a stable `id`.
2. Add `dvidshubId` if available.
3. Add title, location, year, agency `VIDEO`, and size.
4. Verify the DVIDS URL logic in `VideoArchive.jsx`.

## 13. Known Risks

- Unknown years currently classify as `WWII` because of JavaScript coercion.
- Some manifest strings show mojibake from encoding issues. Clean carefully and avoid broad search-replace operations.
- Global Three.js visuals can reduce performance on low-end devices. Tune `density`, `dpr`, and opacity before adding more effects.
- AI JSON extraction uses regex to pull the first object from model output. If model output changes, parsing can fail into `{ raw }`.

## 14. Verification Checklist

Before shipping:

```bash
npm run build
```

Then manually verify:

- KALA hero renders.
- Spaceship appears only in the hero section.
- Stars are visible across every page section.
- Navigation buttons scroll to the correct sections.
- Document vault filters work.
- Map markers render.
- Network graph renders and selected nodes show relations.
- KALA AI visible labels do not mention provider names.
- API routes work when `ANTHROPIC_API_KEY` is present.

## 15. Project Philosophy in One Sentence

KALA is a research instrument wrapped in cinematic atmosphere: the atmosphere invites exploration, but the data model, relation weights, confidence scoring, and source metadata keep the work grounded.
