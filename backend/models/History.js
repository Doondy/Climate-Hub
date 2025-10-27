const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  weatherData: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model("History", historySchema);