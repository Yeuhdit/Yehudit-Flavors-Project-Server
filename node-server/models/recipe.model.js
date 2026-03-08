// src/models/recipe.model.js
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  preparationTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  imagUrl: { type: String },
  isPrivate: { type: Boolean, default: false },
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