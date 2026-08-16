/* ============================================================
   SIGNAL — Pause. Verify. Decide.
   Core game is data-driven, static, and has no backend or
   external calls. All 10 SCENARIOS below are FICTIONAL, built
   for this prototype — see README for why.

   The optional "Live Signal Check" panel (bottom of this file)
   is the one part of the app that does make an external call:
   it fetches real, current headlines from public news RSS feeds
   for a corroboration-checking exercise. It never asserts an
   item is true or false, it's not scored into the MIL dashboard,
   and it fails visibly (not silently) if it can't reach a feed.
============================================================ */

const ACTIONS = ["TRUST","VERIFY FURTHER","IGNORE","SHARE","REPORT","UNCERTAIN"];

const SCENARIOS = [
  {
    id: 1,
    type: "Forwarded message",
    source: "Forwarded 40+ times · no named sender",
    content: "\u201cThis common fruit peel cures headaches instantly. Doctors don't want you to know. Share before it gets banned!\u201d",
    investigate: [
      { key:"SOURCE", label:"Check source", reveal:"No original sender. Message has been forwarded through at least 6 unrelated group chats." },
      { key:"EVIDENCE", label:"Check evidence", reveal:"No doctor, study, or institution is named anywhere in the message." }
    ],
    correct: ["IGNORE","REPORT"],
    isMisleading: true,
    skill: "EVIDENCE",
    explanation: "Urgency (\u201cshare before it's banned\u201d) plus zero named evidence is a classic misinformation pattern \u2014 the fix is simple: no source, no share.",
    lesson: "Claims that demand urgent sharing but name no source or evidence are a red flag on their own."
  },
  {
    id: 2,
    type: "Social media image",
    source: "Posted by an anonymous account, 3.2k reposts",
    content: "A dramatic, hyper-detailed photo captioned: \u201cFlooding hitting the city center RIGHT NOW.\u201d",
    investigate: [
      { key:"CONTEXT", label:"Reverse-search the image", reveal:"No matching photo found from any news agency or weather service." },
      { key:"AI AWARENESS", label:"Look for AI artifacts", reveal:"Street signage in the image has warped, unreadable lettering \u2014 a common AI-generation artifact." }
    ],
    correct: ["VERIFY FURTHER","IGNORE"],
    isMisleading: true,
    skill: "AI AWARENESS",
    explanation: "The image shows classic signs of AI generation, and no official source confirms flooding. Public-safety claims deserve extra verification before any reaction.",
    lesson: "AI-generated images can look completely convincing. Corroboration matters more than how real something looks."
  },
  {
    id: 3,
    type: "Photo, resurfaced",
    source: "Shared today, no date shown in post",
    content: "\u201cMassive crowd protesting outside Parliament \u2014 happening right now.\u201d",
    investigate: [
      { key:"DATE", label:"Check the image metadata", reveal:"File metadata shows this photo was taken 4 years ago." },
      { key:"CONTEXT", label:"Search where it first appeared", reveal:"Originally published in coverage of a completely different, unrelated protest." }
    ],
    correct: ["REPORT","IGNORE"],
    isMisleading: true,
    skill: "DATE",
    explanation: "The photo itself is real \u2014 it's just old and mislabeled with a false \u201chappening now\u201d claim. That's still misinformation, just a different kind.",
    lesson: "A real photo can still mislead. Always check when and where it first appeared before trusting the caption."
  },
  {
    id: 4,
    type: "News headline",
    source: "Published by an established science outlet",
    content: "\u201cSCIENTISTS SHOCKED: New Study Proves Coffee Is Dangerous.\u201d",
    investigate: [
      { key:"SOURCE", label:"Check the outlet", reveal:"The outlet is a real, established science publication." },
      { key:"EVIDENCE", label:"Read past the headline", reveal:"The underlying study found a small, non-significant effect in a very small sample \u2014 nothing close to \u201cproof.\u201d" }
    ],
    correct: ["VERIFY FURTHER"],
    isMisleading: true,
    skill: "SOURCE",
    explanation: "The source is credible, but the headline dramatically overstates a modest, inconclusive finding. The story is real \u2014 the framing is the problem.",
    lesson: "A legitimate source can still run a misleading headline. Read the actual finding before reacting to the framing."
  },
  {
    id: 5,
    type: "News-style screenshot",
    source: "Unverified account, styled to look like a major news channel",
    content: "Graphic claiming a well-known public figure said something scandalous in a private meeting.",
    investigate: [
      { key:"SOURCE", label:"Check the account", reveal:"The account is not the outlet's official, verified account \u2014 logo and formatting are slightly off." },
      { key:"CORROBORATION", label:"Check other outlets", reveal:"No other news organization is reporting this story." }
    ],
    correct: ["IGNORE","VERIFY FURTHER"],
    isMisleading: true,
    skill: "SOURCE",
    explanation: "Visual branding is easy to fake. With no corroboration from any other outlet, this doesn't meet the bar to trust or share.",
    lesson: "Looking official isn't the same as being official. Verify through the outlet's real, verified channel."
  },
  {
    id: 6,
    type: "Video clip",
    source: "Low-resolution clip, source unclear",
    content: "A shaky clip appears to show a public figure saying something sharply out of character.",
    investigate: [
      { key:"CORROBORATION", label:"Search for the original", reveal:"No reputable outlet has published or referenced this clip." },
      { key:"AI AWARENESS", label:"Check for manipulation signs", reveal:"Audio and lip movement don't fully sync \u2014 inconclusive, but worth flagging." }
    ],
    correct: ["UNCERTAIN","VERIFY FURTHER"],
    isMisleading: true,
    skill: "AI AWARENESS",
    explanation: "The evidence is suspicious but not conclusive either way. This is exactly the kind of case where holding judgment is the responsible move.",
    lesson: "Not all manipulated media is obvious. When evidence is inconclusive, 'uncertain' can be the most honest answer."
  },
  {
    id: 7,
    type: "Press release",
    source: "Official school district statement, named administrator quoted",
    content: "\u201cLocal school pilots a phone-free campus policy \u2014 early results show a sharp rise in test scores.\u201d",
    investigate: [
      { key:"SOURCE", label:"Check the source", reveal:"Published directly by the school district's official press office, named administrator quoted." },
      { key:"CORROBORATION", label:"Check other coverage", reveal:"Confirmed independently by two local news outlets." }
    ],
    correct: ["TRUST","SHARE"],
    isMisleading: false,
    skill: "CORROBORATION",
    explanation: "It sounds like a bold claim, but it's backed by an official, named source and independent corroboration. Surprising doesn't mean false.",
    lesson: "Give surprising-but-true claims the same rigor as suspicious ones \u2014 sometimes the evidence checks out."
  },
  {
    id: 8,
    type: "Local post",
    source: "Single account, no other reports either way",
    content: "A post claims a small, unusual event happened in a town with very little online media coverage.",
    investigate: [
      { key:"EVIDENCE", label:"Look for evidence", reveal:"Only one account describes it. No local outlet has confirmed or denied it." }
    ],
    correct: ["UNCERTAIN"],
    isMisleading: null,
    skill: "EVIDENCE",
    explanation: "There isn't enough evidence to call this true or false yet \u2014 and that's fine. Recognizing insufficient evidence is itself a MIL skill.",
    lesson: "Media literacy isn't always about reaching an answer. Sometimes the responsible move is to wait for more evidence."
  },
  {
    id: 9,
    type: "Opinion column",
    source: "Published in the outlet's labeled Opinion section",
    content: "\u201cWhy This New Policy Will Destroy Small Businesses\u201d \u2014 styled like a breaking news headline.",
    investigate: [
      { key:"SOURCE", label:"Check the section label", reveal:"Clearly labeled 'Opinion' in the outlet's own site structure." },
      { key:"EVIDENCE", label:"Check for supporting data", reveal:"The piece presents one perspective with no data or opposing view." }
    ],
    correct: ["VERIFY FURTHER","IGNORE"],
    isMisleading: true,
    skill: "SOURCE",
    explanation: "This is a labeled opinion piece, not a factual news report \u2014 but its headline is written to be mistaken for one.",
    lesson: "Always separate opinion and analysis from factual reporting, even when the headline format looks the same."
  },
  {
    id: 10,
    type: "Official AI-assisted post",
    source: "Verified city government account, labeled 'AI-assisted summary'",
    content: "\u201cAI-generated weather safety summary: heavy rain expected tonight, avoid low-lying roads.\u201d",
    investigate: [
      { key:"SOURCE", label:"Check the account", reveal:"Posted by the city's official, verified government account." },
      { key:"CORROBORATION", label:"Cross-check the forecast", reveal:"Matches the official meteorological service's current warning." }
    ],
    correct: ["TRUST","SHARE"],
    isMisleading: false,
    skill: "AI AWARENESS",
    explanation: "AI-generated doesn't mean false. What matters is the source and whether it's corroborated \u2014 both check out here.",
    lesson: "'AI-generated' and 'false' are not the same question. Judge the source and evidence, not who or what wrote it."
  }
];

/* ---------------- state ---------------- */
let idx = 0;
let investigatedThisCase = new Set();
let decisionMade = false;
let log = []; // per-case: {skill, correct, investigated, isMisleading, action}

const skillBuckets = {
  "Source Checking": ["SOURCE","EVIDENCE"],
  "Context Awareness": ["CONTEXT","DATE"],
  "Corroboration": ["CORROBORATION"],
  "AI Literacy": ["AI AWARENESS"],
  "Responsible Sharing": ["RESPONSIBILITY"]
};

/* ---------------- helpers ---------------- */
const $ = (id) => document.getElementById(id);
function show(screenId){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  $(screenId).classList.remove("hidden");
}

function updateToolkitBar(){
  $("toolkitProgress").textContent = idx < SCENARIOS.length
    ? `CASE ${String(idx+1).padStart(2,"0")} / ${SCENARIOS.length}`
    : `DEBRIEF`;
  document.querySelectorAll(".skill-chip").forEach(c=>c.classList.remove("lit"));
}

function litSkill(skillKey){
  const map = {
    "SOURCE":"SOURCE","EVIDENCE":"EVIDENCE","DATE":"DATE","CONTEXT":"CONTEXT",
    "CORROBORATION":"CORROBORATION","AI AWARENESS":"AI AWARENESS"
  };
  const target = map[skillKey];
  if(!target) return;
  const chip = document.querySelector(`.skill-chip[data-skill="${target}"]`);
  if(chip) chip.classList.add("lit");
}

/* ---------------- render case ---------------- */
let isCustomCase = false;

function renderCase(){
  isCustomCase = false;
  renderCaseObject(SCENARIOS[idx]);
}

function renderCaseObject(s){
  updateToolkitBar();
  investigatedThisCase = new Set();
  decisionMade = false;

  $("caseTypeTag").textContent = s.type;
  $("caseStamp").className = "case-stamp";
  $("caseStamp").textContent = "";
  $("caseSource").textContent = s.source;
  $("caseContent").textContent = s.content;

  const invWrap = $("investigateOptions");
  invWrap.innerHTML = "";
  s.investigate.forEach(inv=>{
    const btn = document.createElement("button");
    btn.className = "chip-btn";
    btn.textContent = inv.label;
    btn.addEventListener("click", ()=>{
      if(investigatedThisCase.has(inv.key)) return;
      investigatedThisCase.add(inv.key);
      btn.classList.add("used");
      litSkill(inv.key);
      const line = document.createElement("div");
      line.className = "evidence-line";
      line.innerHTML = `<b>${inv.key}:</b> ${inv.reveal}`;
      $("evidencePanel").appendChild(line);
    });
    invWrap.appendChild(btn);
  });
  $("evidencePanel").innerHTML = "";

  const decWrap = $("decideOptions");
  decWrap.innerHTML = "";
  const allDecideBtns = [];
  ACTIONS.forEach(action=>{
    const btn = document.createElement("button");
    btn.className = "chip-btn decision";
    btn.textContent = action;
    btn.addEventListener("click", ()=> handleDecideClick(action, s, btn, allDecideBtns));
    decWrap.appendChild(btn);
    allDecideBtns.push(btn);
  });
  $("decideStatus").textContent = "";

  renderSessionLog();
  show("screen-case");
  // wire clickable case elements after render
  wireCaseClickables();
}

const DECISION_MICRO_COPY = {
  "TRUST": "Logging it as trustworthy…",
  "VERIFY FURTHER": "Flagging for further verification…",
  "IGNORE": "Choosing not to act on it…",
  "SHARE": "Preparing to share this forward…",
  "REPORT": "Flagging this for review…",
  "UNCERTAIN": "Holding judgment \u2014 evidence isn't conclusive…"
};

function handleDecideClick(action, s, btn, allButtons){
  if(decisionMade) return;
  decisionMade = true;

  allButtons.forEach(b=>{
    if(b !== btn) b.disabled = true;
  });
  btn.classList.add("selected");
  $("decideStatus").textContent = DECISION_MICRO_COPY[action] || "Locking in your call…";

  setTimeout(()=> decide(action, s), 550);
}

function renderSessionLog(){
  const wrap = $("sessionLog");
  const wrapOuter = wrap.closest(".session-log-wrap");
  if(isCustomCase){
    wrapOuter.classList.add("hidden");
    return;
  }
  wrapOuter.classList.remove("hidden");
  wrap.innerHTML = "";
  SCENARIOS.forEach((sc, i)=>{
    const chip = document.createElement("div");
    const entry = log[i];
    if(entry){
      let cls = "bad";
      if(entry.correct) cls = "good";
      else if(entry.partial) cls = "mid";
      chip.className = `log-chip done ${cls}`;
      chip.textContent = String(i+1).padStart(2,"0");
      chip.title = `Case ${i+1}: ${entry.action}`;
    } else if(i === idx){
      chip.className = "log-chip active";
      chip.textContent = String(i+1).padStart(2,"0");
      chip.title = `Case ${i+1}: in progress`;
    } else {
      chip.className = "log-chip";
      chip.textContent = String(i+1).padStart(2,"0");
      chip.title = `Case ${i+1}: not yet reached`;
    }
    wrap.appendChild(chip);
  });
}

/* ---------------- decide + feedback ---------------- */
function decide(action, s){
  const isCorrect = s.correct.includes(action);
  const investigated = investigatedThisCase.size > 0;

  let responsibilityPoint = 0;
  if(action === "SHARE"){
    responsibilityPoint = s.isMisleading ? -1 : 1;
  } else if(s.isMisleading){
    responsibilityPoint = 1;
  }

  log.push({
    caseId: s.id,
    skill: s.skill,
    correct: isCorrect,
    partial: (action === "UNCERTAIN" && !isCorrect),
    investigated,
    isMisleading: s.isMisleading,
    action,
    responsibilityPoint
  });

  // verdict styling
  let verdictClass = "bad", verdictText = "MISJUDGED";
  if(isCorrect){ verdictClass="good"; verdictText="SOUND CALL"; }
  else if(action === "UNCERTAIN"){ verdictClass="mid"; verdictText="CAUTIOUS \u2014 REASONABLE"; }

  $("feedbackVerdict").className = "feedback-verdict " + verdictClass;
  $("feedbackVerdict").textContent = verdictText;

  let extra = "";
  if(action === "SHARE" && s.isMisleading){
    extra = " You identified enough to act, but sharing unverified or misleading content \u2014 even with good intentions \u2014 still spreads it further.";
  }
  $("feedbackExplanation").textContent = s.explanation + extra;
  $("feedbackLesson").textContent = "\u2192 " + s.lesson;

  show("screen-feedback");
}

$("btnNext").addEventListener("click", ()=>{
  if(isCustomCase){
    isCustomCase = false;
    log.pop(); // a self-authored case doesn't count toward the learner's own MIL score
    renderDashboard();
    return;
  }
  idx++;
  if(idx < SCENARIOS.length){
    renderCase();
  } else {
    renderDashboard();
  }
});

/* ---------------- dashboard ---------------- */
function computeMetric(bucketSkills){
  const relevant = log.filter(l => bucketSkills.includes(l.skill) || (bucketSkills.includes("RESPONSIBILITY")));
  if(bucketSkills.includes("RESPONSIBILITY")){
    const total = log.length;
    const positive = log.filter(l=>l.responsibilityPoint > 0).length;
    return total ? Math.round((positive/total)*100) : 0;
  }
  if(relevant.length === 0) return null;
  const correctCount = relevant.filter(l => l.correct || l.partial).length;
  return Math.round((correctCount/relevant.length)*100);
}

function renderDashboard(){
  updateToolkitBar();
  const totalTruth = log.reduce((acc,l)=> acc + (l.correct?1:(l.partial?0.5:0)), 0);
  const maxTruth = log.length;
  const overall10 = (totalTruth/maxTruth*10).toFixed(1);

  $("dashScore").innerHTML = `${overall10}<span> / 10 MIL LITERACY</span>`;

  const metrics = {};
  Object.entries(skillBuckets).forEach(([label, skills])=>{
    metrics[label] = computeMetric(skills);
  });

  const metricsWrap = $("dashMetrics");
  metricsWrap.innerHTML = "";
  Object.entries(metrics).forEach(([label, pct])=>{
    const val = pct === null ? 0 : pct;
    const row = document.createElement("div");
    row.className = "metric-row";
    row.innerHTML = `
      <div class="metric-label">${label}</div>
      <div class="metric-bar"><div class="metric-fill" style="width:${val}%"></div></div>
      <div class="metric-pct">${pct===null?"\u2014":val+"%"}</div>
    `;
    metricsWrap.appendChild(row);
  });

  // blind spot / strength
  const validMetrics = Object.entries(metrics).filter(([,v])=>v!==null);
  validMetrics.sort((a,b)=>a[1]-b[1]);
  const blindSpot = validMetrics[0];
  const strongest = validMetrics[validMetrics.length-1];

  // profile archetype
  const aiPct = metrics["AI Literacy"] ?? 0;
  const ctxPct = metrics["Context Awareness"] ?? 0;
  const srcPct = metrics["Source Checking"] ?? 0;
  const respPct = metrics["Responsible Sharing"] ?? 0;

  let archetype, archetypeDesc;
  if(respPct < 60 && (srcPct >= 70 || overall10 >= 7)){
    archetype = "THE FAST SHARER";
    archetypeDesc = "You're often right about what's true or false \u2014 but you act before the verification finishes. Speed is costing you responsibility points.";
  } else if(aiPct >= 80 && ctxPct < 60){
    archetype = "THE AI WATCHER";
    archetypeDesc = "Strong at catching synthetic or AI-touched content, but you sometimes assume human-made content needs less scrutiny.";
  } else if(ctxPct >= 80){
    archetype = "THE CONTEXT DETECTIVE";
    archetypeDesc = "You're excellent at catching content that's technically real but used in a misleading context or timeframe.";
  } else if(srcPct >= 80 && ctxPct < 60){
    archetype = "THE SOURCE SKEPTIC";
    archetypeDesc = "You interrogate who's behind information well \u2014 now push the same rigor into checking dates and context.";
  } else {
    archetype = "THE BALANCED VERIFIER";
    archetypeDesc = "Solid, consistent judgment across source, context, evidence and responsible action \u2014 no major blind spot.";
  }

  $("dashProfile").innerHTML = `<h3>${archetype}</h3><p>${archetypeDesc}</p>`;

  $("dashCallouts").innerHTML = `
    <div class="callout"><div class="k">Biggest blind spot</div><div class="v">${blindSpot?blindSpot[0]:"\u2014"}</div></div>
    <div class="callout"><div class="k">Strongest skill</div><div class="v">${strongest?strongest[0]:"\u2014"}</div></div>
    <div class="callout"><div class="k">Next habit</div><div class="v">${nextHabit(blindSpot ? blindSpot[0] : null)}</div></div>
  `;

  // before / after
  const first = log[0], last = log[log.length-1];
  let baText = "Not enough data to compare rounds.";
  if(first && last){
    const firstNote = first.investigated ? "you investigated before deciding" : "you decided without investigating first";
    const lastNote = last.investigated ? "you investigated before deciding" : "you decided without investigating first";
    baText = `Case 01: ${firstNote}. Case ${SCENARIOS.length}: ${lastNote}. You didn't just answer more cases \u2014 notice whether you changed <em>how</em> you got to your answer.`;
  }
  $("dashBeforeAfter").innerHTML = baText;

  show("screen-dashboard");
}

function nextHabit(blindSpotLabel){
  const habits = {
    "Source Checking": "Before trusting a claim, ask: who exactly is the original source \u2014 not just who shared it?",
    "Context Awareness": "Before reacting to a photo or clip, check when and where it first appeared.",
    "Corroboration": "Before deciding, check whether at least one independent, credible outlet reports the same thing.",
    "AI Literacy": "Separate the question 'is this AI-made?' from 'is this true?' \u2014 they're not the same question.",
    "Responsible Sharing": "If you're not sure yet, hold off sharing \u2014 verifying first is faster than undoing a share."
  };
  return habits[blindSpotLabel] || "Keep pairing every investigate action with a deliberate decision.";
}

/* ---------------- creator mode ---------------- */
$("btnCreator").addEventListener("click", ()=> show("screen-creator"));
$("btnBackDash").addEventListener("click", ()=> show("screen-dashboard"));

let customScenario = null;

$("creatorForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const headline = $("cHeadline").value.trim();
  const source = $("cSource").value.trim();
  const suspicious = $("cSuspicious").value.trim();
  const action = $("cAction").value;
  const lesson = $("cLesson").value.trim();

  $("cPreviewSource").textContent = source;
  $("cPreviewContent").textContent = headline;
  $("cPreviewStamp").className = "case-stamp show mid";
  $("cPreviewStamp").textContent = "CORRECT ACTION: " + action;
  $("cPreviewLesson").textContent = "\u2192 " + lesson;
  $("creatorPreview").classList.remove("hidden");

  customScenario = {
    id: "custom",
    type: "Community case",
    source: source,
    content: headline,
    investigate: [
      { key:"EVIDENCE", label:"What did the creator flag?", reveal: suspicious }
    ],
    correct: [action],
    isMisleading: (action === "TRUST" || action === "SHARE") ? false : (action === "UNCERTAIN" ? null : true),
    skill: "EVIDENCE",
    explanation: "This is the case you built. Its author set the correct response to \u201c" + action + ".\u201d",
    lesson: lesson || "Every case needs a clear reason a young investigator could actually check."
  };
  $("btnPlayCustom").classList.remove("hidden");
});

$("btnPlayCustom").addEventListener("click", ()=>{
  if(!customScenario) return;
  isCustomCase = true;
  show("screen-case");
  renderCaseObject(customScenario);
});

/* ---------------- start / restart ---------------- */
$("btnStart").addEventListener("click", ()=>{
  idx = 0; log = [];
  renderCase();
});
$("btnRestart").addEventListener("click", ()=>{
  idx = 0; log = [];
  $("creatorForm").reset();
  $("creatorPreview").classList.add("hidden");
  renderCase();
});

/* ---------------- live signal check ----------------
   Fetches REAL, current headlines client-side from public news RSS
   feeds via a keyless RSS→JSON bridge. Nothing here is fabricated,
   nothing here is scored, and nothing here asserts an item is true
   or false — it only demonstrates cross-outlet corroboration on
   live data. If the feeds are unreachable (offline demo, rate
   limit, blocked network), it fails visibly rather than showing
   stale or fake headlines as if they were live.
------------------------------------------------------------------*/
const LIVE_FEEDS = [
  { name: "BBC News",      url: "http://feeds.bbci.co.uk/news/rss.xml" },
  { name: "NPR",           url: "https://feeds.npr.org/1001/rss.xml" },
  { name: "Al Jazeera",    url: "https://www.aljazeera.com/xml/rss/all.xml" }
];
const RSS_BRIDGE = "https://api.rss2json.com/v1/api.json?rss_url=";
// Set this to your deployed backend URL (see /backend/README.md) once it's live,
// e.g. "https://signal-backend.onrender.com". Left empty, the panel talks
// directly to the public RSS bridge below — no backend deploy required.
const LIVE_API_BASE = "http://localhost:3001";
const STOPWORDS = new Set(["with","from","that","this","have","will","after","over","into","their","about","what","when","where","which","says","said"]);

function significantWords(title){
  return (title || "").toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/)
    .filter(w => w.length > 4 && !STOPWORDS.has(w));
}

function overlapCount(a, b){
  const wa = new Set(significantWords(a));
  const wb = significantWords(b);
  return wb.filter(w => wa.has(w)).length;
}

async function fetchFeed(feed, signal){
  const res = await fetch(RSS_BRIDGE + encodeURIComponent(feed.url), { signal });
  if(!res.ok) throw new Error("bad response");
  const data = await res.json();
  if(!data.items || !data.items.length) throw new Error("no items");
  return data.items.map(it => ({
    title: it.title, link: it.link, pubDate: it.pubDate, source: feed.name
  }));
}

async function loadLiveFeeds(){
  const statusEl = $("liveStatus");
  const resultsEl = $("liveResults");
  statusEl.className = "live-status";
  statusEl.textContent = "Contacting live feeds…";
  resultsEl.innerHTML = "";

  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), 7000);

  try {
    let primary, others, updatedNote = "";

    // Prefer backend if configured and reachable; otherwise fall back to public RSS feeds.
    let fetched = [];
    if(LIVE_API_BASE){
      try{
        const res = await fetch(LIVE_API_BASE.replace(/\/$/,"") + "/api/daily-cases", { signal: controller.signal });
        if(res.ok){
          const data = await res.json();
          if(data.items && data.items.length) fetched = data.items;
          updatedNote = data.updatedAt ? `Backend cache last refreshed ${new Date(data.updatedAt).toLocaleString()}.` : "";
        }
      } catch(e){ /* fallback to RSS */ }
    }

    if(fetched.length === 0){
      const results = await Promise.allSettled(LIVE_FEEDS.map(f => fetchFeed(f, controller.signal)));
      const ok = results.filter(r => r.status === "fulfilled").map(r => r.value).flat();
      if(ok.length === 0) throw new Error("all feeds failed");
      fetched = ok;
      if(results.filter(r=>r.status==='rejected').length){
        updatedNote = `Note: some feeds didn't respond; showing available recent items.`;
      }
    }

    clearTimeout(timeout);
    statusEl.className = "live-status ok";

    if(updatedNote){
      const note = document.createElement("div");
      note.className = "live-status";
      note.textContent = updatedNote;
      resultsEl.appendChild(note);
    }

    // Filter to recent items (last 24 hours) and deduplicate by title
    const now = Date.now();
    const H24 = 24 * 60 * 60 * 1000;
    const seen = new Set();
    const recent = fetched
      .map(it => ({ title: it.title, link: it.link, pubDate: it.pubDate, source: it.source }))
      .filter(it => {
        if(!it.pubDate) return false;
        const t = new Date(it.pubDate).getTime();
        return !isNaN(t) && (now - t) <= H24;
      })
      .sort((a,b)=> new Date(b.pubDate) - new Date(a.pubDate))
      .filter(it=>{
        const key = (it.title||"").toLowerCase().trim();
        if(seen.has(key)) return false; seen.add(key); return true;
      })
    ;

    // If there are no recent items, relax filter to last 72 hours instead of showing nothing
    primary = recent;
    if(primary.length === 0){
      const H72 = 72 * 60 * 60 * 1000;
      const seen2 = new Set();
      primary = fetched
        .filter(it => {
          if(!it.pubDate) return false;
          const t = new Date(it.pubDate).getTime();
          return !isNaN(t) && (now - t) <= H72;
        })
        .sort((a,b)=> new Date(b.pubDate) - new Date(a.pubDate))
        .filter(it=>{
          const key = (it.title||"").toLowerCase().trim();
          if(seen2.has(key)) return false; seen2.add(key); return true;
        });
      if(primary.length) {
        const note = document.createElement('div'); note.className='live-status'; note.textContent = 'Showing items from the last 72 hours (no fresh 24h items found).'; resultsEl.appendChild(note);
      }
    }

    // Others set for corroboration checks
    others = fetched;
    // Finally, render the freshest N items
    primary.slice(0,5).forEach(item => {
      const card = document.createElement("div");
      card.className = "live-card";
      card.innerHTML = `
        <div class="live-card-source">${item.source}${item.pubDate ? " · " + new Date(item.pubDate).toLocaleString() : ""}</div>
        <div class="live-card-title">${item.title}</div>
        <button class="chip-btn live-corrob-btn">Check corroboration</button>
        <div class="live-corrob-result hidden"></div>
        <br><a class="live-card-link" href="${item.link}" target="_blank" rel="noopener">Read at the original source →</a>
      `;
      const btn = card.querySelector(".live-corrob-btn");
      const out = card.querySelector(".live-corrob-result");
      btn.addEventListener("click", ()=>{
        const namedSources = item.corroboratedBy
          ? item.corroboratedBy
          : [...new Set(others.filter(o => overlapCount(item.title, o.title) >= 2).map(m => m.source))];
        out.classList.remove("hidden","low");
        if(namedSources.length > 0){
          out.textContent = `Also currently reported by: ${namedSources.join(", ")}. Independent corroboration across named outlets is a real, checkable signal — this is what "verify further" looks like in practice.`;
        } else {
          out.classList.add("low");
          out.textContent = `No other tracked outlet currently carries a matching headline. That alone doesn't make it false — but it's exactly the point where "uncertain, pending more coverage" is the honest call.`;
        }
        btn.disabled = true;
      });
      resultsEl.appendChild(card);
    });

  } catch (err){
    clearTimeout(timeout);
    statusEl.className = "live-status error";
    statusEl.innerHTML = `Live feeds aren\u2019t reachable right now (offline, blocked network, or rate-limited) \u2014 this panel needs an internet connection at runtime. <button class="chip-btn" id="btnLiveRetry" style="margin-left:8px;">Retry</button>`;
    const retryBtn = $("btnLiveRetry");
    if(retryBtn) retryBtn.addEventListener("click", loadLiveFeeds);
  }
}

$("btnLive").addEventListener("click", ()=>{
  show("screen-live");
  loadLiveFeeds();
});
$("btnLiveBack").addEventListener("click", ()=> show("screen-landing"));

/* initial */
// ---------- drawer & modal handlers ----------
function openDrawerForSkill(skillKey){
  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('investigationDrawer');
  const eyebrow = document.getElementById('drawerEyebrow');
  const title = document.getElementById('drawerTitle');
  const body = document.getElementById('drawerBody');
  eyebrow.textContent = 'INVESTIGATION';
  const scenario = isCustomCase ? customScenario : SCENARIOS[idx];
  title.textContent = skillKey + ' Analysis';
  body.innerHTML = '';
  if(scenario && scenario.investigate){
    const found = scenario.investigate.find(i => i.key === skillKey || i.key === (skillKey.replace(/\s+/g,' ')) );
    if(found){
      body.innerHTML = `
        <p class="modal-eyebrow">ORIGINAL SOURCE</p>
        <div class="drawer-detail">
          <p><strong>Publisher:</strong> ${scenario.source}</p>
          <p><strong>Summary:</strong> ${found.reveal}</p>
        </div>
        <div style="margin-top:12px"><button class="btn btn-outline" id="openArticle">OPEN ORIGINAL ARTICLE ↗</button></div>
      `;
    } else {
      body.innerHTML = `<p class="drawer-detail">No investigation notes available for ${skillKey} in this case.</p>`;
    }
  }
  overlay.classList.add('show');
  drawer.classList.add('show');
  drawer.setAttribute('aria-hidden','false');
  // prevent background scroll
  document.body.style.overflow = 'hidden';
}

function closeDrawer(){
  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('investigationDrawer');
  overlay.classList.remove('show');
  drawer.classList.remove('show');
  drawer.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// wire skill chips
document.querySelectorAll('.skill-chip').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const skill = btn.getAttribute('data-skill');
    openDrawerForSkill(skill);
  });
});

// overlay close handlers
  const _drawerOverlayEl = document.getElementById('drawerOverlay');
  if(_drawerOverlayEl) _drawerOverlayEl.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-close').forEach(b=> b.addEventListener('click', ()=>{
  // try to close nearest overlay/modal/drawer
  const modalOverlay = b.closest('.modal') ? b.closest('.modal').parentElement : null;
  if(modalOverlay && modalOverlay.classList.contains('modal-overlay')){
    modalOverlay.classList.add('hidden');
  }
  closeDrawer();
}));

// modal overlay click to close
document.querySelectorAll('.modal-overlay').forEach(ov=>{
  ov.addEventListener('click', (e)=>{
    if(e.target === ov){ ov.classList.add('hidden'); }
  });
});

// Escape key closes overlays
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    // hide any visible modal-overlay
    document.querySelectorAll('.modal-overlay').forEach(m=> m.classList.add('hidden'));
    closeDrawer();
  }
});

updateToolkitBar();

// ----- header nav behavior -----
const topNavLinks = document.querySelectorAll('#navLinks .nav-link');
if(topNavLinks && topNavLinks.length){
  topNavLinks.forEach(btn => btn.addEventListener('click', ()=>{
  topNavLinks.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const nav = btn.getAttribute('data-nav');
  if(nav === 'investigate'){
    // start the first case if not started
    if(document.getElementById('screen-case').classList.contains('hidden')){
      document.getElementById('btnStart').click();
    } else show('screen-case');
  } else if(nav === 'learn') show('screen-learn');
  else if(nav === 'activity') show('screen-activity');
  else if(nav === 'live') show('screen-live');
}));
}

// mobile nav toggle
const navHamburger = document.getElementById('navHamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
if(navHamburger && mobileNav && mobileNavOverlay){
  navHamburger.addEventListener('click', ()=>{
    mobileNav.classList.toggle('show');
    mobileNavOverlay.classList.toggle('show');
  });
  mobileNavOverlay.addEventListener('click', ()=>{ mobileNav.classList.remove('show'); mobileNavOverlay.classList.remove('show'); });
}

// mobile nav links
const _mobileNavLinks = document.querySelectorAll('#mobileNav .nav-link');
if(_mobileNavLinks && _mobileNavLinks.length){
  _mobileNavLinks.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = btn.getAttribute('data-nav');
      if(mobileNav) mobileNav.classList.remove('show');
      if(mobileNavOverlay) mobileNavOverlay.classList.remove('show');
      if(nav === 'investigate') document.getElementById('btnStart')?.click();
      else if(nav === 'learn') show('screen-learn');
      else if(nav === 'activity') show('screen-activity');
      else if(nav === 'live') show('screen-live');
    });
  });
}

// landing investigate button shortcut
const btnInvestigateLanding = document.getElementById('btnInvestigateLanding');
if(btnInvestigateLanding) btnInvestigateLanding.addEventListener('click', ()=>{ document.getElementById('btnStart').click(); document.querySelectorAll('#navLinks .nav-link').forEach(b=>b.classList.remove('active')); document.querySelector('#navLinks .nav-link[data-nav="investigate"]')?.classList.add('active'); });

// modal openers for common actions
function openModalById(overlayId){
  const ov = document.getElementById(overlayId);
  if(!ov) return;
  ov.classList.remove('hidden');
  // prevent background scroll while modal open
  document.body.style.overflow = 'hidden';
}

function closeAllModals(){
  document.querySelectorAll('.modal-overlay').forEach(m=> m.classList.add('hidden'));
  document.body.style.overflow = '';
}

// Read story -> open article modal and fill
const btnReadStory = document.getElementById('btnReadStory');
if(btnReadStory){
  btnReadStory.addEventListener('click', ()=>{
    const scenario = isCustomCase ? customScenario : SCENARIOS[idx];
    const body = document.getElementById('articleBody');
    if(body && scenario){
      body.innerHTML = `<h3>${scenario.type}</h3><p style="margin-top:8px">${scenario.content}</p><p style="margin-top:10px;font-family:var(--font-mono);color:var(--muted)">Source: ${scenario.source}</p>`;
    }
    openModalById('articleOverlay');
  });
}

// View evidence -> open drawer to EVIDENCE
const btnViewEvidence = document.getElementById('btnViewEvidence');
if(btnViewEvidence){
  btnViewEvidence.addEventListener('click', ()=>{
    openDrawerForSkill('EVIDENCE');
  });
}

// Investigate all -> reveal toolkit bar and focus
const btnInvestigateAll = document.getElementById('btnInvestigateAll');
if(btnInvestigateAll){
  btnInvestigateAll.addEventListener('click', ()=>{
    const tb = document.getElementById('toolkitBar');
    if(tb) tb.classList.remove('hidden');
    // light the first skill
    document.querySelector('.skill-chip')?.focus();
  });
}

// make case elements clickable
function wireCaseClickables(){
  const cs = document.getElementById('caseSource');
  if(cs) cs.style.cursor = 'pointer', cs.addEventListener('click', ()=> openDrawerForSkill('SOURCE'));
  const cc = document.getElementById('caseContent');
  if(cc) cc.style.cursor = 'pointer', cc.addEventListener('click', ()=> document.getElementById('btnReadStory')?.click());
  const ctt = document.getElementById('caseTypeTag');
  if(ctt) ctt.style.cursor = 'pointer', ctt.addEventListener('click', ()=> openModalById('articleOverlay'));
  const stamp = document.getElementById('caseStamp');
  if(stamp) stamp.style.cursor = 'pointer', stamp.addEventListener('click', ()=> openModalById('reasoningOverlay'));
  const sidebarVerd = document.getElementById('sidebarVerdict');
  if(sidebarVerd) sidebarVerd.style.cursor = 'pointer', sidebarVerd.addEventListener('click', ()=> openModalById('reasoningOverlay'));
  const sbTools = document.getElementById('sidebarTools');
  if(sbTools) sbTools.style.cursor = 'pointer', sbTools.addEventListener('click', ()=> document.getElementById('btnInvestigateAll')?.click());
}

// wire landing step clicks to navigate or show context
document.querySelectorAll('.landing-step').forEach(s=>{
  s.style.cursor = 'pointer';
  s.addEventListener('click', ()=>{
    // focus on the matching step: if PAUSE -> show landing, INVESTIGATE -> start
    const label = s.querySelector('.step-label')?.textContent?.trim();
    if(label === 'INVESTIGATE') document.getElementById('btnStart')?.click();
    else if(label === 'PAUSE') window.scrollTo({top:0,behavior:'smooth'});
    else if(label === 'VERIFY') alert('Verify: use the investigation tools to check sources.');
  });
});

// Ensure modal close buttons also restore body scroll
document.querySelectorAll('.drawer-close').forEach(b=> b.addEventListener('click', ()=>{
  document.body.style.overflow = '';
}));
