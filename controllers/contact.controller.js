// node-server/controllers/contact.controller.js

import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log('========================================');
  console.log('📨 בקשה התקבלה ל-/api/contact');
  console.log('========================================');
  console.log('📝 נתונים שהתקבלו:');
  console.log('   name:', name);
  console.log('   email:', email);
  console.log('   subject:', subject);
  console.log('   message:', message);
  console.log('========================================');

  // ✅ Validation
  if (!name || !email || !subject || !message) {
    console.log('❌ שגיאה: חסרים שדות!');
    console.log('   name:', !!name);
    console.log('   email:', !!email);
    console.log('   subject:', !!subject);
    console.log('   message:', !!message);
    
    return res.status(400).json({ 
      success: false,
      message: 'שם, אימייל, נושא והודעה הם שדות חובה' 
    });
  }

  try {
    console.log('💾 מנסה לשמור בDatabase...');
    
    // ✅ בדיקה: האם Contact model קיים?
    if (!Contact) {
      throw new Error('❌ Contact model is not defined!');
    }

    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim()
    };

    console.log('📋 נתונים לשמירה:', contactData);

    const newContact = new Contact(contactData);
    console.log('✅ יצור document חדש');

    const savedContact = await newContact.save();
    console.log('✅ נשמר בDatabase בהצלחה!');
    console.log('   ID:', savedContact._id);
    console.log('   createdAt:', savedContact.createdAt);

    // ✅ Email (אופציונלי)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log('📧 מנסה לשלוח email...');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `🎉 פנייה חדשה: ${subject}`,
          html: `
            <div style="direction: rtl; font-family: Arial, sans-serif; padding: 20px;">
              <h2>📬 הודעה חדשה מהאתר!</h2>
              <p><strong>שם:</strong> ${name}</p>
              <p><strong>אימייל:</strong> ${email}</p>
              <p><strong>נושא:</strong> ${subject}</p>
              <hr />
              <p><strong>הודעה:</strong></p>
<p>${message.replace(/\n/g, '<br />')}</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email נשלח בהצלחה');
      } catch (emailError) {
        console.warn('⚠️ שגיאה בשליחת email (אבל ההודעה נשמרה):', emailError.message);
      }
    } else {
      console.log('⚠️ Email credentials לא מוגדרים');
    }

    console.log('========================================');
    console.log('✅ הודעה נשמרה בהצלחה!');
    console.log('========================================');

    return res.status(201).json({
      success: true,
      message: 'ההודעה נשמרה בהצלחה! 🎉',
      data: {
        contactId: savedContact._id,
        timestamp: savedContact.createdAt
      }
    });

  } catch (error) {
    console.log('========================================');
    console.error('❌ שגיאה בשמירת ההודעה!');
    console.log('========================================');
    console.error('   שם השגיאה:', error.name);
    console.error('   הודעה:', error.message);
    console.error('   Stack:', error.stack);
    console.log('========================================');

    // ✅ טיפול בשגיאות Mongoose
    if (error.name === 'ValidationError') {
      console.error('❌ ValidationError!');
      const messages = Object.values(error.errors).map(e => {
        console.error(`   - ${e.path}: ${e.message}`);
        return e.message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'שגיאה בנתונים',
        errors: messages
      });
    }

    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
      console.error('❌ בעיה בחיבור ל-MongoDB!');
      return res.status(503).json({
        success: false,
        message: 'בעיה בחיבור לבסיס הנתונים'
      });
    }

    // ✅ שגיאה כללית
    return res.status(500).json({
      success: false,
      message: 'שגיאה בשמירת ההודעה',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
};

// ✅ קבלת כל ההודעות
export const getAllContacts = async (req, res) => {
  try {
    console.log('📥 קבלת כל ההודעות...');
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('❌ שגיאה בקבלת ההודעות:', error.message);
    return res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת ההודעות'
    });
  }
};

// ✅ קבלת הודעה לפי ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'ההודעה לא נמצאה'
      });
    }

    return res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ שגיאה בקבלת ההודעה לפי ID:', error.message);
    return res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת ההודעה'
    });
  }
};