"use strict";

/*
 * Contact form backend configuration (Formspree).
 *
 * The endpoint below is connected and live. A Formspree form-action URL is
 * public — it is sent from the browser and is NOT a secret credential — so it
 * is safe to keep in this repository. Protect the form with Formspree's own
 * spam filtering and domain restrictions configured in your Formspree account.
 *
 * To point the form elsewhere, replace the value below with your endpoint
 * (formspree.io → your form → integration); it looks like
 * https://formspree.io/f/<yourFormId>. If the value is empty, the form still
 * validates locally and shows a clear "not connected" message instead of
 * submitting anywhere.
 */

window.CAFE_FORM_CONFIG = window.CAFE_FORM_CONFIG || {
  formspreeEndpoint: "https://formspree.io/f/mbgddaap"
};
