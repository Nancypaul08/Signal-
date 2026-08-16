const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Root API test
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SIGNAL backend is running",
    version: "1.0.0"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy"
  });
});

// Daily cases
app.get("/daily-cases", (req, res) => {
  res.json({
    success: true,
    updatedAt: new Date().toISOString(),
    count: 3,
    items: [
      {
        id: 1,
        title: "Flooding hitting the city center RIGHT NOW",
        source: "Social Media",
        type: "Social Media Image",
        verdict: "VERIFY FURTHER",
        description:
          "A dramatic image claims that flooding is currently affecting the city center.",
        explanation:
          "Verify the original source, date, location and independent reports.",
        tags: ["image", "breaking", "verification"]
      },
      {
        id: 2,
        title: "Viral photograph claims to show a recent event",
        source: "Social Media",
        type: "Photograph",
        verdict: "MISJUDGED",
        description:
          "A widely shared photograph is presented as evidence of a recent event.",
        explanation:
          "The image may be genuine, but its context should be independently verified.",
        tags: ["old-photo", "context", "misinformation"]
      },
      {
        id: 3,
        title: "AI-generated image presented as real news",
        source: "Social Media",
        type: "AI-generated Image",
        verdict: "MISLEADING",
        description:
          "A realistic-looking image is circulating with a current-event claim.",
        explanation:
          "Visual realism does not prove authenticity. Check provenance and independent reporting.",
        tags: ["AI", "image", "deepfake"]
      }
    ]
  });
});

// Export for Vercel
module.exports = app;
