// node-server/controllers/categories.controller.js
import mongoose from 'mongoose';
import { Categories } from '../models/categories.model.js';
import Joi from 'joi';

const categoryIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const categorySchema = Joi.object({
  description: Joi.string().min(1).required(),
});

// כל משתמש יכול לראות קטגוריות
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find().select('-__v');
    return res.send(categories);
  } catch (error) {
    next({ message: error.message });
  }
};

// כל משתמש יכול לראות קטגוריות עם מתכונים
export const getAllCategoriesAndRecipe = async (req, res, next) => {
  try {
    const categoriesAndRecipe = await Categories.find()
      .populate('recipes')
      .select('-__v');
    return res.send(categoriesAndRecipe);
  } catch (error) {
    next({ message: error.message });
  }
};

// כל משתמש יכול לראות קטגוריה בודדת עם מתכוניה
export const getCategoryByIdWithRec = async (req, res, next) => {
  try {
    const { error } = categoryIdSchema.validate(req.params);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { id } = req.params;
    const recipesByCategory = await Categories.findById(id)
      .populate('recipes')
      .select('-__v');
    
    if (!recipesByCategory) return res.status(404).send({ message: 'Category not found' });

    return res.send(recipesByCategory);
  } catch (error) {
    next({ message: error.message });
  }
};

// רק admin יכול להוסיף קטגוריה
export const addCategory = async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const newCategory = new Categories(value);
    await newCategory.save();
    return res.status(201).send(newCategory);
  } catch (error) {
    next({ message: error.message });
  }
};

// רק admin יכול לעדכן קטגוריה
export const updateCategory = async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { id } = req.params;
    const updatedCategory = await Categories.findByIdAndUpdate(id, value, { new: true }).select('-__v');
    
    if (!updatedCategory) return res.status(404).send({ message: 'Category not found' });

    return res.send(updatedCategory);
  } catch (error) {
    next({ message: error.message });
  }
};

// רק admin יכול למחוק קטגוריה
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Categories.findByIdAndDelete(id);
    
    if (!deletedCategory) return res.status(404).send({ message: 'Category not found' });

    return res.send({ message: 'Category deleted successfully', category: deletedCategory });
  } catch (error) {
    next({ message: error.message });
  }
};