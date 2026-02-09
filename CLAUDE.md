# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build

## Architecture

This is a React 19 + Vite interactive Valentine's Day experience. No router library is used — all navigation is managed through React state and URL query parameters in `App.jsx`.

### Flow

`App.jsx` is the central orchestrator. It manages date-based access control, audio playback, page transitions (fade overlays), and renders components conditionally:

1. **Countdown** — Timer shown before the event starts (Feb 7, 2026)
2. **ValentineQuestion** — Typewriter-animated Yes/No question (the "No" button flees the cursor)
3. **IntroductionPage** — Animated intro with sequential text reveals and photo strips
4. **Promise pages** (1–7) — Each unlocks on a specific date; accessed via `?promise=X` URL param

### Unlock schedule

- Promise 1: Feb 8 at 21:00
- Promises 2–7: Midnight on Feb 9–14 respectively

### Key directories

- `src/components/` — Page-level components (each Promise is its own component, e.g. `Promise1Growth.jsx`, `Promise2Home.jsx`)
- `src/hooks/` — `useDateTracker` (date state + `?date=` param for testing time offsets), `useMousePosition` (mouse/touch tracking with smoothing)
- `src/data.js` — Valentine's week data array (Feb 7–14) with titles, descriptions, content per day
- `src/index.css` — All custom animations (float, pulse-glow, scrollPhotos, sun-appear, screen-pulse, etc.) and glassmorphism styles alongside Tailwind imports

### Patterns

- **Date testing**: Append `?date=YYYY-MM-DDTHH:MM:SS` to URL to simulate a different date/time
- **Audio**: Background music managed via `useRef`; pauses/resumes on promise transitions; per-promise audio tracks (`promise1.mp3`, etc.) with mute toggle and volume fading
- **Animations**: Mix of CSS keyframes (hearts, photo strips), `requestAnimationFrame` (particle systems in Promise1Growth), and CSS transitions for state changes
- **Fonts**: Dancing Script (cursive headings), Playfair Display (narrative text), Outfit (body/UI)

### Deployment

Configured for subdirectory deployment at `/mycutusbdaycountdown2026/` (see `base` in `vite.config.js`).
