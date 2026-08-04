/* Leaflet map + hover overlay. Grey = no joinable fragment; colour = in PCMC_WATER. */
(function () {
  const geojson = window.PCMC_WARDS;
  const waterByWard = window.PCMC_WATER || {};
  const meta = window.PCMC_WATER_META || {};
  const card = document.getElementById("ward-card");
  const cardBody = document.getElementById("card-body");
  const cardEmpty = document.getElementById("card-empty");
  const idle = document.getElementById("map-idle");
  const chips = document.querySelectorAll(".zone-chip");

  if (!geojson || !card || typeof L === "undefined") return;

  const ZONE_COLORS = {
    A: "#0f766e",
    B: "#0369a1",
    C: "#1d4ed8",
    D: "#0e7490",
    E: "#4338ca",
    F: "#155e75",
  };

  const STATUS_LABEL = {
    partial: "Partial scrap",
    opaque: "Opaque scrap",
    adequate: "Adequate",
    stressed: "Stressed",
    deficit: "Deficit",
  };

  const totalWards = meta.totalWards || 66;
  const withData = meta.withData || Object.keys(waterByWard).length;
  const noData = totalWards - withData;

  const legendWith = document.getElementById("legend-with-data");
  const legendNo = document.getElementById("legend-nodata");
  if (legendWith) legendWith.textContent = String(withData);
  if (legendNo) legendNo.textContent = String(noData);

  let activeZone = "";

  const els = {
    eyebrow: document.getElementById("card-eyebrow"),
    title: document.getElementById("card-title"),
    locality: document.getElementById("card-locality"),
    status: document.getElementById("card-status"),
    hours: document.getElementById("card-hours"),
    hoursBar: document.getElementById("card-hours-bar"),
    schedule: document.getElementById("card-schedule"),
    planned: document.getElementById("card-planned"),
    actual: document.getElementById("card-actual"),
    shortfall: document.getElementById("card-shortfall"),
    years: document.getElementById("card-years"),
    source: document.getElementById("card-source"),
    notes: document.getElementById("card-notes"),
    updated: document.getElementById("card-updated"),
  };

  function hasData(wardKey) {
    return Object.prototype.hasOwnProperty.call(waterByWard, String(wardKey));
  }

  function missing(text) {
    return '<span class="field-missing">' + text + "</span>";
  }

  function textOrMissing(value, fallback) {
    if (value == null || value === "") return missing(fallback || "Not disclosed");
    return value;
  }

  const map = L.map("map", {
    scrollWheelZoom: true,
    attributionControl: true,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }).addTo(map);

  function wardStyle(feature) {
    const ward = feature.properties.wardnum;
    const zone = feature.properties.zone;
    const dimmed = activeZone && zone !== activeZone;
    const known = hasData(ward);

    if (!known) {
      return {
        color: "#8a9ba3",
        weight: dimmed ? 0.5 : 0.8,
        opacity: dimmed ? 0.2 : 0.55,
        fillColor: "#b7c4ca",
        fillOpacity: dimmed ? 0.06 : 0.28,
      };
    }

    return {
      color: "#0f3a45",
      weight: dimmed ? 0.6 : 1.1,
      opacity: dimmed ? 0.25 : 0.95,
      fillColor: ZONE_COLORS[zone] || "#0b6e7a",
      fillOpacity: dimmed ? 0.1 : 0.52,
    };
  }

  function showEmptyCard(wardKey, zone) {
    els.eyebrow.textContent = "Zone " + zone;
    els.title.textContent = "Ward " + wardKey;
    els.locality.textContent = "No joinable fragment";
    els.status.textContent = "No data";
    els.status.dataset.status = "nodata";
    if (cardBody) cardBody.hidden = true;
    if (cardEmpty) cardEmpty.hidden = false;
    card.classList.add("ward-card--empty");
    card.hidden = false;
    if (idle) idle.hidden = true;
  }

  function setHtml(el, html) {
    if (!el) return;
    el.innerHTML = html;
  }

  function showDataCard(d, zoneFallback) {
    const status = d.status || "partial";
    const hours = d.supplyHoursPerDay;
    const hasHours = hours != null && hours !== "" && !Number.isNaN(Number(hours));
    const hoursNum = hasHours ? Number(hours) : 0;
    const hoursPct = hasHours ? Math.max(0, Math.min(100, (hoursNum / 6) * 100)) : 0;

    els.eyebrow.textContent = "Zone " + (d.zone || zoneFallback);
    els.title.textContent = "Ward " + d.wardnum;
    els.locality.textContent = d.locality || "—";
    els.status.textContent = STATUS_LABEL[status] || status;
    els.status.dataset.status = status;

    if (hasHours) {
      els.hours.textContent = hoursNum.toFixed(1);
      els.hours.classList.remove("field-missing");
    } else {
      els.hours.innerHTML = missing("—");
    }
    els.hoursBar.style.width = hoursPct + "%";
    els.hoursBar.style.opacity = hasHours ? "1" : "0.25";

    setHtml(els.schedule, textOrMissing(d.schedule, "Schedule not disclosed"));
    setHtml(
      els.planned,
      d.allocationPlannedMld != null
        ? d.allocationPlannedMld + " MLD"
        : missing("Not disclosed")
    );
    setHtml(
      els.actual,
      d.allocationActualMld != null
        ? d.allocationActualMld + " MLD"
        : missing("Not disclosed")
    );
    setHtml(els.shortfall, textOrMissing(d.shortfall, "Not disclosed"));
    setHtml(els.years, textOrMissing(d.yearsCovered, "Not disclosed"));
    setHtml(els.source, textOrMissing(d.source, "Not named"));
    els.notes.textContent = d.notes || "";
    els.updated.textContent = d.lastUpdated || "—";
    els.updated.setAttribute("datetime", d.lastUpdated || "");

    if (cardBody) cardBody.hidden = false;
    if (cardEmpty) cardEmpty.hidden = true;
    card.classList.remove("ward-card--empty");
    card.hidden = false;
    if (idle) idle.hidden = true;
  }

  function showCard(wardKey, zoneFallback) {
    if (!hasData(wardKey)) {
      showEmptyCard(wardKey, zoneFallback);
      return;
    }
    showDataCard(waterByWard[String(wardKey)], zoneFallback);
  }

  function hideCard() {
    card.hidden = true;
    if (idle) idle.hidden = false;
  }

  // Verify every data key exists in the GeoJSON
  const geoWardIds = {};
  geojson.features.forEach(function (f) {
    geoWardIds[String(f.properties.wardnum)] = true;
  });
  Object.keys(waterByWard).forEach(function (id) {
    if (!geoWardIds[id]) {
      console.warn("[PCMC Water] water data key not in map GeoJSON:", id);
    }
  });

  const layer = L.geoJSON(geojson, {
    style: wardStyle,
    onEachFeature: function (feature, lyr) {
      const ward = feature.properties.wardnum;
      const zone = feature.properties.zone;
      const known = hasData(ward);

      lyr.on({
        mouseover: function (e) {
          showCard(ward, zone);
          if (typeof window.pcmcTrackWard === "function") {
            window.pcmcTrackWard(ward, known);
          }
          if (known) {
            e.target.setStyle({
              weight: 2.2,
              fillOpacity: activeZone && zone !== activeZone ? 0.1 : 0.72,
            });
          } else {
            e.target.setStyle({
              weight: 1.4,
              fillOpacity: activeZone && zone !== activeZone ? 0.06 : 0.4,
              fillColor: "#9aa8af",
            });
          }
          e.target.bringToFront();
        },
        mouseout: function (e) {
          layer.resetStyle(e.target);
          hideCard();
        },
      });
    },
  }).addTo(map);

  map.fitBounds(layer.getBounds(), { padding: [24, 24] });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeZone = chip.dataset.zone || "";
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      layer.setStyle(wardStyle);
    });
  });
})();
