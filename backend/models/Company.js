import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: String,
  address: String,
  contactEmail: String,
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
}, { timestamps: true });

export default mongoose.model("Company", CompanySchema);
