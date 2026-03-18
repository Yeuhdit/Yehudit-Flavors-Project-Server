//node-server/models/recipe.model.js
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  preparationTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  imageUrl: { type: String }, // 🔥 תוקן ל-imageUrl בצורה תקנית
  isPrivate: { type: Boolean, default: false },
  ingredients: [{ type: String }],
  instructions: [{ type: String }],
  user: {
    name: String,
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories'
  }],
  levels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level'
  }]
}, { timestamps: true });

export const Recipes = mongoose.model('Recipes', recipeSchema);