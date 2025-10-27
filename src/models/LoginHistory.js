import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  loginStatus: { type: String, enum: ['success', 'failed'], required: true },
  failureReason: { type: String },
  loginTime: { type: Date, default: Date.now }
}, { timestamps: true });

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

export default LoginHistory;


