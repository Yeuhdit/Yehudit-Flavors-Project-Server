import { Recipes } from "../models/recipe.model.js";
import { Categories } from "../models/categories.model.js";
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
    const recipe = await Recipes.findById(id).populate('categories').select('-__v');
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
        imagUrl: req.file ? req.file.filename : undefined
      });

      await recipe.save();

      // עדכון קטגוריות
      if (value.categories && value.categories.length > 0) {
        const categoryNames = value.categories;

        // מוסיף את המתכון לקטגוריות קיימות
        await Categories.updateMany(
          { description: { $in: categoryNames } },
          { $addToSet: { recipes: recipe._id } }
        );

        // יוצר קטגוריות חדשות אם אין
        const existing = await Categories.find({ description: { $in: categoryNames } }).select('description');
        const existingNames = existing.map(c => c.description);
        const newNames = categoryNames.filter(name => !existingNames.includes(name));

        if (newNames.length > 0) {
          const newDocs = newNames.map(name => ({
            description: name,
            recipes: [recipe._id]
          }));
          await Categories.insertMany(newDocs);
        }

        // מעדכן את השדה categories במתכון
        recipe.categories = await Categories.find({ description: { $in: categoryNames } }).select('_id');
        await recipe.save();
      }

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

      const updatedRecipe = await Recipes.findByIdAndUpdate(id, updateData, { new: true });

      // עדכון קטגוריות
      const oldCategories = prevRecipe.categories || [];
      const newCategories = value.categories || [];

      // הסרת המתכון מקטגוריות ישנות שלא קיימות עוד
      const toRemove = oldCategories.filter(catId => !newCategories.some(newCat => newCat.equals(catId)));
      if (toRemove.length > 0) {
        await Categories.updateMany(
          { _id: { $in: toRemove } },
          { $pull: { recipes: id } }
        );
      }

      // הוספת לקטגוריות חדשות
      if (newCategories.length > 0) {
        await Categories.updateMany(
          { _id: { $in: newCategories } },
          { $addToSet: { recipes: id } }
        );
      }

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