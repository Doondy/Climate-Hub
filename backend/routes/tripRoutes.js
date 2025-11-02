import express from "express";
import TripPlan from "../models/TripPlan.js";

const router = express.Router();

// ✅ GET all trips (for a user)
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || req.user?.id;
    const trips = await TripPlan.find(userId ? { user: userId } : {}).populate("user");
    res.json({ data: trips, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// ✅ GET single trip
router.get("/:id", async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id).populate("user");
    if (!trip) {
      return res.status(404).json({ error: "Trip not found", success: false });
    }
    res.json({ data: trip, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// ✅ CREATE trip
router.post("/", async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      user: req.body.userId || req.user?.id
    };
    const trip = await TripPlan.create(tripData);
    res.status(201).json({ data: trip, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// ✅ UPDATE trip
router.put("/:id", async (req, res) => {
  try {
    const trip = await TripPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) {
      return res.status(404).json({ error: "Trip not found", success: false });
    }
    res.json({ data: trip, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// ✅ DELETE trip
router.delete("/:id", async (req, res) => {
  try {
    const trip = await TripPlan.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found", success: false });
    }
    res.json({ message: "Trip deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

export default router;


