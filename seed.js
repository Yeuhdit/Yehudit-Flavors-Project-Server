// node-server/seed.js
import mongoose from 'mongoose';
import 'dotenv/config'; 
import { Categories } from './models/categories.model.js';
import { Level } from './models/level.model.js';

// 🔥 התיקון: עכשיו אנחנו שואבים את הקישור מ-DB_URL כדי להתחבר לאותו מקום כמו השרת
const MONGO_URI = process.env.DB_URL || 'mongodb://localhost:27017/recipesDB'; 

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ מחובר למסד הנתונים בהצלחה!');

    await Categories.deleteMany({});
    await Level.deleteMany({});
    console.log('🗑️ קטגוריות ורמות ישנות נוקו מ-recipesDB.');

    // התיקון השני: השארנו רק את שדה description כי זה מה שהמודל שלך מבקש
    const categories = [
      { description: 'מתוקים 🍬' },
      { description: 'קינוחים 🍨' },
      { description: 'מנה אחרונה 🍰' },
      { description: 'עוגות 🎂' },
      { description: 'עוגיות 🍪' },
      { description: 'מרקים 🥣' }
    ];

    const levels = [
      { description: 'קלי קלות 🍓' },
      { description: 'בינוני 🍋' },
      { description: 'אתגר לקונדיטורים 🎂' }
    ];

    await Categories.insertMany(categories);
    await Level.insertMany(levels);

    console.log('🎉 הקטגוריות החדשות הוזרקו למונגו בהצלחה!');
    process.exit(0); 

  } catch (error) {
    console.error('❌ שגיאה בהזרקת הנתונים:', error);
    process.exit(1);
  }
};

seedDB();