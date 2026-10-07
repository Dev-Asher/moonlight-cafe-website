# Open-Now & "Best Time to Visit" System Specification

This is the wow feature: a live open/closed badge and visit recommendations computed
from the hours data. No UI is built yet — this document defines the logic so the
wireframe and code phases have a contract to follow.

## Inputs (data files)

| Data | File | Role |
|---|---|---|
| `HOURS` | `data/hours.js` | Source of truth for when each service runs, per weekday + date exceptions |
| `BUSYNESS` | `data/hours.js` | Static daypart map: which hours are quiet / steady / lively |
| Current time | browser clock | Evaluated in the timezone named in `HOURS.timezone` |

## 1. Building today's open windows

1. Look up today's date in `HOURS.exceptions` (keyed `YYYY-MM-DD`).
   - If an exception exists, it **replaces** that day's regular schedule entirely.
   - `closed: true` → no windows at all for the day.
   - An exception may define only one service (e.g. coffee but no kitchen).
2. Otherwise, use `HOURS.week[weekday]`. A `null` entry (Tuesday) means closed.
3. Each service (`coffee`, `kitchen`) yields a window `{open, close}` in `HH:MM`.
   - **Overnight rule:** if `close < open`, the window wraps past midnight and
     belongs to the *service day it started on*. Example: Friday coffee
     `08:00 → 01:00` is open Saturday at 00:30, and that still counts as Friday.
   - To compare against the current time, convert windows to minutes-since-midnight;
     for wrapped windows add 1440 to the close value and also test the current time
     against `(nowMinutes + 1440)` so late-night hours resolve correctly.

## 2. Computing the status badge

Evaluate now against both windows:

| Condition | Status shown |
|---|---|
| Now inside coffee window, kitchen also open | `Open now — kitchen until HH:MM` |
| Now inside coffee window, kitchen closed | `Open now — coffee until HH:MM` |
| Now inside kitchen window only (edge case) | `Open now — kitchen until HH:MM` |
| Now within 60 min of a closing time | `Closing in N min — last orders at the bar` |
| Not in any window today, but windows exist later | `Closed — opens <Day> at HH:MM` (next open day/window) |
| Closed today (Tuesday or closed exception) | `Closed — opens <Next open day> at HH:MM` |

The badge updates on load and on a 60-second interval (cheap recompute, no network).

## 3. Best time to visit

Busyness is *not* derived from hours — it is a separate static pattern
(`BUSYNESS.weekday` / `BUSYNESS.weekend`), because opening hours don't tell you how
busy a café gets.

1. Split today's open coffee window into 1-hour slots.
2. Tag each slot with its level from `BUSYNESS` (weekday or weekend pattern;
   weekends take precedence for Saturday/Sunday even if an exception changed the hours).
3. **"Right now" hint** = level of the current slot (`quiet` / `steady` / `lively`).
4. **"Best time to visit"** = today's longest contiguous run of `quiet` slots,
   rendered as a range (e.g. "Quietest today: 15:00–18:00"). If no quiet run exists,
   fall back to the longest `steady` run; if the café is closed all day, show nothing.
5. Exception days keep the normal busyness pattern but only within the exception's
   reduced window — so a holiday with 10:00–16:00 hours still gets a hint.

Levels map to copy:

| Level | Meaning | Example copy |
|---|---|---|
| `quiet` | < 40% typical occupancy | "Quiet right now — the window seats are free." |
| `steady` | normal buzz | "A comfortable buzz right now." |
| `lively` | near capacity | "Usually lively right now — great for people-watching, less for laptops." |

## 4. Where it appears (for the wireframe phase)

- Hero: status badge + today's hours, above the fold, no navigation required
- Hero or menu: "Right now" busyness hint, one line
- Visit section: full hours table with exception notes marked
- Sticky bar: `Open`/`Closed` state can tint the bar's accent

## 5. Edge cases to handle in code phase

- Clock past midnight → schedule still belongs to the previous service day
- Timezone: use `HOURS.timezone`; placeholder is `America/New_York` and should match
  whatever the demo pretends to be
- Exception with only kitchen hours → coffee badge says "Coffee closed today"
- Machine clock set to a future year with no exception data → fall back to weekday schedule
