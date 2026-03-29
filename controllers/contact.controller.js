// node-server/controllers/contact.controller.js
import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  try {
    // הגדרת חשבון הג'ימייל שממנו יישלח המייל
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // האימייל שלך
        pass: process.env.EMAIL_PASS  // סיסמת האפליקציה שניצור בג'ימייל
      }
    });

    // הגדרת תוכן המייל שתקבלי
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // זה נשלח אליך!
      replyTo: email, // כשתעשי "השב", זה יענה למשתמש שפנה
      subject: `פנייה חדשה מהאתר: ${subject}`,
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ff7e5f;">הודעה חדשה מיהודית בטעמים! 🎉</h2>
          <p><strong>שם השולח:</strong> ${name}</p>
          <p><strong>אימייל לחזרה:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>תוכן ההודעה:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'ההודעה נשלחה בהצלחה!' });

  } catch (error) {
    console.error("Error sending email:", error);
    next({ message: 'שגיאה בשליחת המייל, אנא נסו שוב מאוחר יותר.', status: 500 });
  }
};