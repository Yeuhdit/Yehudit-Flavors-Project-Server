
import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  description: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

export const Level = mongoose.model('Level', levelSchema);

