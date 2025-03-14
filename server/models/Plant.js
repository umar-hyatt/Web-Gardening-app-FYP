import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String,
    enum: ['Vegetables', 'Fruits', 'Flowers'],
    required: true
  },
  image: { type: String, required: true },
  characteristics: { type: String, required: true },
  careRequirements: { type: String, required: true },
  growthStage: {
    type: String,
    enum: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Mature'],
    required: true
  },
  age: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Plant', plantSchema);