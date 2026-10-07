"use strict";

/*
 * Contact form backend configuration (Formspree).
 *
 * NO FORMSPREE ENDPOINT OR SECRET IS STORED IN THIS REPOSITORY.
 *
 * Insert your Formspree form endpoint below when it is available. It looks
 * like this (this is a shape example only — not a real endpoint):
 *
 *     https://formspree.io/f/<yourFormId>
 *
 * Find it at https://formspree.io → your form → the integration / endpoint
 * shown in the form's setup instructions.
 *
 * Configuration options (pick one — never commit a real endpoint until you
 * are ready to go live):
 *
 *   1. Deploy-time injection (recommended). Have your host / build step
 *      generate this file from an environment variable, e.g.
 *      `FORMSPREE_ENDPOINT`, so the value is not committed to Git.
 *   2. Local edit. Set `formspreeEndpoint` below, test it, then decide how
 *      you want to ship it.
 *
 * The endpoint is a public form action URL, not a secret credential, and
 * Formspree is designed to receive it from the browser. Still, keep this file
 * free of a live value in source control and rely on Formspree's own spam
 * protection plus domain restrictions in your Formspree account.
 *
 * While this is empty, the form validates locally and shows a clear
 * "not connected" message instead of submitting anywhere.
 */

window.CAFE_FORM_CONFIG = window.CAFE_FORM_CONFIG || {
  formspreeEndpoint: ""
};
