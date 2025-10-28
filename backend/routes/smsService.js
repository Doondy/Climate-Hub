import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize Twilio client using environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send an SMS message via Twilio
 * @param {string} phone - The recipient's phone number (E.164 format, e.g., "+911234567890")
 * @param {string} message - The message content
 * @returns {Promise<object>} Twilio API response
 */
export const sendSMS = async (phone, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio verified phone number
      to: phone,
    });

    console.log("✅ SMS sent successfully:", result.sid);
    return result;
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    throw error;
  }
};