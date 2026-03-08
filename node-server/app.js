
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";

// --- יבוא נתיבים (Routes) ---
import userRoutes from "./routes/user.route.js";
import recipeRoutes from "./routes/recipe.route.js";
import categoriesRoutes from "./routes/categories.route.js";
import levelRoutes from "./routes/level.route.js";

// --- יבוא מידלוורס (Middlewares) ---
import { pageNotFound, serverErrors } from "./middlewares/handleErrors.js";

// טעינת משתני סביבה מהקובץ .env
dotenv.config();

const app = express();

// --- הגדרות בסיסיות ---
app.use(cors()); // מאפשר תקשורת בין ה-Frontend ל-Backend
app.use(express.json()); // מאפשר לשרת לקרוא גוף בקשה בפורמט JSON

// --- הגדרת תיקיית תמונות כסטטית ---
app.use("/images", express.static(path.join(process.cwd(), "images")));

// --- חיבור לבסיס הנתונים MongoDB ---
connectDB();

// --- הגדרת נתיבי ה-API (Routes) ---
// שימי לב: השתמשתי בקידומת /api כדי לשמור על סדר מקצועי
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/levels", levelRoutes);

// --- דף נחיתה לבדיקה שהשרת עובד ---
app.get("/", (req, res) => {
  res.send("<h1>Server is running successfully! 🚀</h1>");
});

// --- טיפול בשגיאות (חייב להופיע בסוף השרשרת) ---
app.use(pageNotFound);
app.use(serverErrors);

// --- הפעלת השרת ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is flying on port ${PORT}`);
});