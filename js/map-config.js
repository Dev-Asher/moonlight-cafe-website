"use strict";

/*
 * Google Maps Embed API configuration for the Visit section map.
 *
 * NO API KEY IS STORED IN THIS REPOSITORY.
 *
 * The Visit map shows the illustrated placeholder until an API key is
 * provided here. When a key is available, configure it in ONE of these
 * safe ways — never commit a real key to source control:
 *
 *   1. Deploy-time injection (recommended for static hosting).
 *      Have your host (Netlify / Vercel / Cloudflare Pages / a build step)
 *      generate the `apiKey` value below from an environment variable such as
 *      `GOOGLE_MAPS_EMBED_API_KEY`, so the key is never written to Git.
 *
 *   2. Local development only.
 *      Set `apiKey` below on your own machine for testing, then revert this
 *      file before committing. Do not leave a real key in the working tree.
 *
 * Key restrictions (do these in the Google Cloud Console):
 *   - Application restriction: HTTP referrers — allow only the site's
 *     domain(s). Client-side keys are always visible to the browser, so the
 *     referrer restriction is the actual protection.
 *   - API restriction: limit the key to the "Maps Embed API" only.
 *
 * `query` is any address or place entered into the embed. This café is
 * fictional, so it stays on the invented address (see specs/brand.md: never
 * pin a real business). `zoom` is 1–21.
 */

window.CAFE_MAP_CONFIG = window.CAFE_MAP_CONFIG || {
  apiKey: "",
  query: "142 Lumen Street, Cresthaven, CA 00000",
  zoom: 15
};
