NEITC Challenge 2026 photographs used by the GRIP case study.

Wired up in `src/data/grip.js`:
  heroImage        -> team-champions-trophy.jpg
  gallery[].src    -> the seven files here

To swap or add a photo, drop the file in this folder and point the
corresponding entry in grip.js at it. A gallery slot with `src: null`
renders as a labelled placeholder instead.
