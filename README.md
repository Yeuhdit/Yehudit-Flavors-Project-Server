# ⚙️ יהודית בטעמים - Backend Server (Node.js & Express)

זהו צד השרת של פרויקט "יהודית בטעמים". השרת מנהל את כל הלוגיקה העסקית, החיבור למסד הנתונים, ההרשאות וניהול הקבצים של האפליקציה.

> [!NOTE]
> יש להגדיר קובץ `.env` עם המשתנים הבאים:
> `PORT=5005` (או כל פורט אחר)
> `DB_URL=mongodb://localhost:27017/recipesDB`
> `JWT_SECRET=your_secret_key`

## 👥 Users API

| Method | URL | Description | Permissions | Returns | Status |
| --- | --- | --- | --- | --- | --- |
| **POST** | `/api/users/signup` | יצירת חשבון משתמש חדש | All | User object + Token | 201 |
| **POST** | `/api/users/signin` | התחברות למערכת | All | User object + Token | 200 |
| **GET** | `/api/users/getAllUser` | קבלת רשימת כל המשתמשים | Logged in user | Array of users | 200 |

## 🍝 Recipes API

| Method | URL | Description | Permissions | Parameters | Returns | Status |
| --- | --- | --- | --- | --- | --- | --- |
| **GET** | `/api/recipes/getallrecipes` | קבלת כל המתכונים | All | - | Array of recipes | 200 |
| **GET** | `/api/recipes/getRecipeByCode/:id` | קבלת מתכון ספציפי לפי מזהה | All | `id` (params) | Recipe object | 200 |
| **GET** | `/api/recipes/getRecipesByUser/:userId` | קבלת מתכונים של משתמש | Logged in user | `userId` (params) | Array of recipes | 200 |
| **POST** | `/api/recipes/` | הוספת מתכון חדש | Logged in user | Form-Data (includes image) | New recipe | 201 |
| **PUT** | `/api/recipes/:id` | עדכון מתכון קיים | Owner / Admin | `id` (params), Form-Data | Updated recipe | 200 |
| **DELETE** | `/api/recipes/:id` | מחיקת מתכון קיים | Owner / Admin | `id` (params) | - | 204 |

## 🏷️ Categories API

| Method | URL | Description | Permissions | Parameters | Returns | Status |
| --- | --- | --- | --- | --- | --- | --- |
| **GET** | `/api/categories/getallcategories` | קבלת כל הקטגוריות | All | - | Array of categories | 200 |
| **GET** | `/api/categories/getAllCategoriesAndRecipe`| קבלת קטגוריות כולל המתכונים | All | - | Array with populated recipes | 200 |
| **GET** | `/api/categories/getCategoryByIdWithRec/:id`| קבלת קטגוריה ספציפית עם מתכונים| All | `id` (params) | Category object | 200 |
| **POST** | `/api/categories/` | יצירת קטגוריה חדשה | Admin | Body: `{description}` | New category | 201 |
| **PUT** | `/api/categories/:id` | עדכון שם הקטגוריה | Admin | `id` (params), Body | Updated category | 200 |
| **DELETE** | `/api/categories/:id` | מחיקת קטגוריה מהמערכת | Admin | `id` (params) | Success message | 200 |

## 📊 Levels API

| Method | URL | Description | Permissions | Parameters | Returns | Status |
| --- | --- | --- | --- | --- | --- | --- |
| **GET** | `/api/levels/` | קבלת כל רמות הקושי | All | - | Array of levels | 200 |
| **GET** | `/api/levels/:id` | קבלת רמה ספציפית | All | `id` (params) | Level object | 200 |
| **POST** | `/api/levels/` | יצירת רמה חדשה | Admin | Body: `{description}` | New level | 201 |
| **PUT** | `/api/levels/:id` | עדכון שם הרמה | Admin | `id` (params), Body | Updated level | 200 |
| **DELETE** | `/api/levels/:id` | מחיקת רמת קושי | Admin | `id` (params) | Success message | 200 |

## 🛡️ אבטחה (Middlewares)
* **`userAuth`**: מוודא שהמשתמש מחובר ושולח טוקן תקין (נדרש להוספת מתכון).
* **`adminAuth`**: מוודא שהמשתמש מחובר ושהוא בעל הרשאת מנהל (נדרש לפעולות בקטגוריות ורמות).
* **`loggerCreator`**: מתעד (log) כל בקשה לשרת, מסייע למעקב אחרי תעבורת הנתונים.