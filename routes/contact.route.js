import express from 'express';
import { sendContactEmail, getAllContacts, getContactById } from '../controllers/contact.controller.js';

const router = express.Router();

/**
 * POST /api/contact
 * ✅ שליחת הודעת יצירת קשר
 */
router.post('/', sendContactEmail);

/**
 * GET /api/contact
 * ✅ קבלת כל ההודעות
 */
router.get('/', getAllContacts);

/**
 * GET /api/contact/:id
 * ✅ קבלת הודעה ספציפית
 */
router.get('/:id', getContactById);

export default router;