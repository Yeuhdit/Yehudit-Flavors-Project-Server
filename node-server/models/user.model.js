// node-server/models/user.model.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'registered user' },
  address: { type: String }
});

// פונקציית טוקן
export const generateToken = (user) => {
  return jwt.sign(
    { user_id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET || 'JWT_SECRET',
    { expiresIn: '7d' }
  );
};

// ייצוא named – חובה!
export const User = mongoose.model('User', userSchema);