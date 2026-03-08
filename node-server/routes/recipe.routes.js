// File: node-server/routes/recipe.routes.js
import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';
import { userAuth, getAuth } from '../middlewares/userAuth.js';

const router = express.Router();

// שליפת כל המתכונים - משתמשים ב-getAuth כדי לזהות אם המשתמש מחובר (עבור מתכונים פרטיים)
router.get('/', getAuth, recipeController.getAllRecipes);

// שליפת מתכון ספציפי לפי ID
router.get('/:id', recipeController.getRecipeByCode);

// שליפת מתכונים של משתמש ספציפי
router.get('/user/:userId', recipeController.getRecipesByUser);

// הוספת מתכון חדש (כולל העלאת תמונה בתוך הקונטרולר)
router.post('/', userAuth, recipeController.addRecipe);

// עדכון מתכון קיים
router.put('/:id', userAuth, recipeController.updateRecipes);

// מחיקת מתכון
router.delete('/:id', userAuth, recipeController.deleteRecipe);

export default router;