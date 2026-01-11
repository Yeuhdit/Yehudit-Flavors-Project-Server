import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  description: { type: String, required: true, unique: true, trim: true },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipes'
  }]
}, { timestamps: true });

export const Categories = mongoose.model('Categories', categorySchema);