// node-server/models/categories.model.js
import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema({
  description: { type: String, required: true, unique: true },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipes' }]
});

export const Categories = mongoose.model('Categories', categoriesSchema);