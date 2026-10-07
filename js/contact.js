"use strict";

/*
 * Contact form: client-side validation + Formspree submission.
 *
 * The Formspree endpoint is read from window.CAFE_FORM_CONFIG.formspreeEndpoint
 * (see js/form-config.js). No endpoint or secret is hardcoded here. When the
 * endpoint is empty the form still validates locally and shows a clear
 * "not connected yet" message rather than posting anywhere.
 */

(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var success = document.getElementById("contact-success");
  var successText = document.getElementById("contact-success-text");
  var errorBox = document.getElementById("contact-error");
  var submitButton = document.getElementById("contact-submit");
  var resetButton = document.getElementById("contact-reset");
  var fields = Array.prototype.slice.call(form.querySelectorAll("[data-field]"));

  var config = window.CAFE_FORM_CONFIG || {};
  var endpoint =
    config && typeof config.formspreeEndpoint === "string"
      ? config.formspreeEndpoint.trim()
      : "";

  var submitting = false;

  if (endpoint) {
    form.setAttribute("action", endpoint);
    form.setAttribute("method", "POST");
  }

  function fieldErrorNode(field) {
    var id = field.getAttribute("aria-describedby");
    return id ? document.getElementById(id) : null;
  }

  function setFieldError(field, message) {
    var node = fieldErrorNode(field);
    if (message) {
      field.setAttribute("aria-invalid", "true");
      if (node) node.textContent = message;
    } else {
      field.removeAttribute("aria-invalid");
      if (node) node.textContent = "";
    }
  }

  function hideStatuses() {
    if (success) success.hidden = true;
    if (errorBox) errorBox.hidden = true;
  }

  function showError(message) {
    hideStatuses();
    if (!errorBox) return null;
    errorBox.textContent = message;
    errorBox.hidden = false;
    return errorBox;
  }

  function showSuccess(message) {
    hideStatuses();
    if (!success) return null;
    if (successText) successText.textContent = message;
    success.hidden = false;
    return success;
  }

  function validate() {
    var firstInvalid = null;
    fields.forEach(function (field) {
      var valid = true;
      try {
        valid = field.checkValidity();
      } catch (err) {
        valid = true;
      }
      if (valid) {
        setFieldError(field, "");
      } else {
        setFieldError(field, field.validationMessage || "Please check this field.");
        if (!firstInvalid) firstInvalid = field;
      }
    });
    return firstInvalid;
  }

  fields.forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") !== "true") return;
      var valid = true;
      try {
        valid = field.checkValidity();
      } catch (err) {
        valid = true;
      }
      if (valid) setFieldError(field, "");
    });
  });

  function setSubmitting(state) {
    submitting = state;
    form.setAttribute("aria-busy", state ? "true" : "false");
    if (submitButton) {
      submitButton.disabled = state;
      submitButton.textContent = state ? "Sending…" : "Send message";
    }
  }

  function send() {
    setSubmitting(true);
    var request = window.fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    request
      .then(function (response) {
        if (response.ok) return response;
        return response.json().then(
          function (data) {
            var message =
              "Something went wrong sending your message. Please try again.";
            if (data && Array.isArray(data.errors) && data.errors.length) {
              message = data.errors
                .map(function (item) {
                  return item && item.message ? item.message : "";
                })
                .filter(Boolean)
                .join(" ");
            }
            throw new Error(message || "Please try again.");
          },
          function () {
            throw new Error(
              "Something went wrong sending your message. Please try again."
            );
          }
        );
      })
      .then(function () {
        form.reset();
        fields.forEach(function (field) {
          setFieldError(field, "");
        });
        setSubmitting(false);
        form.hidden = true;
        form.removeAttribute("data-form-state");
        var node = showSuccess(
          "Thank you — your message is on its way. We’ll write back between pours."
        );
        if (node && typeof node.focus === "function") node.focus();
      })
      .catch(function (err) {
        setSubmitting(false);
        showError(
          err && err.message
            ? err.message
            : "Something went wrong sending your message. Please try again."
        );
      });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (submitting) return;

    var firstInvalid = validate();
    if (firstInvalid) {
      showError("Please fix the highlighted fields and try again.");
      if (typeof firstInvalid.focus === "function") firstInvalid.focus();
      return;
    }

    if (!endpoint) {
      form.setAttribute("data-form-state", "unconfigured");
      showError(
        "This form isn’t connected yet. Email us at hello@moonlightcafe.example and we’ll write back."
      );
      return;
    }

    send();
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      hideStatuses();
      form.hidden = false;
      form.removeAttribute("data-form-state");
      fields.forEach(function (field) {
        setFieldError(field, "");
      });
      var first = fields[0];
      if (first && typeof first.focus === "function") first.focus();
    });
  }
})();
