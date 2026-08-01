/* Leaflet map + hover overlay. Grey = no RTI data yet; colour = in PCMC_WATER. */
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
    adequate: "Adequate",
    stressed: "Stressed",
    deficit: "Deficit",
  };

  const totalWards = meta.totalWards || 66;
  const withData = meta.withData || Object.keys(waterByWard).length;
  const noData = totalWards - withData;

  const statWith = document.getElementById("stat-with-data");
  const statTotal = document.getElementById("stat-total");
  const legendWith = document.getElementById("legend-with-data");
  const legendNo = document.getElementById("legend-nodata");
  if (statWith) statWith.textContent = String(withData);
  if (statTotal) statTotal.textContent = String(totalWards);
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
    coverage: document.getElementById("card-coverage"),
    coverageBar: document.getElementById("card-coverage-bar"),
    connections: document.getElementById("card-connections"),
    esr: document.getElementById("card-esr"),
    pressure: document.getElementById("card-pressure"),
    source: document.getElementById("card-source"),
    notes: document.getElementById("card-notes"),
    updated: document.getElementById("card-updated"),
  };

  function hasData(wardKey) {
    return Object.prototype.hasOwnProperty.call(waterByWard, String(wardKey));
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

  function formatNumber(n) {
    return Number(n).toLocaleString("en-IN");
  }

  function showEmptyCard(wardKey, zone) {
    els.eyebrow.textContent = "Zone " + zone;
    els.title.textContent = "Ward " + wardKey;
    els.locality.textContent = "Awaiting RTI disclosure";
    els.status.textContent = "No data";
    els.status.dataset.status = "nodata";
    if (cardBody) cardBody.hidden = true;
    if (cardEmpty) cardEmpty.hidden = false;
    card.classList.add("ward-card--empty");
    card.hidden = false;
    if (idle) idle.hidden = true;
  }

  function showDataCard(d, zoneFallback) {
    const status = d.status || "adequate";
    const hours = Number(d.supplyHoursPerDay) || 0;
    const coverage = Number(d.coveragePct) || 0;
    const hoursPct = Math.max(0, Math.min(100, (hours / 6) * 100));

    els.eyebrow.textContent = "Zone " + (d.zone || zoneFallback);
    els.title.textContent = "Ward " + d.wardnum;
    els.locality.textContent = d.locality || "—";
    els.status.textContent = STATUS_LABEL[status] || status;
    els.status.dataset.status = status;
    els.hours.textContent = hours.toFixed(1);
    els.hoursBar.style.width = hoursPct + "%";
    els.schedule.textContent = d.schedule || "—";
    els.coverage.textContent = coverage + "%";
    els.coverageBar.style.width = Math.max(0, Math.min(100, coverage)) + "%";
    els.connections.textContent = formatNumber(d.householdConnections) + " hh";
    els.esr.textContent = (d.esrCapacityMld != null ? d.esrCapacityMld : "—") + " MLD";
    els.pressure.textContent = d.pressure || "—";
    els.source.textContent = d.source || "—";
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

  const layer = L.geoJSON(geojson, {
    style: wardStyle,
    onEachFeature: function (feature, lyr) {
      const ward = feature.properties.wardnum;
      const zone = feature.properties.zone;
      const known = hasData(ward);

      lyr.on({
        mouseover: function (e) {
          showCard(ward, zone);
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
