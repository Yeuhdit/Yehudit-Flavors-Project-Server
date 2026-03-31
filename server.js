// // node-server/server.js
// import 'dotenv/config';
// import express from 'express';
// import connectDB from './config/db.js';
// import cors from 'cors';
// import path from 'path'; 
// import { fileURLToPath } from 'url'; 
// import { pageNotFound, serverErrors } from './middlewares/handleErrors.js';
// import morgan from 'morgan'; // שימוש בספריה סטנדרטית ללוגים שקיימת ב-package.json שלך
// import fs from 'fs'; 

// // יבוא נתיבים
// import userRoutes from './routes/user.route.js';
// import recipeRoutes from './routes/recipe.route.js';
// import categoriesRoutes from './routes/categories.route.js';
// import levelRoutes from './routes/level.route.js';
// import contactRoutes from './routes/contact.route.js'; // 🔥 הוספנו את הנתיב של יצירת קשר

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // הגדרות בסיסיות
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(morgan('dev')); // מדפיס כל בקשת HTTP לטרמינל בצבעים (יפה ומקצועי)

// // וידוא קיום תיקיית תמונות
// const imagesDir = path.join(process.cwd(), 'images'); 
// if (!fs.existsSync(imagesDir)) {
//     fs.mkdirSync(imagesDir);
//     console.log('📁 Created "images" directory');
// }

// // הגדרת תיקיית תמונות כסטטית
// app.use('/images', express.static(imagesDir));

// // נתיבי ה-API
// app.use('/api/users', userRoutes);
// app.use('/api/recipes', recipeRoutes);
// app.use('/api/categories', categoriesRoutes);
// app.use('/api/levels', levelRoutes); 
// app.use('/api/contact', contactRoutes); // 🔥 חיברנו את נתיב צור קשר לשרת

// // בדיקת תקינות
// app.get('/api/test', (req, res) => {
//     res.send({ message: "Server is up and running! ✅" });
// });

// // טיפול בשגיאות
// app.use(pageNotFound);
// app.use(serverErrors);

// // חיבור ל-DB והפעלת השרת
// connectDB().then(() => {
//     const PORT = process.env.PORT || 5005;
//     app.listen(PORT, () => {
//         console.log(`🚀 Server flying on http://localhost:${PORT}`);
//         console.log(`📂 Serving images from: ${imagesDir}`);
//     });
// }).catch(err => {
//     console.error("❌ Failed to connect to MongoDB:", err);
// });
// node-server/server.js
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { pageNotFound, serverErrors } from './middlewares/handleErrors.js';
import morgan from 'morgan';
import fs from 'fs'; 

// ========== יבוא נתיבים ==========
import userRoutes from './routes/user.route.js';
import recipeRoutes from './routes/recipe.route.js';
import categoriesRoutes from './routes/categories.route.js';
import levelRoutes from './routes/level.route.js';
import contactRoutes from './routes/contact.route.js';
// ========== הגדרות בסיסיות ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5005;

// ========== Middleware - CORS מפורט יותר ==========
const corsOptions = {
  origin: [
    'http://localhost:5173',   
    'http://localhost:5174',           // ✅ הוסיפו את זה!
    'http://localhost:3000',           // React (dev alternative)
    'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',           // ✅ וזה גם!
    'https://yhudit-backend-project.onrender.com', // Production Backend
    'https://your-frontend-url.vercel.app'  // Frontend Production (עדכן לURL שלך)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========== Logging - Morgan ==========
app.use(morgan('dev'));

// ========== יצירת תיקיית Images אם לא קיימת ==========
const imagesDir = path.join(process.cwd(), 'images'); 
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 Created "images" directory');
}

// ========== הגדרת תיקיית תמונות כסטטית ==========
app.use('/images', express.static(imagesDir));

// ========== Routes - API ==========
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/levels', levelRoutes); 
app.use('/api/contact', contactRoutes);

// ========== Health Check Route ==========
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        message: "Server is up and running! ✅",
        timestamp: new Date().toISOString(),
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});

// ========== Root Route ==========
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Welcome to Judith's Recipes API 🍳",
        version: "1.0.0",
        endpoints: {
            users: "/api/users",
            recipes: "/api/recipes",
            categories: "/api/categories",
            levels: "/api/levels",
            contact: "/api/contact",
            test: "/api/test"
        }
    });
});

// ========== Error Handling Middleware ==========
app.use(pageNotFound);
app.use(serverErrors);

// ========== 404 Handler (אחרון) ==========
app.use((req, res) => {
    res.status(404).json({ 
        message: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});

// ========== Start Server ==========
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('');
        console.log('╔════════════════════════════════════════╗');
        console.log('║   🚀 Server is Flying! 🚀            ║');
        console.log('╠════════════════════════════════════════╣');
        console.log(`║  📡 URL: http://localhost:${PORT}`);
        console.log(`║  📂 Images Dir: ${imagesDir}`);
        console.log(`║  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('║  ✅ MongoDB: Connected                 ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('');
        console.log('📌 Available Routes:');
        console.log('   GET  /api/test - Health Check');
        console.log('   GET  / - Welcome');
        console.log('');
    });
}).catch(err => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
});

// ========== Handle Unhandled Rejections ==========
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('⚠️ Uncaught Exception:', error);
    process.exit(1);
});

export default app;