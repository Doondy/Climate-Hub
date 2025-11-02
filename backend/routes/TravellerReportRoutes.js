import express from "express";
import TravellerReport from "../models/TravellerReport.js";
const router = express.Router();

// Create report
router.post("/", async (req, res) => {
  try {
    const report = new TravellerReport(req.body);
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reports
router.get("/", async (req, res) => {
  const reports = await TravellerReport.find().sort({ createdAt: -1 });
  res.json(reports);
});

// Update report
router.put("/:id", async (req, res) => {
  const updated = await TravellerReport.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete report
router.delete("/:id", async (req, res) => {
  await TravellerReport.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;