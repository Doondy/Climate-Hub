import mongoose from 'mongoose';

const phoneSubscriptionSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  alertTypes: [{ type: String }], // Array of alert types user wants to receive
  regions: [{ type: String }], // Regions user is interested in
  isActive: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const PhoneSubscription = mongoose.model('PhoneSubscription', phoneSubscriptionSchema);

export default PhoneSubscription;


