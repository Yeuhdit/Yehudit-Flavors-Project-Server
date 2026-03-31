// node-server/models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם הוא שדה חובה'],
    trim: true,
    minlength: [2, 'שם חייב להיות לפחות 2 תווים'],
    maxlength: [50, 'שם לא יכול להיות יותר מ-50 תווים']
  },
  email: {
    type: String,
    required: [true, 'דוא״ל הוא שדה חובה'],
    trim: true,
    lowercase: true,
    // ✅ email regex בטוח יותר
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'אנא הכנס דוא״ל תקין'
    ]
  },
  subject: {
    type: String,
    required: [true, 'נושא הוא שדה חובה'],
    trim: true,
    minlength: [3, 'נושא חייב להיות לפחות 3 תווים'],
    maxlength: [100, 'נושא לא יכול להיות יותר מ-100 תווים']
  },
  message: {
    type: String,
    required: [true, 'הודעה היא שדה חובה'],
    trim: true,
    minlength: [10, 'הודעה חייבת להיות לפחות 10 תווים'],
    maxlength: [5000, 'הודעה לא יכולה להיות יותר מ-5000 תווים']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // ✅ לעזרה בחיפוס
  }
});

// ✅ Index לאופטימיזציה
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;