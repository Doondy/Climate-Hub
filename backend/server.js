import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ IMPORT MODELS
import User from "./models/User.js";
import LoginHistory from "./models/LoginHistory.js";
import History from "./models/History.js";

// ✅ IMPORT NEW MODELS (optional but good for role extension)
import Employee from "./models/Employee.js";
import Company from "./models/Company.js";

// ✅ IMPORT ROUTES
import smsRoutes from "./routes/smsRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import weatherAbsenceRoutes from "./routes/weatherAbsenceRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import phoneSubscriptionRoutes from "./routes/phoneSubscription.js";
import employeeRoutes from "./routes/EmployeeRoutes.js";
import travellerReportRoutes from "./routes/TravellerReportRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

dotenv.config();

// ✅ INIT APP
const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT MONGO
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://Doondy:Doondy123@climatehub.z6fawzm.mongodb.net/";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
  }
};
connectDB();

// ✅ ROUTES
app.use("/api/weather", weatherRoutes);
app.use("/api/weather/absence", weatherAbsenceRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/phone-subscription", phoneSubscriptionRoutes);

// ✅ NEW ROUTES
app.use("/api/employee", employeeRoutes);
app.use("/api/traveller-reports", travellerReportRoutes);
app.use("/api/trips", tripRoutes);

// ✅ REGISTER USER (Traveller or Employee by role)
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role = "traveller" } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

    res.status(201).json({ message: "Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid Credentials" });

    await LoginHistory.create({
      user: user._id,
      email,
      ipAddress: ip,
      userAgent,
      loginStatus: "success",
      loginTime: new Date(),
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ AUTH MIDDLEWARE
const auth = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ message: "Auth token required" });

  try {
    const token = header.replace("Bearer ", "");
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ USER HISTORY
app.get("/api/history", auth, async (req, res) => {
  const data = await History.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(data);
});

app.post("/api/history", auth, async (req, res) => {
  const newEntry = new History({ user: req.user.id, ...req.body });
  await newEntry.save();
  res.json(newEntry);
});

// ✅ LOGIN HISTORY
app.get("/api/login-history", auth, async (req, res) => {
  const logs = await LoginHistory.find({ user: req.user.id }).sort({ loginTime: -1 });
  res.json(logs);
});

// ✅ TEST ROUTES
app.get("/", (req, res) => res.send("🌍 ClimateHub Backend Running"));
app.get("/health", (req, res) => res.send("✅ Healthy Server"));

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);