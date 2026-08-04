# PCMC Water Watch

[![Live site](https://img.shields.io/badge/live-yashrajcc.github.io-0b6e7a?style=flat-square)](https://yashrajcc.github.io/pcmc-water-watch/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![RTI-led](https://img.shields.io/badge/data-RTI%20replies-1d4ed8?style=flat-square)](#data)
[![Civic tech](https://img.shields.io/badge/topic-civic%20tech-0f766e?style=flat-square)](#)
[![Pimpri-Chinchwad](https://img.shields.io/badge/city-PCMC-4338ca?style=flat-square)](#)
[![Made by yashrajcc](https://img.shields.io/badge/made%20by-yashrajcc-14323f?style=flat-square)](https://work.yashraj.cc)

A ward-level look at **drinking-water supply** in Pimpri-Chinchwad, built from Right to Information (RTI) replies.

**Live site:** https://yashrajcc.github.io/pcmc-water-watch/  
**Author:** [Yashraj Wadalkar](https://work.yashraj.cc) · independent citizen project (not affiliated with PCMC)

---

## What this is

Some parts of the city get more water than others. This map turns government RTI answers into something residents can actually read — one ward at a time.

| Layer | Status |
| --- | --- |
| Ward boundaries (66) | Full city |
| Water supply by ward | Partial — grey wards await more RTI replies |
| Recognised informal settlements | 37 settlements listed from PCMC records |

---

## Topics

`rti` · `water` · `open-data` · `civic-tech` · `pcmc` · `pimpri-chinchwad` · `leaflet` · `static-site` · `india`

---

## Repo layout

```
index.html          Page shell, hero, cards, map mount, settlements table, footer
styles.css          Layout and map overlay styles
map.js              Leaflet map, zone filter, hover card
data/
  wards_pcmc.js     Ward GeoJSON (browser-loadable)
  water_by_ward.js  Water metrics keyed by ward id (partial)
  …
```

---

## Data

- **Water metrics:** `data/water_by_ward.js` — only wards present in this object render as coloured; the rest stay grey.
- **Boundaries:** Bharatlas / DataMeet, CC BY 4.0.
- **Slum list:** transcribed from PCMC records on the page — **spot-check Devanagari/scanned figures before treating numbers as authoritative.**

To add a newly answered ward, add a key to `window.PCMC_WATER` and redeploy. No map code change required.

---

## Run locally

No build step:

```bash
# optional local server (recommended for sanity checks)
npx serve .
# or open index.html directly in a browser
```

Internet is required for basemap tiles (Carto / OSM) and the CDN Leaflet assets.

---

## Deploy

GitHub Pages serves from the `main` branch root:

https://yashrajcc.github.io/pcmc-water-watch/

---

## Work with us

This project works better as a mesh of residents, journalists, researchers, and RTI filers — not a closed product.

**You can help if you:**

- Have RTI replies for PCMC water hours, ESR capacity, coverage, or schedules
- Want to verify a ward’s numbers against the original reply
- Report an error in the settlements table or map attributes
- Want to write / translate explanations for Marathi-speaking audiences
- Can help host or digitise original PCMC documents

**How to plug in**

1. Open an [issue](https://github.com/yashrajcc/pcmc-water-watch/issues) with the ward number and what you know  
2. Email interest: [hello@yashraj.cc](mailto:hello@yashraj.cc?subject=PCMC%20Water%20Watch%20%E2%80%94%20work%20with%20us)  
3. Browse the maker’s other work: [work.yashraj.cc](https://work.yashraj.cc)

Please do **not** invent numbers. Grey is honest; fake colour is not.

---

## License

- **Code** — [MIT](LICENSE)  
- **Ward boundaries** — DataMeet / Bharatlas, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
- **RTI extracts** — government information disclosed under RTI; cite sources, do not claim affiliation with PCMC
