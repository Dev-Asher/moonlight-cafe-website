# Wireframe Specification — Moonlight Café

Lo-fi, mobile-first wireframe for the single scrolling page. No HTML/CSS/JS yet —
this is the contract for the build phase. Based on `specs/brand.md`,
`specs/open-now-system.md`, `data/site.js`, `data/menu.js`, and `data/hours.js`.

## Conventions

- **Primary viewport:** 390 × 844 (iPhone-class). Must not overflow horizontally at 320px.
- **Grid:** single column, 16px side gutters, 24px vertical rhythm between blocks, 48px between sections.
- **Tap targets:** ≥ 44 × 44px for anything interactive.
- **Sticky bar:** 64px tall + `env(safe-area-inset-bottom)`. Page gets bottom padding equal to its height so the footer is never covered.
- **Legend:** `[ ]` button/link · `▭` image · `●` status dot · `h1/h2/…` heading level · `→` navigation.
- **Focus:** every interactive element gets a visible focus ring (2px, high contrast). Keyboard order = visual order.
- **Content sources:** all copy/data comes from the Phase 1 files. Nothing invented at build time.

```
┌─────────────────────────────┐
│ PAGE (single scroll)        │
│  header (sticky, compact)   │
│  hero                        │
│  menu                        │
│  space                       │
│  story                       │
│  visit                       │
│  footer                      │
│ ▔▔▔ sticky action bar ▔▔▔▔ │  ← fixed, overlays page bottom
└─────────────────────────────┘
```

---

## 1. Header

**Layout (mobile):** fixed to top, full width, 56px tall. Translucent background with
blur once the page scrolls past 24px; solid at rest. Logo/name left, menu button right.

```
┌──────────────────────────────┐
│ ☾ Moonlight Café        [≡]  │  56px, sticky
└──────────────────────────────┘
```

**Content hierarchy:** 1) logo/name (links to top) · 2) `[≡]` menu button (44×44).

**Menu button → overlay:** full-screen sheet, close `[✕]` at top right, anchor list:
`Menu · The Space · Our Story · Visit`, then a divider and `Call us` + `Directions`.
Tapping any link closes the sheet and smooth-scrolls to the section.

- **Visible immediately:** logo, menu button — nothing else competes with the hero.
- **Primary action:** open navigation. **Secondary:** none.
- **Accessibility:** button has `aria-label="Open menu"` + `aria-expanded`; overlay traps
  focus, closes on `Escape`, returns focus to the button; a visually-hidden skip link
  ("Skip to menu") is the first focusable element on the page; `header` landmark.
- **Collapse/expand:** at ≥768px the `[≡]` is replaced by inline nav links + Call button
  (see Desktop Adaptation). Never two rows on mobile.

## 2. Hero

**Layout (mobile):** full-bleed section under the header, vertically centered, fits
**entirely within the first viewport** (844px minus header/bar ≈ 720px of usable height).
Dark background with a soft radial glow behind the title (decorative only).

```
┌──────────────────────────────┐
│  Moonlight Café          h1  │
│  Coffee for the hours        │
│  after dark.             ← tagline
│                              │
│  Short supporting text       │
│  (1–2 lines, ≤ 60ch)         │
│                              │
│ ┌──────────────────────────┐ │
│ │ ● Open now           h2  │ │  status card
│ │ Kitchen until 22:00       │ │  (from open-now-system)
│ │ Today: 08:00–23:00        │ │
│ │ Quiet right now —         │ │  busy hint (visually
│ │ window seats are free     │ │  secondary line)
│ └──────────────────────────┘ │
│                              │
│ [     See the menu     ]     │
└──────────────────────────────┘
```

**Content hierarchy:** 1) h1 name · 2) tagline · 3) supporting text
(from `SITE.description`, trimmed) · 4) status card (badge + today's hours + busy hint)
· 5) primary action.

The status card sits below the headline but is the **most visually emphasized** element
(highest-contrast card, status dot) so it reads first — this honors the agreed content
priority (status+hours before brand) while keeping the h1 at the top for semantics.

- **Visible immediately:** everything above — the whole hero is one screen.
- **Primary action:** `[See the menu]` → `#menu`. **Secondary:** none (Call/Directions
  live in the sticky bar).
- **Accessibility:** one `h1` per page; badge text describes state in words, never color
  alone (`●` dot is decorative); status container is `aria-live="polite"` but only
  announces on *state change*, not every 60s recompute; hours use `<time>` elements;
  busy hint is plain text, not live; AA contrast for gold-on-navy.
- **Collapse/expand:** on short viewports (< 700px tall) the supporting text truncates
  to one line before anything else is cut — the status card and CTA are never hidden.

## 3. Menu

**Layout (mobile):** section heading, then a horizontally scrollable chip row of
category filters, then one-column card list. Chips stick directly under the header while
the section is in view (progressive enhancement; static is acceptable).

```
┌──────────────────────────────┐
│  Menu                    h2  │
│  blurb (from category data)  │
│                              │
│ [All][Coffee][Tea][Night]… → │  chips, h-scroll
│                              │
│ ┌────────────────────────────┐│
│ │ Moonlight Espresso   $3.50 ││  card: title left,
│ │ chocolate-deep Brazil…     ││  price right, never
│ │ (House favorite)           ││  wraps, tags below
│ └────────────────────────────┘│
│ ┌────────────────────────────┐│
│ │ Honey Oat Latte      $5.25 ││
│ │ …                          ││
│ │ (Vegetarian)               ││
│ └────────────────────────────┘│
└──────────────────────────────┘
```

**Content hierarchy:** 1) h2 "Menu" · 2) filter chips (All / 5 categories) ·
3) category group heading (h3) · 4) item name (h4) + price · 5) description ·
6) dietary tag pills.

- **Filter behavior:** `All` is default; tapping a chip filters in place (no page
  change, no reload); filtered result count is not announced on every tap, only the
  panel content changes.
- **Visible immediately:** heading, chips, first 2 cards.
- **Primary action:** tap chip to filter. **Secondary:** none (no item detail pages).
- **Data:** rendered from `MENU_CATEGORIES`; prices formatted `$X.XX` from the numeric
  `price`; tags rendered as text pills from `TAG_LABELS` (never emoji or color-only).
- **Accessibility:** chips are a `tablist`/`tab` set with roving tabindex controlling one
  `tabpanel`; price includes currency in its accessible name; empty-filter state shows
  the brand microcopy "Nothing here matches — try another category."; cards are list
  items in a `<ul>`.
- **Collapse/expand:** chips scroll horizontally with an edge fade (wrap is forbidden —
  wrapping doubles the filter row height); tags wrap to extra lines under 360px; price
  column is fixed-width so titles truncate gracefully; no horizontal page scroll.

## 4. The Space

**Layout (mobile):** full-bleed horizontal photo gallery (snap scrolling, no autoplay),
followed by three info rows: Wi-Fi, Outlets, Seating.

```
┌──────────────────────────────┐
│  The Space               h2  │
│ ┌▭────▭┌▭────┐  1/3  ← swipe │  snap-scroll gallery,
│ └──────┘└─────┘              │  prev/next buttons
│                              │
│ (Wi-Fi)  Moonlight-Guest     │  icon + label + value
│          free for guests…    │  + secondary note
│                              │
│ (Outlets) 18 outlets         │
│           window bar + mezz… │
│                              │
│ (Seating) 42 seats           │
│           window bar 16 ·    │
│           tables 14 · sofa 6 │
│           patio 6            │
│           · Dog-friendly     │
│           · No reservations  │
└──────────────────────────────┘
```

**Content hierarchy:** 1) h2 · 2) first photo (hero of the section) ·
3) gallery position indicator · 4) Wi-Fi row · 5) Outlets row · 6) Seating breakdown.

- **Visible immediately:** heading + first photo; facts begin on scroll.
- **Primary action:** browse gallery (swipe or buttons). **Secondary:** none.
- **Data:** Wi-Fi/outlets/seating copy from `SITE.wifi`, `SITE.outlets`, `SITE.seating`.
- **Accessibility:** gallery is swipe **and** button driven (never swipe-only);
  `[◀] [▶]` buttons have labels "Previous photo"/"Next photo"; every image has real alt
  text describing the scene; no autoplay; info rows are a `<dl>` (term/definition);
  decorative icons `aria-hidden`.
- **Collapse/expand:** gallery is full-bleed edge-to-edge on mobile (negative-margin
  gutters); info rows stack full width; seating breakdown wraps to two lines under 360px.

## 5. Our Story

**Layout (mobile):** single text block, max 60ch, no image (per plan).

```
┌──────────────────────────────┐
│  Our Story               h2  │
│                              │
│  Paragraph 1…                │
│                              │
│  Paragraph 2…                │
└──────────────────────────────┘
```

**Content hierarchy:** 1) h2 · 2) two short paragraphs (90–130 words total,
written at build time in the brand voice; fictional founding story, 2019).

- **Visible immediately:** heading (it follows The Space naturally).
- **Primary action:** none — this section is read, not acted on.
- **Accessibility:** body text ≥ 16px, 1.6 line height, AA contrast; `section` with
  `aria-labelledby` its heading.
- **Collapse/expand:** nothing to collapse; on desktop it becomes a centered narrow
  column (see below).

## 6. Visit

**Layout (mobile):** address/contact block → map placeholder → hours table →
holiday exceptions.

```
┌──────────────────────────────┐
│  Visit                  h2  │
│                              │
│  142 Lumen Street            │
│  Northwind District          │
│  Cresthaven, CA 00000        │
│  (555) 555-0147   → tel link │
│  hello@moonlightcafe.example │
│                              │
│ ┌──────────────────────────┐ │
│ │  ▭ map illustration      │ │  4:3 placeholder —
│ │  (fictional area, NO     │ │  never a real pin
│ │   real business pin)     │ │
│ └──────────────────────────┘ │
│ [      Directions      ]     │  desktop/secondary
│                              │
│  Hours                       │
│  ┌───────┬────────┬────────┐ │
│  │ Day   │ Coffee │ Kitchen│ │  ← today's row marked
│  ├───────┼────────┼────────┤ │    with ● + "Today"
│  │ Mon ● │ 8–23   │ 9–22   │ │
│  │ Tue   │ Closed │ Closed │ │
│  │ …     │        │        │ │
│  └───────┴────────┴────────┘ │
│                              │
│  Holiday hours          h3   │
│  • Christmas Day — closed    │  from HOURS.exceptions
│  • New Year's Eve — late     │
│  • New Year's Day — coffee   │
│    only                      │
└──────────────────────────────┘
```

**Content hierarchy:** 1) h2 · 2) address (strongest text) · 3) phone/email links ·
4) map · 5) hours table · 6) exceptions list.

- **Visible immediately:** heading + address.
- **Primary action:** `Directions` button (also in sticky bar) · **Secondary:** tel:/mailto: links.
- **Data:** address/phone/email/parking/transit from `SITE`; table and exceptions from
  `HOURS` (coffee + kitchen columns; Tuesday shows "Closed"; exception rows annotate the
  matching table row *and* appear in the holiday list).
- **Accessibility:** real `<table>` with `<caption>` and column headers; today marked
  with text ("Today") not only a highlight; exception notes linked from table rows via
  footnote-style anchors; map image has descriptive alt; all contact links are real
  `tel:`/`mailto:`; times formatted consistently ("08:00–23:00").
- **Collapse/expand:** table must fit 320px without horizontal scroll (shrink cell
  padding, not font below 14px); on desktop the map and hours sit side by side.

## 7. Footer

**Layout (mobile):** dark, quiet, compact stack. Separated by a hairline, not a color change.

```
┌──────────────────────────────┐
│  Moonlight Café         ☾    │
│  Coffee for the hours        │
│  after dark.                 │
│                              │
│  142 Lumen Street, Cresthaven│
│  (555) 555-0147              │
│  hello@moonlightcafe.example │
│                              │
│  [ig] [bs] [✉]   ← # links  │
│                              │
│  Fictional café, built as a  │  small print:
│  portfolio project.          │  portfolio disclaimer
└──────────────────────────────┘
```

**Content hierarchy:** 1) brand statement (tagline) · 2) contact details ·
3) social placeholders · 4) fictional/portfolio small print.

- **Visible immediately:** n/a (page end).
- **Primary action:** contact links. **Secondary:** social placeholders.
- **Accessibility:** footer landmark; social links have accessible names
  ("Instagram (placeholder)") and are clearly marked placeholders (`href="#"` with a
  `rel="nofollow noopener"` note for the builder); small print ≥ 12px and still AA;
  bottom padding clears the sticky bar.
- **Collapse/expand:** nothing; stacks the same at all widths.

## 8. Sticky Mobile Action Bar

**Layout (mobile):** fixed bottom, full width, 64px + safe-area inset, three equal
columns, translucent blur, hairline top border.

```
┌───────────┬───────────┬───────────┐
│     ☎     │     ⚑     │     ➜     │  ← 3 equal cells,
│   Call    │ Directions│   Order   │     icon above label
└───────────┴───────────┴───────────┘
```

**Content hierarchy:** all three are equal weight — they are the site's escape hatches.

- **Destinations:** `Call` → `SITE.phoneHref` · `Directions` → maps query built from
  `SITE.address` (fictional area, generic map) · `Order` → `#menu` (the bar's Order
  button jumps to the menu; if an order-ahead flow is ever added it replaces this target).
- **Visible immediately:** always — it overlays every scroll position.
- **Primary action:** any of the three. **Secondary:** none.
- **Accessibility:** implemented as real links (`<a>`), not buttons; icon is decorative
  (`aria-hidden`) with a always-visible text label (no icon-only cells); each cell ≥ 64px
  tall meeting the 44px target rule; visible focus ring per cell; safe-area padding so
  iOS home indicator doesn't cover it.
- **Collapse/expand:** hidden entirely at ≥768px — its jobs move into the header/hero
  (see below). Page keeps `padding-bottom` equal to bar height at all times it's visible.

---

## Desktop adaptation (≥768px, high level only)

Mobile remains the source of truth. Changes:

- **Container:** max-width 1120px centered; section spacing grows to 96px.
- **Header:** `[≡]` replaced by inline nav links + a `Call` button; no overlay needed.
- **Sticky bar:** hidden; `Call` and `Directions` appear in the header, `Order` stays as
  the hero CTA alongside `See the menu` (two buttons in a row).
- **Hero:** single centered column retained, wider glow, supporting text to ~55ch —
  still typographic, no new imagery invented.
- **Menu:** cards become a 2-column grid (3 at ≥1200px); chips wrap-free in one row.
- **The Space:** gallery becomes a 3-across grid (no snap scrolling); info rows become a
  3-column band.
- **Our Story:** centered narrow column, unchanged otherwise.
- **Visit:** two columns — map left (sticky), address + hours + exceptions right.
- **Footer:** brand left, contact center, social right, single row + small print below.

## Build Order

1. **Skeleton + tokens** — semantic section shells with correct heading levels, skip
   link, anchor IDs; global tokens (night-owl palette, type scale, spacing) and the
   320/390/768 breakpoints.
2. **Header + nav overlay** — sticky behavior, focus trap, Escape handling.
3. **Sticky action bar** — three links, safe-area padding, page bottom padding.
4. **Hero static markup** — h1, tagline, text, status card shell, CTA (placeholder
   badge text initially).
5. **Open-now engine** — `HOURS` + `BUSYNESS` logic from `specs/open-now-system.md`;
   wires the badge, today's hours, and busy hint; 60s interval.
6. **Menu section** — render cards from `MENU_CATEGORIES`, chip filters, tag pills,
   empty state.
7. **Visit section** — hours table + exceptions rendered from `HOURS`, address block
   from `SITE`, map placeholder.
8. **The Space + Our Story + Footer** — gallery component, `<dl>` facts, story copy in
   brand voice, footer from `SITE`.
9. **Desktop pass** — apply the adaptation rules above.
10. **Verify** — keyboard-only walkthrough, axe/contrast check, Lighthouse mobile,
    real-device check at 320/390/768.
