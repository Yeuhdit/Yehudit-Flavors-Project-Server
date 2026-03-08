// node-server/controllers/user.controller.js

import bcrypt from 'bcrypt';
import Joi from 'joi';
import { User, generateToken } from '../models/user.model.js';

// ======================
// Joi Validation Schemas
// ======================
const userValidator = {
  signUpSchema: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_.-]+$/)
      .required()
      .messages({
        'string.min': 'שם המשתמש חייב להכיל לפחות 3 תווים',
        'string.max': 'שם המשתמש יכול להכיל עד 30 תווים',
        'string.pattern.base': 'שם המשתמש יכול להכיל רק אותיות, מספרים, _, . ו-',
        'any.required': 'שם משתמש הוא שדה חובה',
      }),

    email: Joi.string()
      .email({ minDomainSegments: 2 }) // ניתן להסיר את tlds
      .required()
      .messages({
        'string.email': 'כתובת האימייל אינה תקינה',
        'any.required': 'אימייל הוא שדה חובה',
      }),

    password: Joi.string()
      .min(6)
      .max(12)
      .pattern(/[A-Z]/, { name: 'uppercase' })
      .pattern(/[a-z]/, { name: 'lowercase' })
      .pattern(/[0-9]/, { name: 'digit' })
      .pattern(/[^A-Za-z0-9]/, { name: 'special' })
      .required()
      .messages({
        'string.min': 'הסיסמה חייבת להכיל לפחות 6 תווים',
        'string.max': 'הסיסמה יכולה להכיל עד 12 תווים',
        'string.pattern.name': 'הסיסמה חייבת לכלול {#name}',
        'any.required': 'סיסמה היא שדה חובה',
      }),

    address: Joi.string()
      .max(100)
      .allow('')
      .optional(),
  }),

  signInSchema: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'כתובת האימייל אינה תקינה',
      'any.required': 'אימייל הוא שדה חובה',
    }),
    password: Joi.string().required().messages({
      'any.required': 'סיסמה היא שדה חובה',
    }),
  }),
};

// ======================
// REGISTER / SIGN UP
// ======================
export const signUp = async (req, res, next) => {
  try {
    // 1. ולידציה
    const { error, value } = userValidator.signUpSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'נתונים לא תקינים',
        errors,
      });
    }

    const { username, email, password, address } = value;

    // 2. בדיקת קיום משתמש
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'כתובת אימייל זו כבר רשומה במערכת',
        field: 'email',
      });
    }

    // 3. הצפנת סיסמה
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. יצירת משתמש חדש
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      address: address || '',
      role: 'registered user', // או מה שמתאים לך
    });

    await user.save();

    // 5. יצירת טוקן
    const token = generateToken(user);

    // 6. תגובה מוצלחת
    return res.status(201).json({
      success: true,
      message: 'נרשמת בהצלחה!',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error('שגיאה בהרשמה:', err);
    return next({ message: 'שגיאת שרת פנימית', status: 500 });
  }
};

// ======================
// LOGIN / SIGN IN
// ======================
export const signIn = async (req, res, next) => {
  try {
    // 1. ולידציה בסיסית
    const { error, value } = userValidator.signInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        field: error.details[0].context.key,
      });
    }

    const { email, password } = value;

    // 2. חיפוש המשתמש
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'אימייל או סיסמה שגויים',
        field: 'email',
      });
    }

    // 3. בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'אימייל או סיסמה שגויים',
        field: 'password',
      });
    }

    // 4. יצירת טוקן 
    const token = generateToken(user);

    // 5. תגובה מוצלחת
    return res.json({
      success: true,
      message: 'התחברת בהצלחה!',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error('שגיאה בהתחברות:', err);
    return next({ message: 'שגיאת שרת פנימית', status: 500 });
  }
};

// ======================
// GET ALL USERS (אופציונלי - רק למנהלים)
// ======================
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error('שגיאה בקבלת משתמשים:', err);
    return next({ message: 'שגיאת שרת פנימית', status: 500 });
  }
};