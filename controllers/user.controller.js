import bcrypt from "bcrypt";
import { User, generateToken } from "../models/user.model.js";

// ======================
// REGISTER / SIGN UP
// ======================
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, address } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "חובה למלא שם משתמש, אימייל וסיסמה" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "האימייל כבר קיים במערכת" });
    }

    const user = new User({
      username,
      email: email.toLowerCase(),
      password: password, 
      address: address || ""
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "נרשמת בהצלחה",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (err) {
    console.error("Signup error:", err);
    next(err);
  }
};

// ======================
// LOGIN / SIGN IN
// ======================
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: "אימייל או סיסמה שגויים" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "אימייל או סיסמה שגויים" });
    }

    const token = generateToken(user);

    // השרת שולח לריאקט את ה-role מהמונגו כדי שידע שאת מנהלת!
    res.json({
      success: true,
      message: "התחברת בהצלחה",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role 
      },
      token
    });

  } catch (err) {
    console.error("Signin error:", err);
    next(err);
  }
};

// ======================
// GET ALL USERS
// ======================
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ _id: -1 });

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("Get users error:", err);
    next(err);
  }
};