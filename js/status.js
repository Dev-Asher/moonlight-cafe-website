"use strict";

window.CafeStatus = (function () {
  var FULL_DAY = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday"
  };

  var LEVEL_COPY = {
    quiet: "Quiet right now — the window seats are free.",
    steady: "A comfortable buzz right now.",
    lively: "Usually lively right now — great for people-watching, less for laptops."
  };

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function toMinutes(value) {
    var parts = String(value).split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function formatTime(minutes) {
    var value = ((minutes % 1440) + 1440) % 1440;
    return pad(Math.floor(value / 60)) + ":" + pad(value % 60);
  }

  function formatWindow(entry) {
    if (!entry) return "Closed";
    var open = typeof entry.open === "string" ? entry.open : formatTime(entry.open);
    var close = typeof entry.close === "string" ? entry.close : formatTime(entry.close);
    return open + "–" + close;
  }

  function closeOf(entry) {
    return entry.close > entry.open ? entry.close : entry.close + 1440;
  }

  function zoned(date) {
    var formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: HOURS.timezone,
      hourCycle: "h23",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    var values = {};
    formatter.formatToParts(date).forEach(function (part) {
      values[part.type] = part.value;
    });
    return {
      weekday: values.weekday.toLowerCase().slice(0, 3),
      dateKey: values.year + "-" + values.month + "-" + values.day,
      minutes: parseInt(values.hour, 10) * 60 + parseInt(values.minute, 10)
    };
  }

  function exceptionFor(dateKey) {
    for (var i = 0; i < HOURS.exceptions.length; i += 1) {
      if (HOURS.exceptions[i].date === dateKey) return HOURS.exceptions[i];
    }
    return null;
  }

  function readWindow(entry) {
    if (!entry) return null;
    return { open: toMinutes(entry.open), close: toMinutes(entry.close) };
  }

  function dayFor(weekday, dateKey) {
    var exception = exceptionFor(dateKey);
    var source = exception ? exception : HOURS.week[weekday];
    if (exception && exception.closed) {
      return { coffee: null, kitchen: null, exception: exception, closed: true };
    }
    var day = {
      coffee: source ? readWindow(source.coffee) : null,
      kitchen: source ? readWindow(source.kitchen) : null,
      exception: exception
    };
    day.closed = !day.coffee && !day.kitchen;
    return day;
  }

  function isOpen(entry, minutes) {
    if (!entry) return false;
    var close = closeOf(entry);
    return minutes >= entry.open && minutes < close;
  }

  function isCarryOpen(entry, minutes) {
    if (!entry) return false;
    var close = closeOf(entry);
    return minutes + 1440 >= entry.open && minutes + 1440 < close;
  }

  function earliestOpening(day) {
    var openings = [];
    if (day.coffee) openings.push(day.coffee.open);
    if (day.kitchen) openings.push(day.kitchen.open);
    if (!openings.length) return null;
    return Math.min.apply(null, openings);
  }

  function nextOpeningToday(day, minutes) {
    var openings = [];
    if (day.coffee && day.coffee.open > minutes) openings.push(day.coffee.open);
    if (day.kitchen && day.kitchen.open > minutes) openings.push(day.kitchen.open);
    if (!openings.length) return null;
    return Math.min.apply(null, openings);
  }

  function serviceClose(day, service, minutes, carry) {
    var entry = day[service];
    var open = carry ? isCarryOpen(entry, minutes) : isOpen(entry, minutes);
    return open ? closeOf(entry) : null;
  }

  function badgeFor(today, previous, minutes, base) {
    var coffeeClose = serviceClose(today, "coffee", minutes, false);
    if (coffeeClose === null) coffeeClose = serviceClose(previous, "coffee", minutes, true);
    var kitchenClose = serviceClose(today, "kitchen", minutes, false);
    if (kitchenClose === null) kitchenClose = serviceClose(previous, "kitchen", minutes, true);

    if (coffeeClose !== null || kitchenClose !== null) {
      var closing = Math.max(coffeeClose || 0, kitchenClose || 0);
      if (closing - minutes <= 60) {
        return {
          state: "closing",
          text: "Closing in " + (closing - minutes) + " min — last orders at the bar"
        };
      }
      if (kitchenClose !== null) {
        return { state: "open", text: "Open now — kitchen until " + formatTime(kitchenClose) };
      }
      return { state: "open", text: "Open now — coffee until " + formatTime(coffeeClose) };
    }

    var opening = nextOpeningToday(today, minutes);
    if (opening !== null) {
      return { state: "closed", text: "Closed — opens today at " + formatTime(opening) };
    }

    if (today.exception && today.exception.closed) {
      var note = today.exception.note || "";
      var dash = note.indexOf("—");
      var tail = dash >= 0 ? " " + note.slice(dash) : "";
      return {
        state: "closed",
        text: "Closed for " + today.exception.label + tail
      };
    }

    var next = nextOpenDay(base);
    if (next) {
      return {
        state: "closed",
        text: "Closed — opens " + FULL_DAY[next.weekday] + " at " + formatTime(next.opening)
      };
    }
    return { state: "closed", text: "Closed" };
  }

  function nextOpenDay(base) {
    for (var step = 1; step <= 7; step += 1) {
      var parts = zoned(new Date(base.getTime() + step * 86400000));
      var day = dayFor(parts.weekday, parts.dateKey);
      var opening = earliestOpening(day);
      if (opening !== null) return { weekday: parts.weekday, opening: opening };
    }
    return null;
  }

  function textToken(value) {
    return { kind: "text", value: value };
  }

  function timeToken(value) {
    return { kind: "time", value: value };
  }

  function rangeTokens(entry) {
    return [
      timeToken(formatTime(entry.open)),
      textToken("–"),
      timeToken(formatTime(entry.close))
    ];
  }

  function hoursFor(day) {
    if (day.coffee) {
      var tokens = [textToken("Today: ")].concat(rangeTokens(day.coffee));
      if (day.kitchen && formatWindow(day.coffee) !== formatWindow(day.kitchen)) {
        tokens.push(textToken(" · kitchen "));
        tokens = tokens.concat(rangeTokens(day.kitchen));
      }
      return tokens;
    }
    if (day.kitchen) {
      return [textToken("Coffee closed today · kitchen ")].concat(rangeTokens(day.kitchen));
    }
    return [textToken("Closed today")];
  }

  function patternFor(weekday) {
    return weekday === "sat" || weekday === "sun" ? BUSYNESS.weekend : BUSYNESS.weekday;
  }

  function levelAt(pattern, minutes) {
    var value = minutes >= 1440 ? minutes - 1440 : minutes;
    for (var i = 0; i < pattern.length; i += 1) {
      if (value >= toMinutes(pattern[i].from) && value < toMinutes(pattern[i].to)) {
        return pattern[i].level;
      }
    }
    return "steady";
  }

  function slotsFor(day, weekday) {
    if (!day.coffee) return [];
    var pattern = patternFor(weekday);
    var end = closeOf(day.coffee);
    var slots = [];
    for (var start = day.coffee.open; start < end; start += 60) {
      slots.push({
        start: start,
        end: Math.min(start + 60, end),
        level: levelAt(pattern, start)
      });
    }
    return slots;
  }

  function slotAt(slots, minutes, carry) {
    for (var i = 0; i < slots.length; i += 1) {
      var start = slots[i].start;
      var end = slots[i].end;
      var from = carry ? minutes + 1440 : minutes;
      if (from >= start && from < end) return slots[i];
    }
    return null;
  }

  function longestRun(slots, level) {
    var best = null;
    var runStart = -1;
    for (var i = 0; i <= slots.length; i += 1) {
      var matches = i < slots.length && slots[i].level === level;
      if (matches && runStart === -1) runStart = i;
      if (!matches && runStart !== -1) {
        var length = i - runStart;
        if (!best || length > best.length) {
          best = { start: slots[runStart].start, end: slots[i - 1].end, length: length };
        }
        runStart = -1;
      }
    }
    return best;
  }

  function hintFor(today, previous, weekday, previousWeekday, minutes) {
    var parts = [];
    var active = null;
    var activeWeekday = weekday;
    var carry = false;
    if (isOpen(today.coffee, minutes)) {
      active = today;
    } else if (isCarryOpen(previous.coffee, minutes)) {
      active = previous;
      activeWeekday = previousWeekday;
      carry = true;
    }
    if (active) {
      var current = slotAt(slotsFor(active, activeWeekday), minutes, carry);
      if (current) parts.push(LEVEL_COPY[current.level]);
    }

    var slots = slotsFor(today, weekday);
    if (slots.length) {
      var quiet = longestRun(slots, "quiet");
      if (quiet) {
        parts.push(
          "Quietest today: " + formatTime(quiet.start) + "–" + formatTime(quiet.end) + "."
        );
      } else {
        var steady = longestRun(slots, "steady");
        if (steady) {
          parts.push(
            "Steadiest stretch today: " +
              formatTime(steady.start) +
              "–" +
              formatTime(steady.end) +
              "."
          );
        }
      }
    }
    return parts.join(" ");
  }

  function getStatus(date) {
    var base = date || new Date();
    var now = zoned(base);
    var before = zoned(new Date(base.getTime() - 86400000));
    var today = dayFor(now.weekday, now.dateKey);
    var previous = dayFor(before.weekday, before.dateKey);
    var badge = badgeFor(today, previous, now.minutes, base);
    return {
      state: badge.state,
      text: badge.text,
      hours: hoursFor(today),
      hint: hintFor(today, previous, now.weekday, before.weekday, now.minutes),
      weekday: now.weekday,
      dateKey: now.dateKey
    };
  }

  return {
    getStatus: getStatus,
    zoned: zoned,
    formatWindow: formatWindow
  };
})();
