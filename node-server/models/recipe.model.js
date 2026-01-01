// node-server/models/recipe.model.js
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  preparationTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  imagUrl: { type: String },
  isPrivate: { type: Boolean, default: false },
  user: {
    name: { type: String },
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  categories: [{ type: String }]  // ← חובה להוסיף את זה!
});

export const Recipes = mongoose.model('Recipes', recipeSchema);