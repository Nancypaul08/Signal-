# SIGNAL backend (optional, production-track)

This is a small Node/Express service that fetches real headlines from named,
public news RSS feeds once a day, caches them, and serves them as JSON —
plus a same-outlet-independent corroboration check computed server-side.

**This is not required for tonight's submission.** The core game (10 case
files, investigate/decide loop, dashboard, Creator Mode) is fully static and
runs with zero backend. This service only powers the optional "Live Signal
Check" panel, which already has a client-side fallback and fails visibly
(not silently, not with fake data) if it can't reach a live feed.

## Why it's separate

A backend that has to be online, unrate-limited, and reachable from whatever
network you're demoing on is a real point of failure during judging. Keeping
it optional means a flaky deploy or a conference wifi problem can't take down
your actual submission — worst case, the Live Signal Check panel shows its
built-in "try again" state and the rest of the product is untouched.

## Run locally

```
cd backend
npm install
npm start
```

Serves on `http://localhost:3001`:
- `GET /api/health` — status + last cache refresh time
- `GET /api/daily-cases` — cached headlines with corroboration info
- `GET /api/refresh-now` — manually trigger a refresh (handy for a live demo
  of "this updates daily" without waiting for the 06:00 cron)

## Deploy it for real (15 minutes, any of these)

- **Render** (free web service tier): New → Web Service → point at this
  `backend/` folder → build command `npm install`, start command `npm start`.
- **Railway**: New Project → Deploy from repo → set root directory to
  `backend/`.
- **Fly.io**: `fly launch` from inside `backend/`, accept the Node
  defaults.

After deploying, note the public URL (e.g. `https://signal-backend.onrender.com`)
and point the frontend at it — see `LIVE_API_BASE` in `../script.js`. Until
you do that, the frontend talks directly to the public RSS bridge instead,
which is why it works today without any deploy step.

## Honest limitations

- In-memory cache only — restarts lose it until the next refresh (fine for a
  demo; swap in Redis or a file/DB cache before relying on this for real
  users).
- No auth/rate-limiting on the endpoints — add both before pointing this at
  a public audience beyond a demo.
- It reports *corroboration*, never *truth*. Keep it that way — deciding
  whether a real, live news event is accurate is a much bigger and riskier
  problem than this service is built to solve.
