import express from "express";
import PhoneSubscription from "../src/models/PhoneSubscription.js";
const router = express.Router();

// Note: For production, you would need to set up Twilio or another SMS service
// For demo purposes, this will log the SMS details and provide instructions

// Environment variables needed (create in .env file):
// TWILIO_ACCOUNT_SID=your_account_sid
// TWILIO_AUTH_TOKEN=your_auth_token
// TWILIO_PHONE_NUMBER=your_twilio_phone_number

// Helper function to send SMS (wrapper for Twilio or demo)
const sendSMS = async (phone, message) => {
  // In production, you would use Twilio here
  // Example:
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // return await client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phone
  // });

  // Demo mode - just log
  console.log(`📱 SMS Alert to ${phone}: ${message}`);
  return { sid: 'demo_' + Date.now() };
};

// Subscribe phone number to receive automatic alerts
router.post("/subscribe", async (req, res) => {
  try {
    const { phone, name, alertTypes, regions } = req.body;

    // Validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format. Use format: +1234567890",
      });
    }

    // Check if phone already exists
    let subscription = await PhoneSubscription.findOne({ phone });

    if (subscription) {
      // Update existing subscription
      subscription.alertTypes = alertTypes || subscription.alertTypes;
      subscription.regions = regions || subscription.regions;
      subscription.isActive = true;
      subscription.name = name || subscription.name;
      await subscription.save();

      // Send welcome back message
      await sendSMS(phone, `Hi ${name || 'User'}! You've been resubscribed to weather alerts. You'll receive alerts for: ${alertTypes?.join(', ') || 'All alerts'}. Reply STOP to unsubscribe.`);

      return res.status(200).json({
        success: true,
        message: "Subscription updated successfully!",
        subscription,
      });
    } else {
      // Create new subscription
      subscription = new PhoneSubscription({
        phone,
        name,
        alertTypes: alertTypes || [],
        regions: regions || [],
        isActive: true,
      });
      await subscription.save();

      // Send welcome message
      await sendSMS(phone, `Welcome to Climate Hub Weather Alerts, ${name || 'User'}! You'll now receive timely weather alerts. Stay safe! Reply STOP to unsubscribe.`);

      return res.status(201).json({
        success: true,
        message: "Successfully subscribed to weather alerts!",
        subscription,
      });
    }
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process subscription. Please try again later.",
      error: error.message,
    });
  }
});

// Unsubscribe phone number
router.post("/unsubscribe", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const subscription = await PhoneSubscription.findOne({ phone });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Phone number not found in our database",
      });
    }

    subscription.isActive = false;
    await subscription.save();

    await sendSMS(phone, `You've been unsubscribed from Climate Hub Weather Alerts. You will no longer receive alerts. Reply SUBSCRIBE to resubscribe.`);

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from alerts",
    });
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe. Please try again later.",
      error: error.message,
    });
  }
});

// Send SMS to a specific phone
router.post("/send", async (req, res) => {
  try {
    const { phone, message, alertType } = req.body;

    // Validation
    if (!phone || !message) {
      return res.status(400).json({
        message: "Phone number and message are required",
      });
    }

    // Phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number format. Use format: +1234567890",
      });
    }

    // Send SMS
    await sendSMS(phone, message);

    // Log the SMS details
    console.log("📱 SMS Alert Details:");
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log(`Alert Type: ${alertType || "N/A"}`);
    console.log("Timestamp:", new Date().toISOString());

    // Update subscription activity if exists
    const subscription = await PhoneSubscription.findOne({ phone });
    if (subscription) {
      // Keep the subscription active and add this to history
      console.log(`📝 Alert sent to subscribed user: ${subscription.name || phone}`);
    }

    res.status(200).json({
      success: true,
      message: "SMS sent successfully! (Demo Mode - see server console for details)",
      sid: "demo_" + Date.now(),
    });
  } catch (error) {
    console.error("SMS Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send SMS. Please try again later.",
      error: error.message,
    });
  }
});

// Broadcast alert to all active subscribers
router.post("/broadcast", async (req, res) => {
  try {
    const { message, alertType, region } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Find all active subscribers that match the alert criteria
    let query = { isActive: true };

    if (alertType) {
      query.$or = [
        { alertTypes: { $in: [alertType] } },
        { alertTypes: { $size: 0 } } // Users with no specific preferences (receive all)
      ];
    }

    if (region) {
      query.$and = [
        { $or: [{ regions: { $size: 0 } }, { regions: { $in: [region] } }] }
      ];
    }

    const subscribers = await PhoneSubscription.find(query);

    if (subscribers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active subscribers found matching the criteria",
      });
    }

    // Send SMS to all subscribers
    const results = [];
    for (const subscriber of subscribers) {
      try {
        await sendSMS(subscriber.phone, message);
        results.push({ phone: subscriber.phone, status: 'sent' });
        console.log(`📤 Alert broadcasted to: ${subscriber.name || subscriber.phone}`);
      } catch (error) {
        results.push({ phone: subscriber.phone, status: 'failed', error: error.message });
        console.error(`❌ Failed to send to ${subscriber.phone}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Alert broadcasted to ${results.filter(r => r.status === 'sent').length} subscribers`,
      totalSubscribers: subscribers.length,
      results,
    });
  } catch (error) {
    console.error("Broadcast Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to broadcast alert",
      error: error.message,
    });
  }
});

// Get all subscribers
router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await PhoneSubscription.find().sort({ subscribedAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve subscribers",
      error: error.message,
    });
  }
});

export default router;