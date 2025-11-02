import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

export default mongoose.model("PhoneSubscriber", phoneSchema);