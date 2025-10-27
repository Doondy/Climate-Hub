import mongoose from "mongoose";

const EmployeeReportSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    attendanceStatus: { type: String, enum: ["Present", "Absent", "Leave"], required: true },
    tasksCompleted: { type: Number, default: 0 },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeReport", EmployeeReportSchema);
