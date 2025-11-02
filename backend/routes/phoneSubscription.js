import express from "express";
import PhoneSubscription from "../models/PhoneSubscription.js";

const router = express.Router();

// Add phone number
router.post("/add", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const newSub = new PhoneSubscription({ phoneNumber });
    await newSub.save();

    res.status(201).json({ message: "Phone saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save phone", error: err.message });
  }
});

// Get all numbers
router.get("/list", async (req, res) => {
  try {
    const subs = await PhoneSubscription.find().sort({ subscribedAt: -1 });
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch numbers" });
  }
});

export default router;