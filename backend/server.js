import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Import routes & models
import smsRoutes from "./routes/smsRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import LoginHistory from "./models/LoginHistory.js";
import User from "./models/User.js";
import History from "./models/History.js";
import EmployeeReport from "./models/EmployeeReport.js"; // ✅ New model

dotenv.config();

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());

// ------------------- DATABASE CONNECTION -------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/climatehub", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ------------------- ROUTES -------------------
app.use("/api/weather", weatherRoutes);
app.use("/api/sms", smsRoutes);

// ------------------- AUTH / LOGIN -------------------

// Register route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown IP";
    const userAgent = req.headers["user-agent"] || "Unknown device";

    const user = await User.findOne({ email });

    if (!user) {
      await LoginHistory.create({
        email,
        ipAddress,
        userAgent,
        loginStatus: "failed",
        failureReason: "User not found",
        loginTime: new Date(),
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginHistory.create({
        user: user._id,
        email,
        ipAddress,
        userAgent,
        loginStatus: "failed",
        failureReason: "Incorrect password",
        loginTime: new Date(),
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await LoginHistory.create({
      user: user._id,
      email,
      ipAddress,
      userAgent,
      loginStatus: "success",
      loginTime: new Date(),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- AUTH MIDDLEWARE -------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ------------------- HISTORY ROUTES -------------------
app.get("/api/history", authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/history", authMiddleware, async (req, res) => {
  try {
    const { city, weatherData } = req.body;
    const newHistory = new History({ user: req.user.id, city, weatherData });
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- LOGIN HISTORY ROUTES -------------------
app.get("/api/login-history", authMiddleware, async (req, res) => {
  try {
    const loginHistory = await LoginHistory.find({ user: req.user.id })
      .sort({ loginTime: -1 })
      .limit(50);
    res.json(loginHistory);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: all user login history
app.get("/api/login-history/all", authMiddleware, async (req, res) => {
  try {
    const loginHistory = await LoginHistory.find()
      .populate("user", "name email")
      .sort({ loginTime: -1 })
      .limit(100);
    res.json(loginHistory);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- EMPLOYEE REPORTS ROUTES -------------------

// Get all employee reports
app.get("/api/employees/reports", authMiddleware, async (req, res) => {
  try {
    const reports = await EmployeeReport.find().populate("employeeId", "name email");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get reports for a specific employee
app.get("/api/employees/reports/:id", authMiddleware, async (req, res) => {
  try {
    const reports = await EmployeeReport.find({ employeeId: req.params.id }).sort({
      date: -1,
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create new report
app.post("/api/employees/reports", authMiddleware, async (req, res) => {
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

// ------------------- BASE ROUTES -------------------
app.get("/", (req, res) => {
  res.send("🌐 Climate Hub Backend is running!");
});

app.get("/health", (req, res) => {
  res.send("💓 Server is healthy!");
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));