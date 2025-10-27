import express from "express";
const router = express.Router();

// Simple weather route for demo purposes
router.get("/test", (req, res) => {
  res.json({ message: "Weather API is working!" });
});

export default router;