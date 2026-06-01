# Bucket List Travel Dashboard

A personal travel dashboard that monitors simulated flight prices, compares them against per-destination budget thresholds, surfaces weather data, and helps prioritise trips by dream ranking.

Built with Vite + React + TypeScript as a client-side single-user app.

---

## Quick start

### Prerequisites

Node.js 18 or newer. If you don't have it, install via [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# restart your terminal, then:
nvm install --lts
```

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### AI vibe summary (optional)

The "Generate vibe summary" button in each destination's edit modal calls Claude via the Anthropic API. The API key is held **server-side** in the dev-server proxy — it never reaches the browser bundle.

```bash
cp .env.example .env.local
# edit .env.local and add your key:
# ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com/). Without a key the button still works and returns a clearly-labelled canned summary — the rest of the app is fully functional.

---

## Features

| Feature | Description |
|---|---|
| Destinations table | 10-column table: rank badge, destination + route, suggested-stay pill, status badge, flight price + delta, budget gauge, weather hi/lo, visa, booking window, actions |
| Budget status | Deal / Watching / Close / Over computed from current price vs. per-destination budget threshold |
| Simulated prices | ±20% random jitter around a per-destination base price; re-rolled on "Refresh prices" |
| Stats bar | 4 live tiles: within-budget count + dot indicators, best deal, best booking window, dream trip |
| Settings drawer | Slide-in drawer to change departure airport and edit all destinations: drag-to-reorder (dnd-kit), inline budget + stay inputs, delete |
| Edit modal | Full-field editor for any destination including visa, travel month, dream rank |
| Add destination | New destinations immediately appear in the table, stats, and ranking |
| Flight tracker panel | Shows current price, budget, and gauge for the selected row (defaults to rank #1) |
| Dream ranking panel | Ranked list with gold/silver/bronze medal badges; click any item to focus it in the tracker |
| AI vibe summary | On-demand 2–3 sentence travel summary via `claude-sonnet-4-6`; cached in state so it only fetches once per destination |
| Persistence | All user-authored data (destinations, budgets, ranks, departure airport) saved to `localStorage` |
| Light + dark mode | All colours via CSS custom properties; dark theme via `prefers-color-scheme` |

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 6 + React 19 + TypeScript 5 | Lightweight, fast HMR, no SSR needed |
| State | React Context + `useReducer` | Single-user dashboard; no external lib needed |
| Drag-to-reorder | dnd-kit | Modern, accessible, replaces deprecated react-beautiful-dnd |
| Icons | Tabler Icons React (outline set only) | Consistent weight, no filled variants |
| Styles | CSS Modules + CSS custom properties | Exact hex values from design spec, scoped classes |
| AI | Anthropic SDK (`claude-sonnet-4-6`) via Vite dev-server middleware | Key stays server-side; safe to push to GitHub |

---

## Project structure

```
src/
  components/
    layout/       TopBar, StatsRow, StatTile, BottomPanels, DepartureChip
    table/        DestinationTable, DestinationRow
    drawer/       SettingsDrawer, DepartureSection, DestinationEditRow
    modal/        DestinationModal (add + edit + vibe section)
    panels/       FlightTracker, DreamRanking
    ui/           Badge (rank + status), Pill (stay), BudgetGauge
  context/        AppStateContext, reducer, persistence
  data/           destinations (seed), weather, airports, pricing (mock)
  hooks/          useVibeSummary
  types/          index.ts — all domain types
  utils/          budgetStatus, bookingWindow, format, routeString, id
  styles/         variables.css (design tokens), global.css
```

---

## Design tokens

All colours are CSS custom properties in `src/styles/variables.css` with light/dark variants. Key values:

| Token | Light value | Use |
|---|---|---|
| `--status-deal-bg/text` | `#EAF3DE` / `#3B6D11` | Deal badge |
| `--status-over-bg/text` | `#FCEBEB` / `#A32D2D` | Over badge |
| `--gauge-green/amber/red` | `#639922` / `#BA7517` / `#E24B4A` | Budget gauge fill |
| `--tile-in-budget-bg` | `#EAF3DE` | Within-budget stat tile |
| `--row-tint-in-budget` | `#EAF3DE18` | In-budget table row tint |

---

## Departure airports (quick-pick)

SFO · OAK · SJC · LAX. All seed destinations are priced from SFO. Changing the departure airport updates all route strings; prices re-roll from the same base values (real API integration is stubbed in `src/data/pricing.ts` and `src/hooks/useVibeSummary.ts`).

---

## Limitations (MVP scope)

- Single user — no auth
- Client-side only — no backend, no database
- Flight prices are simulated (±20% jitter); real API stubs are in `src/data/pricing.ts`
- Weather is static climate normals per city; real API stub is in `src/data/weather.ts`
- Mobile layout is not optimised (desktop-first)
