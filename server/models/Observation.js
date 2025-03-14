import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema({
  plantName: { type: String, required: true },
  height: String,
  health: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  notes: String,
  nextAction: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Observation', observationSchema);