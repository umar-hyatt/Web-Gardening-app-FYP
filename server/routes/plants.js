import express from 'express';
import Plant from '../models/Plant.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all plants for user
router.get('/', auth, async (req, res) => {
  try {
    const plants = await Plant.find({ userId: req.user.id });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new plant
router.post('/', auth, async (req, res) => {
  try {
    const plant = new Plant({
      ...req.body,
      userId: req.user.id
    });
    const newPlant = await plant.save();
    res.status(201).json(newPlant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update plant
router.put('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    
    res.json(plant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete plant
router.delete('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;