// node-server/server.js
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { pageNotFound, serverErrors } from './middlewares/handleErrors.js';
import morgan from 'morgan'; // שימוש בספריה סטנדרטית ללוגים שקיימת ב-package.json שלך
import fs from 'fs'; 

// יבוא נתיבים
import userRoutes from './routes/user.route.js';
import recipeRoutes from './routes/recipe.route.js';
import categoriesRoutes from './routes/categories.route.js';
import levelRoutes from './routes/level.route.js';
import contactRoutes from './routes/contact.route.js'; // 🔥 הוספנו את הנתיב של יצירת קשר
import regulationsRoutes from './routes/regulations.route.js'; // 📋 הוספנו את נתיב התקנון

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// הגדרות בסיסיות
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev')); // מדפיס כל בקשת HTTP לטרמינל בצבעים (יפה ומקצועי)

// וידוא קיום תיקיית תמונות
const imagesDir = path.join(process.cwd(), 'images'); 
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
    console.log('📁 Created "images" directory');
}

// הגדרת תיקיית תמונות כסטטית
app.use('/images', express.static(imagesDir));

// נתיבי ה-API
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/levels', levelRoutes); 
app.use('/api/contact', contactRoutes); // 🔥 חיברנו את נתיב צור קשר לשרת
app.use('/api/regulations', regulationsRoutes); // 📋 חיברנו את נתיב התקנון

// בדיקת תקינות
app.get('/api/test', (req, res) => {
    res.send({ message: "Server is up and running! ✅" });
});

// טיפול בשגיאות
app.use(pageNotFound);
app.use(serverErrors);

// חיבור ל-DB והפעלת השרת
connectDB().then(() => {
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
        console.log(`🚀 Server flying on http://localhost:${PORT}`);
        console.log(`📂 Serving images from: ${imagesDir}`);
    });
}).catch(err => {
    console.error("❌ Failed to connect to MongoDB:", err);
});