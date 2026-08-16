/* ============================================================
   SIGNAL backend — daily headline cache
   ------------------------------------------------------------
   What this does:
     - On a daily schedule (default 06:00 server time), fetches
       real headlines from a small set of named, public news RSS
       feeds and caches them in memory.
     - Serves that cache over a simple JSON API the frontend can
       call instead of hitting rss2json directly from the browser.
     - Also computes cross-outlet corroboration server-side, so the
       frontend doesn't have to.

   What this deliberately does NOT do:
     - It never labels a headline true or false. It only reports
       which named outlets are currently carrying a matching story.
       Asserting truth about live, real-world events is outside
       what a same-day hackathon build should attempt safely.
     - It is not required for the core SIGNAL game (the 10 case
       files and the dashboard) to run — that part is fully static
       and has zero dependency on this service being online.

   Deploy (Render, Railway, Fly.io, or any Node host):
     1. cd backend && npm install
     2. Set PORT via the host's env if required (defaults to 3001).
     3. npm start
     4. Point the frontend's LIVE_API_BASE (see script.js) at your
        deployed URL, e.g. https://your-app.onrender.com
============================================================ */

const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const cron = require("node-cron");

const app = express();
app.use(cors());
const parser = new Parser({ timeout: 8000 });

const FEEDS = [
  { name: "BBC News", url: "http://feeds.bbci.co.uk/news/rss.xml" },
  { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" }
];

const STOPWORDS = new Set(["with","from","that","this","have","will","after","over","into","their","about","what","when","where","which","says","said"]);
function significantWords(title){
  return (title || "").toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/)
    .filter(w => w.length > 4 && !STOPWORDS.has(w));
}
function overlapCount(a, b){
  const wa = new Set(significantWords(a));
  return significantWords(b).filter(w => wa.has(w)).length;
}

let cache = { updatedAt: null, items: [] };

async function refreshCache(){
  const perFeed = await Promise.allSettled(
    FEEDS.map(async f => {
      const feed = await parser.parseURL(f.url);
      return feed.items.slice(0, 8).map(it => ({
        title: it.title, link: it.link, pubDate: it.pubDate || it.isoDate, source: f.name
      }));
    })
  );
  const all = perFeed.filter(r => r.status === "fulfilled").flatMap(r => r.value);

  const withCorroboration = all.map(item => {
    const matches = all.filter(o => o.source !== item.source && overlapCount(item.title, o.title) >= 2);
    return { ...item, corroboratedBy: [...new Set(matches.map(m => m.source))] };
  });

  cache = { updatedAt: new Date().toISOString(), items: withCorroboration };
  console.log(`[signal-backend] cache refreshed: ${withCorroboration.length} items at ${cache.updatedAt}`);
}

app.get("/api/health", (req, res) => res.json({ ok: true, lastUpdated: cache.updatedAt }));

app.get("/api/daily-cases", (req, res) => {
  if(!cache.updatedAt){
    return res.status(503).json({ error: "Cache not warmed yet — try again in a moment." });
  }
  res.json(cache);
});

app.get("/api/refresh-now", async (req, res) => {
  // Manual trigger, useful for demoing "daily update" without waiting for the cron.
  try {
    await refreshCache();
    res.json({ ok: true, updatedAt: cache.updatedAt, count: cache.items.length });
  } catch (e){
    res.status(500).json({ error: e.message });
  }
});

// Daily refresh at 06:00 server time. Change the cron expression to refresh more often.
cron.schedule("0 6 * * *", refreshCache);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`[signal-backend] listening on :${PORT}`);
  try { await refreshCache(); } catch (e) { console.error("[signal-backend] initial fetch failed:", e.message); }
});
