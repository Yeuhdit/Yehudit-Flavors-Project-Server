import { Recipes } from "../models/recipe.model.js";
import { Categories } from "../models/categories.model.js";
import { Level } from "../models/level.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Joi from "joi";

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './images'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Images only!'));
  }
}).single('image');

// --- JOI schemas ---
const recipeSchema = Joi.object({
  name: Joi.string().min(1).required(),
  preparationTime: Joi.number().required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  categories: Joi.array().items(Joi.string()).optional(),
  levels: Joi.array().items(Joi.string()).optional(),
  isPrivate: Joi.boolean().optional()
});

// --- Controllers ---
export const getAllRecipes = async (req, res, next) => {
  let { search = '', page = 1, perPage = 10 } = req.query;
  try {
    const query = [
      { name: new RegExp(search, 'i'), isPrivate: false }
    ];
    if (req.user) {
      query.push({ 'user._id': req.user.user_id, isPrivate: true });
    }

    const recipes = await Recipes.find({ $or: query })
      .populate('categories')
      .populate('levels')
      .select('-__v')
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

export const getRecipeByCode = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const recipe = await Recipes.findById(id).populate('categories').populate('levels').select('-__v');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

export const getRecipesByUser = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const recipes = await Recipes.find({ 'user._id': id })
      .populate('categories')
      .populate('levels')
      .select('-__v');
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

// --- Add Recipe ---
export const addRecipe = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const { error, value } = recipeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only registered users can add recipes' });
      }

      const user = await User.findById(req.user.user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const recipe = new Recipes({
        ...value,
        user: { name: user.username, _id: user._id },
        imagUrl: req.file ? `/images/${req.file.filename}` : undefined
      });

      await recipe.save();

      // עדכון קטגוריות ורמות
      if (value.categories && value.categories.length > 0) {
        recipe.categories = value.categories;
      }

      if (value.levels && value.levels.length > 0) {
        recipe.levels = value.levels;
      }

      await recipe.save();

      res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  });
};

// --- Update Recipe ---
export const updateRecipes = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const { error, value } = recipeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

    try {
      if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only registered users can update recipes' });
      }

      const prevRecipe = await Recipes.findById(id);
      if (!prevRecipe) return res.status(404).json({ message: 'Recipe not found' });

      // עדכון השדות
      const updateData = { ...value };
      if (req.file) updateData.imagUrl = req.file.filename;
      if (value.categories) updateData.categories = value.categories;
      if (value.levels) updateData.levels = value.levels;

      const updatedRecipe = await Recipes.findByIdAndUpdate(id, updateData, { new: true }).populate('categories').populate('levels');

      res.json(updatedRecipe);
    } catch (err) {
      next(err);
    }
  });
};

// --- Delete Recipe ---
export const deleteRecipe = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only registered users can delete recipes' });
    }

    const recipe = await Recipes.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // הסרת המתכון מכל הקטגוריות
    await Categories.updateMany(
      { recipes: id },
      { $pull: { recipes: id } }
    );

    await Recipes.findByIdAndDelete(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};