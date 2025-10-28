import mongoose from "mongoose";
const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  weatherData: { type: Object },
}, { timestamps: true });

export default mongoose.model("History", historySchema);