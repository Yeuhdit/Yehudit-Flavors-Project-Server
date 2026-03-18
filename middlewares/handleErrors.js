// node-server/middlewares/handleErrors.js

// Middleware לטיפול בעמודים שלא קיימים
export const pageNotFound = (req, res, next) => {
    const error = new Error('page is not found');
    error.status = 404;
    next(error); // ✅ זה נכון - שולח את השגיאה להמשך השרשרת
};

// Middleware לטיפול בשגיאות (חייב להיות עם 4 פרמטרים!)
export const serverErrors = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    
    console.error(`❌ Error [${status}]:`, message); // ✅ הדפסה לדיאגנוסטיקה
    
    res.status(status).json({
        error: {
            message: message,
            status: status
        },
    });
};