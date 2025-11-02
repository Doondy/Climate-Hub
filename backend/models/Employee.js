import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "employee" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }
}, { timestamps: true });

export default mongoose.model("Employee", EmployeeSchema);