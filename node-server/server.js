// node-server/server.js
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import { pageNotFound, serverErrors } from './middlewares/handleErrors.js';
import userRoutes from './routes/user.route.js';
import recipeRoutes from './routes/recipe.route.js';
import categoriesRoutes from './routes/categories.route.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/images', express.static('images'));

app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoriesRoutes);

app.use(pageNotFound);
app.use(serverErrors);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` השרת רץ על http://localhost:${PORT}`);
  });
});