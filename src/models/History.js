import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String, required: true },
  weatherData: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

export default History;