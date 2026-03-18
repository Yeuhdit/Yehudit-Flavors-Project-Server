// node-server/models/user.model.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // הוספנו ייבוא של bcrypt

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'registered user' },
  address: { type: String }
});

// הפונקציה שהמורה ביקשה: הצפנת סיסמה לפני שמירה (pre save)
userSchema.pre('save', async function (next) {
  // אם הסיסמה לא שונתה, אין צורך להצפין מחדש
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// פונקציית טוקן
export const generateToken = (user) => {
  return jwt.sign(
    { user_id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET || 'JWT_SECRET',
    { expiresIn: '7d' }
  );
};

export const User = mongoose.model('User', userSchema);