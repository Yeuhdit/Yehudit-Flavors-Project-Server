// node-server/routes/level.route.js
import express from 'express';
import {
  getAllLevels,
  getLevelById,
  addLevel,
  updateLevel,
  deleteLevel
} from '../controllers/level.controller.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// כל משתמש יכול לראות
router.get('/', getAllLevels);
router.get('/:id', getLevelById);

// רק admin יכול להוסיף, לעדכן, ולמחוק
router.post('/', adminAuth, addLevel);
router.put('/:id', adminAuth, updateLevel);
router.delete('/:id', adminAuth, deleteLevel);

export default router;
