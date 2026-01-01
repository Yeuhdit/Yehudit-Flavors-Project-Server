// node-server/controllers/categories.controller.js
import mongoose from 'mongoose';
import { Categories } from '../models/categories.model.js';
import Joi from 'joi';

const categoryIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find().select('-__v');
    return res.send(categories);
  } catch (error) {
    next({ message: error.message });
  }
};

export const getAllCategoriesAndRecipe = async (req, res, next) => {
  try {
    const categoriesAndRecipe = await Categories.find()
      .populate('recipes')  // תוקן – עובד מושלם!
      .select('-__v');
    return res.send(categoriesAndRecipe);
  } catch (error) {
    next({ message: error.message });
  }
};

export const getCategoryByIdWithRec = async (req, res, next) => {
  try {
    const { error } = categoryIdSchema.validate(req.params);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { id } = req.params;
    const recipesByCategory = await Categories.findById(id)
      .populate('recipes')  // תוקן – עם מתכונים מלאים
      .select('-__v');
    
    if (!recipesByCategory) return res.status(404).send({ message: 'Category not found' });

    return res.send(recipesByCategory);
  } catch (error) {
    next({ message: error.message });
  }
};