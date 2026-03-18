// node-server/routes/recipe.route.js
import express from 'express';
import {
    getAllRecipes,
    getRecipeByCode,
    getRecipesByUser,
    addRecipe,
    updateRecipes,
    deleteRecipe
} from '../controllers/recipe.controller.js';
import { userAuth } from '../middlewares/userAuth.js';

const router = express.Router();

router.get('/getallrecipes', getAllRecipes); 
router.get('/getRecipeByCode/:id', getRecipeByCode);
router.get('/getRecipesByUser/:userId', getRecipesByUser);

router.post('/', userAuth, addRecipe); 
router.put('/:id', userAuth, updateRecipes);
router.delete('/:id', userAuth, deleteRecipe);

export default router;