const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SIGNAL backend is running",
    version: "1.0.0"
  });
});

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "signal-backend",
    timestamp: new Date().toISOString()
  });
});

// ─────────────────────────────────────────────
// DAILY CASES
// ─────────────────────────────────────────────

app.get("/api/daily-cases", (req, res) => {
  try {
    const cases = [
      {
        id: 1,
        title: "Flooding hitting the city center RIGHT NOW",
        source: "Social Media",
        type: "Social Media Image",
        description:
          "A dramatic image claims that flooding is currently affecting the city center.",
        verdict: "VERIFY FURTHER",
        explanation:
          "The image requires independent verification. Check the original source, date, location, and corroborating reports.",
        tags: ["image", "breaking", "verification"]
      },
      {
        id: 2,
        title: "Viral photograph claims to show a recent event",
        source: "Social Media",
        type: "Photograph",
        description:
          "A widely shared photograph is being presented as evidence of a recent event.",
        verdict: "MISJUDGED",
        explanation:
          "The photograph may be genuine, but the accompanying context can still be misleading. Verify when and where it was originally published.",
        tags: ["old-photo", "context", "misinformation"]
      },
      {
        id: 3,
        title: "AI-generated image presented as real news",
        source: "Social Media",
        type: "AI-generated Image",
        description:
          "An apparently realistic image is circulating with a claim about a current event.",
        verdict: "MISLEADING",
        explanation:
          "Visual realism alone is not evidence of authenticity. Look for independent reporting and reliable provenance.",
        tags: ["AI", "image", "deepfake"]
      }
    ];

    res.json({
      success: true,
      updatedAt: new Date().toISOString(),
      count: cases.length,
      items: cases
    });
  } catch (error) {
    console.error("Daily cases error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to load daily cases"
    });
  }
});

// ─────────────────────────────────────────────
// 404 HANDLER
// ─────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SIGNAL backend listening on port ${PORT}`);
});
