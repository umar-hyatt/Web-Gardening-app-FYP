import express from 'express';
import Observation from '../models/Observation.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all observations for user
router.get('/', auth, async (req, res) => {
  try {
    const observations = await Observation.find({ userId: req.user.id });
    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new observation
router.post('/', auth, async (req, res) => {
  try {
    const observation = new Observation({
      ...req.body,
      userId: req.user.id
    });
    const newObservation = await observation.save();
    res.status(201).json(newObservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update observation
router.put('/:id', auth, async (req, res) => {
  try {
    const observation = await Observation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    
    if (!observation) {
      return res.status(404).json({ message: 'Observation not found' });
    }
    
    res.json(observation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete observation
router.delete('/:id', auth, async (req, res) => {
  try {
    const observation = await Observation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!observation) {
      return res.status(404).json({ message: 'Observation not found' });
    }
    
    res.json({ message: 'Observation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;