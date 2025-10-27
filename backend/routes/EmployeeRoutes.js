// routes/employeeRoutes.js
import express from "express";
import EmployeeReport from "../models/EmployeeReport.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // We'll define this middleware below

const router = express.Router();

// GET all reports (Admin or Manager)
router.get("/reports", authMiddleware, async (req, res) => {
  try {
    const reports = await EmployeeReport.find().populate("employeeId", "name email");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET reports for a specific employee
router.get("/reports/:id", authMiddleware, async (req, res) => {
  try {
    const reports = await EmployeeReport.find({ employeeId: req.params.id }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST new report
router.post("/reports", authMiddleware, async (req, res) => {
  try {
    const { employeeId, date, attendanceStatus, tasksCompleted, remarks } = req.body;
    const newReport = new EmployeeReport({
      employeeId,
      date,
      attendanceStatus,
      tasksCompleted,
      remarks,
    });
    await newReport.save();
    res.status(201).json({ message: "Report created successfully", newReport });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;