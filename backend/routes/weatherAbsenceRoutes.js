import express from "express";
import WeatherAbsence from "../models/WeatherAbsence.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET all absence requests (admin/company view)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const requests = await WeatherAbsence.find()
      .populate("userId", "name email")
      .sort({ submittedAt: -1 });
    res.json({ data: requests, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// ✅ GET user's own absence requests
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized", success: false });
    }

    const requests = await WeatherAbsence.find({ userId })
      .sort({ submittedAt: -1 });
    res.json({ data: requests, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// ✅ CREATE absence request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized", success: false });
    }

    const absenceData = {
      ...req.body,
      userId
    };

    const newAbsence = await WeatherAbsence.create(absenceData);
    res.status(201).json({ data: newAbsence, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// ✅ GET single absence request
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const absence = await WeatherAbsence.findById(req.params.id)
      .populate("userId", "name email");
    
    if (!absence) {
      return res.status(404).json({ error: "Absence request not found", success: false });
    }

    res.json({ data: absence, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// ✅ UPDATE absence request (admin approval/rejection)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    const absence = await WeatherAbsence.findByIdAndUpdate(
      req.params.id,
      { status, comment, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!absence) {
      return res.status(404).json({ error: "Absence request not found", success: false });
    }

    res.json({ data: absence, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// ✅ DELETE absence request
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const absence = await WeatherAbsence.findById(req.params.id);

    if (!absence) {
      return res.status(404).json({ error: "Absence request not found", success: false });
    }

    // Only allow deletion if user owns it or is admin
    if (absence.userId.toString() !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden", success: false });
    }

    await WeatherAbsence.findByIdAndDelete(req.params.id);
    res.json({ message: "Absence request deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

export default router;


