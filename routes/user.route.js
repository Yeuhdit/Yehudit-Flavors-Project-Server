// node-server/routes/user.route.js
import express from 'express';
import { signIn, signUp, getAllUsers } from '../controllers/user.controller.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// הרשמה
router.post('/signup', signUp);

// התחברות
router.post('/signin', signIn);

// כל המשתמשים - 🔥 התיקון בוצע: עכשיו הנתיב מוגן עם adminAuth!
router.get('/getAllUser', adminAuth, getAllUsers);

export default router;