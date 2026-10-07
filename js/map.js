"use strict";

/*
 * Visit map renderer.
 *
 * Reads `window.CAFE_MAP_CONFIG` (see js/map-config.js). When a Google Maps
 * Embed API key is configured it swaps the illustrated placeholder for an
 * embed; otherwise it leaves the accessible placeholder in place. No key is
 * ever hardcoded here — the placeholder is the safe default.
 */

(function () {
  var figure = document.getElementById("map");
  var container = document.getElementById("map-canvas");
  if (!figure || !container) return;

  var config = window.CAFE_MAP_CONFIG || {};
  var apiKey = typeof config.apiKey === "string" ? config.apiKey.trim() : "";
  var query = typeof config.query === "string" ? config.query.trim() : "";
  var zoom = Number(config.zoom);
  if (!isFinite(zoom) || zoom < 1 || zoom > 21) zoom = 15;

  if (!apiKey || !query) {
    figure.setAttribute("data-map", "placeholder");
    return;
  }

  var label = document.getElementById(figure.getAttribute("aria-labelledby"));
  var title = label && label.textContent ? label.textContent : "Map";
  var zoomPart = Number.isFinite(zoom) ? Math.round(zoom) : 15;

  var src =
    "https://www.google.com/maps/embed/v1/place" +
    "?key=" +
    encodeURIComponent(apiKey) +
    "&q=" +
    encodeURIComponent(query) +
    "&zoom=" +
    encodeURIComponent(zoomPart);

  var frame = document.createElement("iframe");
  frame.className = "map-frame";
  frame.setAttribute("src", src);
  frame.setAttribute("title", title);
  frame.setAttribute("loading", "lazy");
  frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
  frame.setAttribute("allowfullscreen", "");

  container.textContent = "";
  container.appendChild(frame);
  figure.setAttribute("data-map", "embed");
})();
