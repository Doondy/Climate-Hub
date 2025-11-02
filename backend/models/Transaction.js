import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    cityName: String,
    date: String,
    action: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);