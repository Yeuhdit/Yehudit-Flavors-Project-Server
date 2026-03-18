
// // node-server/controllers/recipe.controller.js

// import { Recipes } from "../models/recipe.model.js";
// import { Categories } from "../models/categories.model.js";
// import { Level } from "../models/level.model.js";
// import { User } from "../models/user.model.js";
// import mongoose from "mongoose";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import Joi from "joi";

// // הגדרות נתיבים
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const imagesDir = path.join(__dirname, '..', 'images');

// // יצירת תיקיית אימג'ס אם לא קיימת
// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir, { recursive: true });
// }

// // הגדרות Multer לשמירת הקובץ
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, imagesDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `recipe-${Date.now()}${ext}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('רק קבצי תמונה מורשים!'));
//     }
//   }
// }).single('image');

// const recipeSchema = Joi.object({
//   name: Joi.string().min(1).required(),
//   preparationTime: Joi.number().required(),
//   difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
//   categories: Joi.array().items(Joi.string()).optional(),
//   levels: Joi.array().items(Joi.string()).optional(),
//   ingredients: Joi.array().items(Joi.string()).min(1).required(),
//   instructions: Joi.array().items(Joi.string()).min(1).required(),
//   isPrivate: Joi.boolean().optional(),
//   image: Joi.any().optional()
// }).unknown(true);

// // --- פונקציות עזר ---

// export const getAllRecipes = async (req, res, next) => {
//   try {
//     const recipes = await Recipes.find({})
//       .populate('categories')
//       .populate('levels')
//       .select('-__v');
//     res.json(recipes);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getRecipeByCode = async (req, res, next) => {
//   const id = req.params.id;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID' });
//   }
//   try {
//     const recipe = await Recipes.findById(id)
//       .populate('categories')
//       .populate('levels')
//       .select('-__v');
//     if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
//     res.json(recipe);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getRecipesByUser = async (req, res, next) => {
//   const id = req.params.userId;
//   try {
//     const recipes = await Recipes.find({ 'user._id': id })
//       .populate('categories')
//       .populate('levels')
//       .select('-__v');
//     res.json(recipes);
//   } catch (err) {
//     next(err);
//   }
// };

// export const addRecipe = async (req, res, next) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(400).json({ message: err.message });

//     if (req.body.isPrivate === 'true') req.body.isPrivate = true;
//     if (req.body.isPrivate === 'false') req.body.isPrivate = false;

//     const jsonFields = ['categories', 'levels', 'ingredients', 'instructions'];
//     jsonFields.forEach(field => {
//       if (req.body[field] && typeof req.body[field] === 'string') {
//         try { req.body[field] = JSON.parse(req.body[field]); } catch(e) {}
//       }
//     });

//     const { error, value } = recipeSchema.validate(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     try {
//       if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
//         return res.status(403).json({ message: 'Only registered users can add recipes' });
//       }

//       const user = await User.findById(req.user.user_id);
//       if (!user) return res.status(404).json({ message: 'User not found' });

//       const recipeData = {
//         ...value,
//         user: { name: user.username, _id: user._id },
//         imageUrl: req.file ? `/images/${req.file.filename}` : undefined
//       };

//       const recipe = new Recipes(recipeData);
//       await recipe.save();
//       res.status(201).json(recipe);
//     } catch (err) {
//       next(err);
//     }
//   });
// };

// export const updateRecipes = async (req, res, next) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(400).json({ message: err.message });

//     if (req.body.isPrivate === 'true') req.body.isPrivate = true;
//     if (req.body.isPrivate === 'false') req.body.isPrivate = false;

//     const jsonFields = ['categories', 'levels', 'ingredients', 'instructions'];
//     jsonFields.forEach(field => {
//       if (req.body[field] && typeof req.body[field] === 'string') {
//         try { req.body[field] = JSON.parse(req.body[field]); } catch(e){}
//       }
//     });

//     const { error, value } = recipeSchema.validate(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     const id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

//     try {
//       if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
//         return res.status(403).json({ message: 'Only registered users can update recipes' });
//       }

//       const recipeToUpdate = await Recipes.findById(id);
//       if (!recipeToUpdate) return res.status(404).json({ message: 'Recipe not found' });

//       // בדיקת הרשאות: מנהל יכול לערוך הכל, משתמש רק את שלו
//       if (req.user.role !== 'admin' && recipeToUpdate.user._id.toString() !== req.user.user_id) {
//         return res.status(403).json({ message: 'אין לך הרשאה לעדכן מתכון זה' });
//       }

//       const updateData = { ...value };
//       if (req.file) {
//         updateData.imageUrl = `/images/${req.file.filename}`;
//       }

//       const updatedRecipe = await Recipes.findByIdAndUpdate(id, updateData, { new: true })
//         .populate('categories')
//         .populate('levels');

//       res.json(updatedRecipe);
//     } catch (err) {
//       next(err);
//     }
//   });
// };

// export const deleteRecipe = async (req, res, next) => {
//   const id = req.params.id;
//   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

//   try {
//     if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
//       return res.status(403).json({ message: 'Only registered users can delete recipes' });
//     }

//     const recipe = await Recipes.findById(id);
//     if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

//     // בדיקת הרשאות: מנהל יכול למחוק הכל, משתמש רק את שלו
//     if (req.user.role !== 'admin' && recipe.user._id.toString() !== req.user.user_id) {
//       return res.status(403).json({ message: 'אין לך הרשאה למחוק מתכון זה' });
//     }

//     await Categories.updateMany({ recipes: id }, { $pull: { recipes: id } });
//     await Recipes.findByIdAndDelete(id);
//     res.status(204).send();
//   } catch (err) {
//     next(err);
//   }
// };
// node-server/controllers/recipe.controller.js

import { Recipes } from "../models/recipe.model.js";
import { Categories } from "../models/categories.model.js";
import { Level } from "../models/level.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Joi from "joi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '..', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `recipe-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('רק קבצי תמונה מורשים!'));
    }
  }
}).single('image');

const recipeSchema = Joi.object({
  name: Joi.string().min(1).required(),
  preparationTime: Joi.number().required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  categories: Joi.array().items(Joi.string()).optional(),
  levels: Joi.array().items(Joi.string()).optional(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  instructions: Joi.array().items(Joi.string()).min(1).required(),
  isPrivate: Joi.boolean().optional(),
  image: Joi.any().optional()
}).unknown(true);

export const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipes.find({})
      .populate('categories')
      .populate('levels')
      .select('-__v');
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

export const getRecipeByCode = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const recipe = await Recipes.findById(id)
      .populate('categories')
      .populate('levels')
      .select('-__v');
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

export const addRecipe = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    if (req.body.isPrivate === 'true') req.body.isPrivate = true;
    if (req.body.isPrivate === 'false') req.body.isPrivate = false;

    const jsonFields = ['categories', 'levels', 'ingredients', 'instructions'];
    jsonFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try { req.body[field] = JSON.parse(req.body[field]); } catch(e) {}
      }
    });

    const { error, value } = recipeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only registered users can add recipes' });
      }

      const user = await User.findById(req.user.user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const recipeData = {
        ...value,
        user: { name: user.username, _id: user._id },
        imageUrl: req.file ? `/images/${req.file.filename}` : undefined
      };

      const recipe = new Recipes(recipeData);
      await recipe.save();
      res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  });
};

export const updateRecipes = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    if (req.body.isPrivate === 'true') req.body.isPrivate = true;
    if (req.body.isPrivate === 'false') req.body.isPrivate = false;

    const jsonFields = ['categories', 'levels', 'ingredients', 'instructions'];
    jsonFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try { req.body[field] = JSON.parse(req.body[field]); } catch(e){}
      }
    });

    const { error, value } = recipeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

    try {
      if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only registered users can update recipes' });
      }

      const recipeToUpdate = await Recipes.findById(id);
      if (!recipeToUpdate) return res.status(404).json({ message: 'Recipe not found' });

      // תיקון קריטי: בדיקה בטוחה שלא תקרוס אם למתכון אין יוצר!
      const isAdmin = req.user.role === 'admin';
      const recipeCreatorId = recipeToUpdate.user && recipeToUpdate.user._id ? recipeToUpdate.user._id.toString() : null;
      const isOwner = recipeCreatorId === req.user.user_id;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ message: 'אין לך הרשאה לעדכן מתכון זה' });
      }

      const updateData = { ...value };
      if (req.file) {
        updateData.imageUrl = `/images/${req.file.filename}`;
      }

      const updatedRecipe = await Recipes.findByIdAndUpdate(id, updateData, { new: true })
        .populate('categories')
        .populate('levels');

      res.json(updatedRecipe);
    } catch (err) {
      next(err);
    }
  });
};

export const deleteRecipe = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    if (!['admin', 'user', 'registered user'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only registered users can delete recipes' });
    }

    const recipe = await Recipes.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // תיקון קריטי: בדיקה בטוחה שלא תקרוס אם למתכון אין יוצר!
    const isAdmin = req.user.role === 'admin';
    const recipeCreatorId = recipe.user && recipe.user._id ? recipe.user._id.toString() : null;
    const isOwner = recipeCreatorId === req.user.user_id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'אין לך הרשאה למחוק מתכון זה' });
    }

    await Categories.updateMany({ recipes: id }, { $pull: { recipes: id } });
    await Recipes.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};