// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    res.json({ token, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;