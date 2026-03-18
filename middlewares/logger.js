// node-server/middlewares/logger.js
// תפקיד: Custom Middleware Creator שמתעד בקשות לשרת לפי רמת פירוט נבחרת

export const loggerCreator = (format = 'short') => {
  // הפונקציה החיצונית (ה-Creator) מקבלת פרמטר ומחזירה את המידלוור עצמו
  return (req, res, next) => {
    const timestamp = new Date().toLocaleString('he-IL');
    const method = req.method;
    const url = req.originalUrl;

    if (format === 'detailed') {
      console.log(`[${timestamp}] 🔍 DETAILED: ${method} Request to ${url} | IP: ${req.ip}`);
    } else {
      console.log(`[${timestamp}] ⚡ SHORT: ${method} ${url}`);
    }

    // חובה לקרוא ל-next() כדי שהבקשה תמשיך הלאה לראוטים ולא תיתקע!
    next(); 
  };
};