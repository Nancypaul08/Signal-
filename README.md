<<<<<<< HEAD
# Signal-
=======
# SIGNAL — Pause. Verify. Decide.

An interactive Media & Information Literacy (MIL) prototype for **UNESCO Youth Hackathon 2026**
(Application/Website Development track — AI + MIL), aligned with the theme
*"Play Your Part: Youth Designing the Future of Media and Information Literacy."*

## What this is

SIGNAL puts a player in front of 10 realistic (fictional) pieces of content — messages,
posts, images, clips, headlines — and asks not "real or fake?" but **"what do you do next?"**
Players choose investigate actions (check the source, the date, the context, look for
corroboration, look for AI artifacts) before deciding: Trust, Verify Further, Ignore, Share,
Report, or **Uncertain** — a first-class, correct answer in several cases.

At the end, players get a personalised MIL profile: per-skill scores (source checking,
context awareness, corroboration, AI literacy, responsible sharing), a behavioural archetype
(e.g. "The Fast Sharer"), their biggest blind spot, and one concrete next habit. Players can
then step into **Creator Mode** and build — and immediately play — their own case, closing the
consumer → investigator → creator loop the brief calls for.

There's also an optional **Live Signal Check** panel from the landing page: it pulls real,
current headlines from public news RSS feeds and demonstrates cross-outlet corroboration on
live data. It's clearly separated from the core (scored, fictional) game — see "Live data,
real backend" below for why, and how to turn on the full backend version.

## Why this design

- **No binary labels.** The game never asks "true or false." It asks what action is
  responsible given the evidence available — which is the actual skill people need offline.
- **Uncertainty is a valid, scored-correct outcome**, not a cop-out, in cases where the
  evidence genuinely doesn't support a conclusion (see Case 08).
- **AI ≠ false.** Case 10 is an AI-assisted post that is accurate and should be trusted;
  Cases 2 and 6 show AI-generated/altered content that shouldn't be. The lesson is to judge
  the source and evidence, not the production method.
- **All scenarios are fictional**, written for this prototype — no real people, outlets, or
  events are named or impersonated, and nothing here could itself be mistaken for
  misinformation if screenshotted out of context.

## Live data, real backend

The core game needs none of this — it's fully static and works offline. But you asked for
real data and a backend, so here's exactly what's real and what's optional:

- **Right now, today:** the Live Signal Check panel calls a public RSS→JSON bridge directly
  from the browser to pull real headlines from BBC News, NPR, and Al Jazeera, and checks
  whether the same story appears across more than one of them — a genuine, live corroboration
  signal, computed on real data, with zero setup.
- **`/backend`** is a real Node/Express service that does the same fetching server-side on a
  daily cron, caches it, and serves it as an API — the production version of the same idea,
  deployable to Render/Railway/Fly in about 15 minutes. It's optional and decoupled on purpose:
  see `backend/README.md` for why, and for deploy steps.
- Either way, this panel **never labels a real headline true or false** — only whether it's
  independently corroborated. Judging live news accuracy is a much bigger problem than a
  same-day build should try to solve; corroboration-checking is the actual transferable skill,
  and it's honest to demonstrate on live data without overclaiming what the tool can verify.

## Tech / how to run

Pure HTML/CSS/JavaScript. No build step for the core game; the optional backend is Node.
State lives in memory for the session — nothing is written to a server for the core game.

```
open index.html      # or double-click it, or serve the folder with any static server
```

Files:
- `index.html` — screen structure (landing, case, feedback, dashboard, creator, live)
- `style.css` — visual design system (dark, editorial/newsroom aesthetic)
- `script.js` — game logic, content, and the Live Signal Check panel
- `backend/` — optional Node/Express service for the production version of live data

## Current scope (MVP) vs. what's deliberately out of scope

This build is intentionally self-contained so it is fully judgeable offline with zero setup:

**In scope:** 10 hand-authored cases, investigate/decide loop, evidence reveals, per-skill
scoring, archetype feedback, a working (single-session) creator mode.

**Deliberately not built for this MVP** (see proposal for roadmap): a shared/moderated case
library across users, accounts or persistent history, multilingual content, and any live AI
or backend calls. These are scalability items, not MVP requirements — building them now would
add risk without strengthening the core MIL mechanic the jury is judging.

## Accessibility notes

Semantic buttons throughout (keyboard/focus operable), visible focus states, `aria-live`
region on the evidence panel so investigate actions are announced, and a `prefers-reduced-motion`
fallback. Full WCAG audit is a scale-up item, not an MVP claim.
>>>>>>> 43ee22e (Initial commit: restore SIGNAL UI and Live feed)
