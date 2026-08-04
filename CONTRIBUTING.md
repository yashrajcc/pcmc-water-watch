# Contributing to PCMC Water Watch

Thanks for helping keep this honest and useful.

## Ground rules

1. **No invented supply data.** Only add ward water metrics that come from an RTI reply or a cited official document.
2. **Grey over guesswork.** Missing data stays grey on the map.
3. **Spot-check scanned Devanagari** before changing household/population figures in the settlements table.
4. **Independent project** — do not present this repo as official PCMC material.

## Ways to contribute

| Path | What to do |
| --- | --- |
| New RTI numbers | Open an issue with ward id, source date, and values; or PR an addition to `data/water_by_ward.js` |
| Bug / wrong figure | Issue with “before → after” and a photo/scan of the source if possible |
| Copy / translation | PR against `index.html` prose (keep map behaviour untouched unless discussed) |
| Code | Keep the site static (no build step); match existing HTML/CSS/JS style |

## Adding a ward with data

1. Edit `data/water_by_ward.js` — add a key matching `wardnum` in the GeoJSON (e.g. `"12"` or `"58_1"`).
2. Bump `PCMC_WATER_META.withData` if you use it for counts.
3. Open a PR describing the RTI source.

Required fields (same shape as existing entries):

```js
"12": {
  wardnum: "12",
  zone: "F",
  locality: "…",
  status: "adequate" | "stressed" | "deficit",
  supplyHoursPerDay: 2.0,
  schedule: "…",
  source: "…",
  pressure: "Low" | "Medium" | "High",
  householdConnections: 1000,
  coveragePct: 70,
  esrCapacityMld: 1.0,
  lastUpdated: "YYYY-MM-DD",
  notes: "…"
}
```

## Work with us

Journalists, residents, researchers, and RTI practitioners are welcome. See the **Work with us** section in [README.md](README.md#work-with-us).
