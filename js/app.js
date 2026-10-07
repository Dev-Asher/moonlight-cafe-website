"use strict";

document.documentElement.classList.add("js");

(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  var header = document.querySelector(".site-header");
  var desktopQuery = window.matchMedia("(min-width: 768px)");
  var background = [
    document.querySelector(".skip-link"),
    document.querySelector("main"),
    document.querySelector("footer"),
    document.querySelector(".action-bar")
  ];

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function setBackgroundInert(state) {
    background.forEach(function (el) {
      if (el) el.inert = state;
    });
  }

  function headerFocusables() {
    if (!header) return [];
    return Array.prototype.slice.call(
      header.querySelectorAll("a[href], button:not([disabled])")
    );
  }

  function openNav() {
    if (isOpen()) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
    setBackgroundInert(true);
    var first = nav.querySelector("a[href]");
    if (first) first.focus();
  }

  function closeNav() {
    if (!isOpen()) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
    setBackgroundInert(false);
    if (!desktopQuery.matches) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) closeNav();
    else openNav();
  });

  nav.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;
    closeNav();
    if (link.hash && link.hash !== window.location.hash) {
      var restoreFocus = function () {
        window.removeEventListener("hashchange", restoreFocus);
        if (!desktopQuery.matches && isOpen() === false) toggle.focus();
      };
      window.addEventListener("hashchange", restoreFocus);
    }
  });

  document.addEventListener("click", function (event) {
    if (!isOpen()) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  document.addEventListener("keydown", function (event) {
    if (!isOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeNav();
      return;
    }

    if (event.key !== "Tab" || desktopQuery.matches) return;

    var items = headerFocusables();
    if (items.length === 0) return;

    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;

    if (items.indexOf(active) === -1) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function handleBreakpoint(event) {
    if (event.matches) closeNav();
  }

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleBreakpoint);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(handleBreakpoint);
  }
})();

(function () {
  var card = document.querySelector(".status-card");
  var text = document.getElementById("status-text");
  var hours = document.getElementById("status-hours");
  var hint = document.getElementById("status-hint");
  if (!card || !text || !hours || !hint || !window.CafeStatus) return;

  var lastText = null;
  var lastHours = "";
  var lastHint = null;

  function renderHours(tokens) {
    var signature = tokens
      .map(function (token) {
        return token.kind + ":" + token.value;
      })
      .join("|");
    if (signature === lastHours) return;
    lastHours = signature;
    hours.textContent = "";
    tokens.forEach(function (token) {
      if (token.kind !== "time") {
        hours.appendChild(document.createTextNode(token.value));
        return;
      }
      var element = document.createElement("time");
      element.setAttribute("datetime", token.value);
      element.textContent = token.value;
      hours.appendChild(element);
    });
  }

  function render() {
    var status = window.CafeStatus.getStatus();
    if (status.text !== lastText) {
      lastText = status.text;
      text.textContent = status.text;
    }
    card.setAttribute("data-state", status.state);
    renderHours(status.hours);
    if (status.hint !== lastHint) {
      lastHint = status.hint;
      hint.textContent = status.hint;
    }
  }

  render();
  window.setInterval(render, 60000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) render();
  });
})();

(function () {
  var filters = document.getElementById("menu-filters");
  var panel = document.getElementById("menu-list");
  var blurb = document.getElementById("menu-blurb");
  var empty = document.getElementById("menu-empty");
  if (!filters || !panel || typeof MENU_CATEGORIES === "undefined") return;

  var tabs = [];
  var selected = "all";

  function money(price) {
    return "$" + price.toFixed(2);
  }

  function spokenPrice(price) {
    var dollars = Math.floor(price + 0.001);
    var cents = Math.round((price - dollars) * 100);
    var label = dollars + " dollar" + (dollars === 1 ? "" : "s");
    if (cents > 0) label += " " + cents + " cent" + (cents === 1 ? "" : "s");
    return label;
  }

  function cardFor(item) {
    var card = document.createElement("li");
    card.className = "menu-card";

    var top = document.createElement("div");
    top.className = "menu-card-top";

    var name = document.createElement("h4");
    name.className = "menu-name";
    name.textContent = item.name;

    var price = document.createElement("span");
    price.className = "menu-price";
    var visiblePrice = document.createElement("span");
    visiblePrice.setAttribute("aria-hidden", "true");
    visiblePrice.textContent = money(item.price);
    var spoken = document.createElement("span");
    spoken.className = "visually-hidden";
    spoken.textContent = spokenPrice(item.price);
    price.appendChild(visiblePrice);
    price.appendChild(spoken);

    top.appendChild(name);
    top.appendChild(price);
    card.appendChild(top);

    var description = document.createElement("p");
    description.className = "menu-desc";
    description.textContent = item.description;
    card.appendChild(description);

    var tagIds = [];
    (item.tags || []).forEach(function (tag) {
      if (typeof TAG_LABELS !== "undefined" && TAG_LABELS[tag]) tagIds.push(tag);
    });
    if (tagIds.length) {
      var tags = document.createElement("ul");
      tags.className = "menu-tags";
      tagIds.forEach(function (tag) {
        var pill = document.createElement("li");
        pill.className = tag === "signature" ? "menu-tag is-signature" : "menu-tag";
        pill.textContent = TAG_LABELS[tag];
        tags.appendChild(pill);
      });
      card.appendChild(tags);
    }
    return card;
  }

  function renderPanel() {
    var groups =
      selected === "all"
        ? MENU_CATEGORIES
        : MENU_CATEGORIES.filter(function (category) {
            return category.id === selected;
          });

    panel.textContent = "";
    groups.forEach(function (category) {
      var group = document.createElement("section");
      group.className = "menu-group";
      var heading = document.createElement("h3");
      heading.textContent = category.name;
      group.appendChild(heading);
      var list = document.createElement("ul");
      list.className = "menu-list";
      category.items.forEach(function (item) {
        list.appendChild(cardFor(item));
      });
      group.appendChild(list);
      panel.appendChild(group);
    });

    var active = tabs.filter(function (tab) {
      return tab.dataset.category === selected;
    })[0];
    if (active) panel.setAttribute("aria-labelledby", active.id);
    if (blurb) blurb.textContent = groups.length === 1 ? groups[0].blurb || "" : "";
    if (empty) empty.hidden = groups.length > 0;
  }

  function select(category) {
    selected = category;
    tabs.forEach(function (tab) {
      var on = tab.dataset.category === category;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });
    renderPanel();
  }

  function buildTabs() {
    var entries = [{ id: "all", name: "All" }].concat(MENU_CATEGORIES);
    filters.textContent = "";
    tabs = entries.map(function (entry) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "chip";
      tab.id = "menu-tab-" + entry.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      tab.dataset.category = entry.id;
      tab.textContent = entry.name;
      tab.addEventListener("click", function () {
        select(entry.id);
      });
      filters.appendChild(tab);
      return tab;
    });
  }

  filters.addEventListener("keydown", function (event) {
    var index = tabs.indexOf(document.activeElement);
    if (index === -1) return;
    var next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next].focus();
    select(tabs[next].dataset.category);
  });

  buildTabs();
  select("all");
})();

(function () {
  var body = document.getElementById("hours-body");
  var list = document.getElementById("exceptions-list");
  if (!body || !window.CafeStatus) return;

  var order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var shortDays = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
  var weekIndex = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var today = window.CafeStatus.zoned(new Date()).weekday;
  var exceptionRows = {};

  function partsOf(value) {
    var parts = value.split("-");
    return [Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])];
  }

  function formatDate(value) {
    var parts = partsOf(value);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(parts[0], parts[1], parts[2]));
  }

  (HOURS.exceptions || []).forEach(function (exception, index) {
    var parts = partsOf(exception.date);
    var weekday = weekIndex[new Date(parts[0], parts[1], parts[2]).getDay()];
    if (!exceptionRows[weekday]) exceptionRows[weekday] = [];
    exceptionRows[weekday].push(index);
  });

  order.forEach(function (weekday) {
    var schedule = HOURS.week[weekday];
    var row = document.createElement("tr");
    if (weekday === today) row.className = "is-today";

    var heading = document.createElement("th");
    heading.setAttribute("scope", "row");
    heading.textContent = shortDays[weekday];
    if (weekday === today) {
      var mark = document.createElement("span");
      mark.className = "today-mark";
      mark.textContent = " · Today";
      heading.appendChild(mark);
    }
    (exceptionRows[weekday] || []).forEach(function (index) {
      var anchor = document.createElement("a");
      anchor.className = "ex-ref";
      anchor.href = "#holiday-" + index;
      anchor.textContent = " *";
      anchor.setAttribute("aria-label", HOURS.exceptions[index].label + " hours note");
      heading.appendChild(anchor);
    });
    row.appendChild(heading);

    ["coffee", "kitchen"].forEach(function (service) {
      var cell = document.createElement("td");
      cell.textContent = schedule ? window.CafeStatus.formatWindow(schedule[service]) : "Closed";
      row.appendChild(cell);
    });

    body.appendChild(row);
  });

  if (list) {
    (HOURS.exceptions || []).forEach(function (exception, index) {
      var item = document.createElement("li");
      item.id = "holiday-" + index;
      var label = document.createElement("strong");
      label.textContent = exception.label;
      item.appendChild(label);
      item.appendChild(document.createTextNode(" — " + (exception.note || "")));
      var date = document.createElement("span");
      date.className = "exception-date";
      date.textContent = " (" + formatDate(exception.date) + ")";
      item.appendChild(date);
      list.appendChild(item);
    });
  }
})();

(function () {
  var track = document.getElementById("gallery-track");
  var count = document.getElementById("gallery-count");
  if (!track) return;
  var slides = Array.prototype.slice.call(track.querySelectorAll(".gallery-slide"));
  if (!slides.length) return;

  var previous = document.querySelector('.gallery-btn[aria-label="Previous photo"]');
  var next = document.querySelector('.gallery-btn[aria-label="Next photo"]');
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function currentIndex() {
    var trackRect = track.getBoundingClientRect();
    var target = trackRect.left + trackRect.width / 2;
    var best = 0;
    var bestDistance = Infinity;
    slides.forEach(function (slide, index) {
      var rect = slide.getBoundingClientRect();
      var distance = Math.abs(rect.left + rect.width / 2 - target);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    return best;
  }

  function goTo(index) {
    var target = slides[Math.max(0, Math.min(slides.length - 1, index))];
    if (!target || typeof target.scrollIntoView !== "function") return;
    target.scrollIntoView({
      behavior: reduced.matches ? "auto" : "smooth",
      inline: "center",
      block: "nearest"
    });
  }

  function update() {
    var index = currentIndex();
    if (count) count.textContent = index + 1 + " / " + slides.length;
    if (previous) previous.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
  }

  if (previous) {
    previous.addEventListener("click", function () {
      goTo(currentIndex() - 1);
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      goTo(currentIndex() + 1);
    });
  }
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
