const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SIGNAL backend is running"
  });
});

// Daily cases API
app.get("/api/daily-cases", async (req, res) => {
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
          "The image requires independent verification. Check the original source, date, location and corroborating reports.",
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
          "The photograph may be genuine but the accompanying context can still be misleading. Verify when and where it was originally published.",
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
          "Visual realism alone is not evidence of authenticity. Look for independent reporting and provenance.",
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
    console.error("daily-cases error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to load daily cases"
    });
  }
});

// Simple health endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SIGNAL backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy"
  });
});

app.get("/api/daily-cases", async (req, res) => {
  res.json({
    success: true,
    items: []
  });
});
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SIGNAL backend listening on ${PORT}`);
});
