# Reading Comfort Pacer — visual thesis

## Direction: topographic cartography

The product treats sustained reading as a route, not a stopwatch. Fine contour lines represent attention moving steadily across a page; a clearly marked “saddle” represents the next natural place to pause. The interface borrows the restraint of a field map—ink, paper, coordinates, and one vermilion route marker—without becoming nostalgic or ornamental. Decoration always explains either progress, a boundary, or the shift from near focus to a distant horizon.

## Palette

Light is a warm map sheet: `paper #F4F0E6`, `paper-raised #FFFDF7`, `ink #18241F`, `muted #526058`, `contour #B8C2B4`, `route #B33A2E`, `route-dark #84271F`, `forest #1E5B49`, `warning #7A4B0B`, `danger #982F2F`. Dark is a night navigation sheet: `night #101815`, `night-raised #18231E`, `chalk #F5F0E5`, `night-muted #B8C4BC`, `night-contour #52645A`, with `route #F07B68`. Text and controls meet WCAG AA; status is always expressed with words and shape, never color alone.

## Type and spacing

The UI uses self-hosted **Atkinson Hyperlegible Next** (SIL OFL) for high legibility under visual fatigue, with the system monospace stack reserved for coordinates, durations, and small map labels. The scale is 12, 14, 16, 20, 28, and 44px with 1.5 body leading. Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, 72. Reading measures stay between 45 and 70 characters. Controls are at least 44px tall.

## Interaction grammar

The countdown is a route estimate, not a productivity score. When it reaches zero the state becomes “Boundary requested”; nothing covers the page. The primary marker-shaped control confirms “I’m at a stopping point.” Only then does the separate distance-view page open. Snooze moves the route marker ten minutes ahead. Disable is explicit and reversible. A keyboard command offers the same boundary action. Settings live in a compact field-notes panel; completion statistics are local and deliberately modest.

## Motion and depth

Transitions last 180–240ms and use opacity plus small transforms: a marker settles onto a contour; the distance horizon opens from the confirmed boundary. The break view has a single slow breathing ring with a pause control. Under `prefers-reduced-motion`, transforms and looping animation are removed and state changes are immediate; depth remains through scale, borders, and tonal layers. Nothing flashes.

## Original asset plan and provenance

- `assets/src/distant-ridge.png` and optimized site variants: an original editorial topographic landscape used to explain the move from near screen focus to a distant view. Generated with the factory Azure OpenAI image deployment (`factory-image`) on 2026-08-28. The generated asset is decorative and disclosed as AI-generated in the footer.
- Hand-authored contour SVG/CSS motifs and marker icons are original to this repository and MIT licensed with the product.

### Prompt sheet

Subject: a wide, uninhabited distant ridgeline seen across an open valley, with a small cartographic waypoint in the far distance. World: contemporary topographic field map translated into quiet editorial printmaking. Materials: warm uncoated paper, graphite contour lines, sparse mineral pigments. Light/lens: soft overcast dawn, long-distance compressed view, generous empty sky. Palette words: lichen green, warm paper, charcoal ink, restrained vermilion, slate haze. Composition: panoramic 3:2, horizon in lower third, calm negative space on the left, crisp silhouette and subtle contour strata. Negative list: no people, no faces, no buildings, no devices, no text, no letters, no watermark, no logo, no gradients, no neon, no photoreal stock-photo finish, no medical imagery.

Exact generation prompt: “Wide uninhabited distant ridgeline across an open valley, one tiny abstract cartographic waypoint in the far distance; contemporary topographic field map rendered as refined editorial printmaking on warm uncoated paper, graphite contour lines, sparse lichen green and slate mineral pigments with one restrained vermilion accent, soft overcast dawn, long-distance compressed view, panoramic 3:2 composition, horizon in lower third, calm negative space on left, crisp silhouette, subtle contour strata, tactile paper grain. No people, faces, buildings, devices, text, letters, watermark, logos, gradients, neon, stock-photo finish, or medical imagery.”
