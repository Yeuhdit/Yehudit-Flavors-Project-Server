// node-server/routes/categories.route.js
import express from 'express';
import {
  getAllCategories,
  getAllCategoriesAndRecipe,
  getCategoryByIdWithRec,
  addCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// כל משתמש יכול לראות
router.get('/getallcategories', getAllCategories);
router.get('/getAllCategoriesAndRecipe', getAllCategoriesAndRecipe);
router.get('/getCategoryByIdWithRec/:id', getCategoryByIdWithRec);

// רק admin יכול להוסיף, לעדכן, ולמחוק
router.post('/', adminAuth, addCategory);
router.put('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

export default router;
