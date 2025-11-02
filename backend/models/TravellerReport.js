import mongoose from "mongoose";

const TravellerReportSchema = new mongoose.Schema(
  {
    travellerName: String,
    city: String,
    weatherCondition: String,
    experience: String,
    date: String,
  },
  { timestamps: true }
);

export default mongoose.model("TravellerReport", TravellerReportSchema);