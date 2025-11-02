import mongoose from "mongoose";

const TripPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  destination: String,
  startDate: Date,
  endDate: Date,
  notes: String
}, { timestamps: true });

export default mongoose.model("TripPlan", TripPlanSchema);