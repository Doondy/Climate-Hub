import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import PhoneSubscription from "../models/PhoneSubscription.js";

dotenv.config();
const router = express.Router();

// ✅ Initialize Twilio client (only if credentials exist)
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log("✅ Twilio client initialized");
} else {
  console.warn("⚠️ Twilio credentials not found. Running in DEMO MODE.");
}

// ✅ Helper: Send SMS (Twilio or Demo)
const sendSMS = async (phone, message) => {
  try {
    if (!client) {
      console.log(`📱 [Demo Mode] SMS to ${phone}: ${message}`);
      return { sid: "demo_" + Date.now() };
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`✅ SMS sent to ${phone}: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(`❌ Error sending SMS to ${phone}:`, error.message);
    throw error;
  }
};

// ✅ Subscribe phone number
router.post("/subscribe", async (req, res) => {
  try {
    const { phone, name, alertTypes, regions } = req.body;

    if (!phone) return res.status(400).json({ success: false, message: "Phone number is required" });
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ success: false, message: "Invalid phone number format" });

    let subscription = await PhoneSubscription.findOne({ phone });

    if (subscription) {
      subscription.alertTypes = alertTypes || subscription.alertTypes;
      subscription.regions = regions || subscription.regions;
      subscription.isActive = true;
      subscription.name = name || subscription.name;
      await subscription.save();

      await sendSMS(phone, `Hi ${name || "User"}! You’ve been resubscribed to weather alerts. Alerts: ${alertTypes?.join(", ") || "All"}. Reply STOP to unsubscribe.`);

      return res.status(200).json({ success: true, message: "Subscription updated successfully", subscription });
    } else {
      subscription = new PhoneSubscription({ phone, name, alertTypes: alertTypes || [], regions: regions || [], isActive: true });
      await subscription.save();

      await sendSMS(phone, `Welcome to Climate Hub, ${name || "User"}! You’ll now receive timely weather alerts. Stay safe! Reply STOP to unsubscribe.`);

      return res.status(201).json({ success: true, message: "Subscribed successfully", subscription });
    }
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({ success: false, message: "Failed to process subscription", error: error.message });
  }
});

// ✅ Unsubscribe phone
router.post("/unsubscribe", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone number is required" });

    const subscription = await PhoneSubscription.findOne({ phone });
    if (!subscription) return res.status(404).json({ success: false, message: "Phone not found" });

    subscription.isActive = false;
    await subscription.save();

    await sendSMS(phone, `You’ve been unsubscribed from Climate Hub Alerts. Reply SUBSCRIBE to rejoin.`);

    res.status(200).json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    res.status(500).json({ success: false, message: "Failed to unsubscribe", error: error.message });
  }
});

// ✅ Send SMS to a specific phone
router.post("/send", async (req, res) => {
  try {
    const { phone, message, alertType } = req.body;
    if (!phone || !message) return res.status(400).json({ message: "Phone and message are required" });

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ message: "Invalid phone number format" });

    const result = await sendSMS(phone, message);

    console.log(`📤 SMS sent to ${phone} | Alert Type: ${alertType || "General"} | SID: ${result.sid}`);

    res.status(200).json({ success: true, message: "SMS sent successfully", sid: result.sid });
  } catch (error) {
    console.error("SMS Error:", error);
    res.status(500).json({ success: false, message: "Failed to send SMS", error: error.message });
  }
});

// ✅ Broadcast alert to all active subscribers
router.post("/broadcast", async (req, res) => {
  try {
    const { message, alertType, region } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    let query = { isActive: true };
    if (alertType) {
      query.$or = [
        { alertTypes: { $in: [alertType] } },
        { alertTypes: { $size: 0 } }, // Receives all
      ];
    }
    if (region) {
      query.$and = [{ $or: [{ regions: { $size: 0 } }, { regions: { $in: [region] } }] }];
    }

    const subscribers = await PhoneSubscription.find(query);
    if (!subscribers.length) return res.status(404).json({ success: false, message: "No active subscribers found" });

    const results = [];
    for (const sub of subscribers) {
      try {
        const resSMS = await sendSMS(sub.phone, message);
        results.push({ phone: sub.phone, status: "sent", sid: resSMS.sid });
      } catch (err) {
        results.push({ phone: sub.phone, status: "failed", error: err.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Broadcast sent to ${results.filter(r => r.status === "sent").length}/${subscribers.length} subscribers`,
      results,
    });
  } catch (error) {
    console.error("Broadcast Error:", error);
    res.status(500).json({ success: false, message: "Broadcast failed", error: error.message });
  }
});

// ✅ Get all subscribers
router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await PhoneSubscription.find().sort({ subscribedAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch subscribers", error: error.message });
  }
});

export default router;