// node-server/middlewares/userAuth.js
import jwt from 'jsonwebtoken';

// אימות חובה – משתמש מחובר
export const userAuth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return next({ message: 'Authorization header missing', status: 401 });

    const [, token] = authorization.split(' ');
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const data = jwt.verify(token, privateKey);
    req.user = data;

    if (!['user', 'registered user'].includes(req.user.role)) {
      return next({ message: 'no permission to invoke this function', status: 403 });
    }

    next();
  } catch (error) {
    next({ message: error.message || 'Unauthorized', status: 401 });
  }
};

// אימות אופציונלי – ממשיך גם בלי טוקן
export const getAuth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return next();

    const [, token] = authorization.split(' ');
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const data = jwt.verify(token, privateKey);
    req.user = data;

    if (!['user', 'registered user'].includes(req.user.role)) {
      return next({ message: 'no permission to invoke this function', status: 403 });
    }

    next();
  } catch (error) {
    next(); // ממשיך גם אם הטוקן לא תקין
  }
};