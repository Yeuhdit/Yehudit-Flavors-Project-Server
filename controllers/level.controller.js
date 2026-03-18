// node-server/controllers/level.controller.js
import { Level } from '../models/level.model.js';
import Joi from 'joi';

const levelSchema = Joi.object({
  description: Joi.string().min(1).required(),
});

// כל משתמש יכול לראות רמות
export const getAllLevels = async (req, res, next) => {
  try {
    const levels = await Level.find().select('-__v');
    return res.send(levels);
  } catch (error) {
    next({ message: error.message });
  }
};

// כל משתמש יכול לראות רמה בודדת
export const getLevelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const level = await Level.findById(id).select('-__v');
    
    if (!level) return res.status(404).send({ message: 'Level not found' });

    return res.send(level);
  } catch (error) {
    next({ message: error.message });
  }
};

// רק admin יכול להוסיף רמה
export const addLevel = async (req, res, next) => {
  try {
    const { error, value } = levelSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const newLevel = new Level(value);
    await newLevel.save();
    return res.status(201).send(newLevel);
  } catch (error) {
    next({ message: error.message });
  }
};

// רק admin יכול לעדכן רמה
export const updateLevel = async (req, res, next) => {
  try {
    const { error, value } = levelSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { id } = req.params;
    const updatedLevel = await Level.findByIdAndUpdate(id, value, { new: true }).select('-__v');
    
    if (!updatedLevel) return res.status(404).send({ message: 'Level not found' });

    return res.send(updatedLevel);
  } catch (error) {
    next({ message: error.message });
  }
};

// רק admin יכול למחוק רמה
export const deleteLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLevel = await Level.findByIdAndDelete(id);
    
    if (!deletedLevel) return res.status(404).send({ message: 'Level not found' });

    return res.send({ message: 'Level deleted successfully', level: deletedLevel });
  } catch (error) {
    next({ message: error.message });
  }
};
