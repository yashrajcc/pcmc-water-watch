/* GoatCounter helpers — pageviews via official script; counts via public JSON. */
(function () {
  const GOAT_HOST = "https://pcmc-water.goatcounter.com";
  const countEl = document.getElementById("visitor-count");
  const countWrap = document.getElementById("visitor-count-wrap");

  window.pcmcTrack = function (path, title) {
    if (typeof window.goatcounter === "undefined" || !window.goatcounter.count) return;
    try {
      window.goatcounter.count({
        path: path,
        title: title || path,
        event: true,
      });
    } catch (e) {
      /* ignore */
    }
  };

  function setCountLabel(text) {
    if (!countEl) return;
    countEl.textContent = text;
    if (countWrap) countWrap.hidden = false;
  }

  function fetchCount(pathKey) {
    const url = GOAT_HOST + "/counter/" + encodeURIComponent(pathKey) + ".json";
    return fetch(url, { mode: "cors", credentials: "omit" }).then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    });
  }

  // Site-wide total if available; else this page path. Needs "Allow visitor counts" in GoatCounter settings.
  function loadVisitorCount() {
    if (!countEl) return;

    fetchCount("TOTAL")
      .catch(function () {
        var path = location.pathname;
        if (!path || path === "") path = "/";
        return fetchCount(path);
      })
      .then(function (data) {
        if (data && data.count != null) {
          setCountLabel(String(data.count).replace(/\s/g, ""));
        }
      })
      .catch(function () {
        if (countWrap) countWrap.hidden = true;
      });
  }

  function wireEvents() {
    document.querySelectorAll(".zone-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var z = chip.dataset.zone || "all";
        window.pcmcTrack("event-zone-" + (z || "all"), "Zone filter " + (z || "all"));
      });
    });

    document.querySelectorAll("#collaborate .collab__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var label = (btn.textContent || "collab").trim().slice(0, 40);
        window.pcmcTrack("event-collab-" + label.toLowerCase().replace(/\s+/g, "-"), label);
      });
    });

    document.querySelectorAll(".footer-tile").forEach(function (tile) {
      tile.addEventListener("click", function () {
        var label = (tile.querySelector(".footer-tile__label") || {}).textContent || "footer";
        window.pcmcTrack(
          "event-footer-" + String(label).toLowerCase().replace(/\s+/g, "-"),
          String(label)
        );
      });
    });
  }

  var lastWard = "";
  var lastWardAt = 0;
  window.pcmcTrackWard = function (wardId, hasData) {
    var now = Date.now();
    var key = String(wardId) + (hasData ? "-data" : "-grey");
    if (key === lastWard && now - lastWardAt < 2500) return;
    lastWard = key;
    lastWardAt = now;
    window.pcmcTrack(
      "event-ward-" + key,
      "Ward " + wardId + (hasData ? " (fragment)" : " (grey)")
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadVisitorCount();
      wireEvents();
    });
  } else {
    loadVisitorCount();
    wireEvents();
  }
})();
