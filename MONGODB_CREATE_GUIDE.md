# MongoDB C (Create) - הוראות יצירת מסמכים

## 1. INSERT ONE - הוספת מסמך יחיד

### דרך 1: MongoDB Shell (mongosh)
```javascript
db.categories.insertOne({
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "בשרי",
  "description": "מתכונים בשריים",
  "createdAt": new Date(),
  "updatedAt": new Date()
})
```

### דרך 2: MongoDB Compass (UI)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "בשרי",
  "description": "מתכונים בשריים",
  "createdAt": "2024-01-19T10:00:00.000Z",
  "updatedAt": "2024-01-19T10:00:00.000Z"
}
```

---

## 2. INSERT MANY - הוספת מספר מסמכים

### דרך 1: MongoDB Shell
```javascript
db.categories.insertMany([
  {
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "name": "בשרי",
    "description": "מתכונים בשריים",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("507f1f77bcf86cd799439012"),
    "name": "חלבי",
    "description": "מתכונים חלביים",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("507f1f77bcf86cd799439013"),
    "name": "פרווה",
    "description": "מתכונים פרווים",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
])
```

### דרך 2: MongoDB Compass
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "בשרי",
    "description": "מתכונים בשריים",
    "createdAt": "2024-01-19T10:00:00.000Z",
    "updatedAt": "2024-01-19T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "חלבי",
    "description": "מתכונים חלביים",
    "createdAt": "2024-01-19T10:00:00.000Z",
    "updatedAt": "2024-01-19T10:00:00.000Z"
  }
]
```

---

## 3. מבנה ה-ObjectId

### מה זה ObjectId?
```
ObjectId("507f1f77bcf86cd799439011")
        |__________________|________________|
        timestamp(4 bytes) | machine(3 bytes) | pid(2 bytes) | counter(3 bytes)
```

### דוגמאות ObjectId תקינים:
```
507f1f77bcf86cd799439011
507f1f77bcf86cd799439012
507f1f77bcf86cd799439013
64a1b2c3d4e5f6g7h8i9j0k1
```

---

## 4. סוגי ID ב-MongoDB

### Option 1: ObjectId (ברירת מחדל)
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "בשרי"
}
```

### Option 2: String ID
```javascript
{
  "_id": "category_meat",
  "name": "בשרי"
}
```

### Option 3: Number ID
```javascript
{
  "_id": 1,
  "name": "בשרי"
}
```

### Option 4: UUID
```javascript
{
  "_id": UUID("550e8400-e29b-41d4-a716-446655440000"),
  "name": "בשרי"
}
```

---

## 5. צור קטגוריות עם IDs

### קטגוריות - 10 מסמכים
```javascript
db.categories.insertMany([
  { "_id": ObjectId("507f1f77bcf86cd799439011"), "name": "בשרי", "description": "מתכונים בשריים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439012"), "name": "חלבי", "description": "מתכונים חלביים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439013"), "name": "פרווה", "description": "מתכונים פרווים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439014"), "name": "אפייה", "description": "מתכונים של אפייה", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439015"), "name": "עוגות", "description": "עוגות שונות", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439016"), "name": "קינוחים", "description": "קינוחים ממתקים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439017"), "name": "סלטים", "description": "סלטים טריים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439018"), "name": "מרקים", "description": "מרקים חמים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439019"), "name": "עוף", "description": "מתכונים של עוף", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439020"), "name": "דגים", "description": "מתכונים של דגים", "createdAt": new Date(), "updatedAt": new Date() }
])
```

---

## 6. צור רמות עם IDs

### רמות - 5 מסמכים
```javascript
db.levels.insertMany([
  { "_id": ObjectId("507f1f77bcf86cd799439031"), "name": "קל", "description": "מתכונים קלים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439032"), "name": "בינוני", "description": "מתכונים בינוניים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439033"), "name": "קשה", "description": "מתכונים קשים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439034"), "name": "מתחילים", "description": "עבור מתחילים", "createdAt": new Date(), "updatedAt": new Date() },
  { "_id": ObjectId("507f1f77bcf86cd799439035"), "name": "מומחים", "description": "עבור מומחים", "createdAt": new Date(), "updatedAt": new Date() }
])
```

---

## 7. שימוש ב-MongoDB Compass

### צעד אחר צעד:

#### צעד 1: פתח Compass
- התחבר ל-MongoDB
- בחר את ה-Database: `yehudit_flavors`

#### צעד 2: צור Collection לקטגוריות
- לחץ על **Create Collection**
- שם: `categories`

#### צעד 3: הוסף מסמכים
- לחץ על **Insert Document**
- בחר **Insert JSON**
- הדבק את ה-JSON הבא:

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "בשרי",
    "description": "מתכונים בשריים",
    "createdAt": "2024-01-19T10:00:00.000Z",
    "updatedAt": "2024-01-19T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "חלבי",
    "description": "מתכונים חלביים",
    "createdAt": "2024-01-19T10:00:00.000Z",
    "updatedAt": "2024-01-19T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "פרווה",
    "description": "מתכונים פרווים",
    "createdAt": "2024-01-19T10:00:00.000Z",
    "updatedAt": "2024-01-19T10:00:00.000Z"
  }
]
```

#### צעד 4: צור Collection לרמות
- חזור ללחץ **Create Collection**
- שם: `levels`
- הוסף את ה-JSON:

```json
[
  {
    "_id": "507f1f77bcf86cd799439031",
    "name": "קל",
    "description": "מתכונים קלים",
    "createdAt": "2024-01-19T10:00:00.000Z",
    "updatedAt": "2024-01-19T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439032",
    "name": "בינוני",
    "description": "מתכונים בינוניים",
    "createdAt": "2024-01-19T10:00:00.000Z",
    "updatedAt": "2024-01-19T10:00:00.000Z"
  }
]
```

---

## 8. אפשרויות INSERT

### insertOne - תוצאה
```javascript
{ 
  "acknowledged": true,
  "insertedId": ObjectId("507f1f77bcf86cd799439011")
}
```

### insertMany - תוצאה
```javascript
{
  "acknowledged": true,
  "insertedIds": [
    ObjectId("507f1f77bcf86cd799439011"),
    ObjectId("507f1f77bcf86cd799439012"),
    ObjectId("507f1f77bcf86cd799439013")
  ]
}
```

---

## 9. בדיקה שהנתונים הוכנסו

### בדיקה מספר 1
```javascript
db.categories.find()
```

### בדיקה מספר 2 - ספור מסמכים
```javascript
db.categories.countDocuments()
// צריך להדפיס: 10
```

### בדיקה מספר 3 - חפש לפי ID
```javascript
db.categories.findOne({ "_id": ObjectId("507f1f77bcf86cd799439011") })
```

### בדיקה מספר 4 - חפש לפי שם
```javascript
db.categories.findOne({ "name": "בשרי" })
```

---

## 10. טבלת ה-IDs

| סוג | Collection | שם | ID |
|-----|-----------|-----|-----|
| קטגוריה | categories | בשרי | 507f1f77bcf86cd799439011 |
| קטגוריה | categories | חלבי | 507f1f77bcf86cd799439012 |
| קטגוריה | categories | פרווה | 507f1f77bcf86cd799439013 |
| קטגוריה | categories | אפייה | 507f1f77bcf86cd799439014 |
| קטגוריה | categories | עוגות | 507f1f77bcf86cd799439015 |
| קטגוריה | categories | קינוחים | 507f1f77bcf86cd799439016 |
| קטגוריה | categories | סלטים | 507f1f77bcf86cd799439017 |
| קטגוריה | categories | מרקים | 507f1f77bcf86cd799439018 |
| קטגוריה | categories | עוף | 507f1f77bcf86cd799439019 |
| קטגוריה | categories | דגים | 507f1f77bcf86cd799439020 |
| רמה | levels | קל | 507f1f77bcf86cd799439031 |
| רמה | levels | בינוני | 507f1f77bcf86cd799439032 |
| רמה | levels | קשה | 507f1f77bcf86cd799439033 |
| רמה | levels | מתחילים | 507f1f77bcf86cd799439034 |
| רמה | levels | מומחים | 507f1f77bcf86cd799439035 |

---

## 11. דוגמה - ניתן להשתמש בכל סוג ID

### כל אלה תקינים:

```javascript
// ObjectId (מומלץ)
db.categories.insertOne({
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "בשרי"
})

// String
db.categories.insertOne({
  "_id": "meat",
  "name": "בשרי"
})

// Number
db.categories.insertOne({
  "_id": 1,
  "name": "בשרי"
})

// UUID
db.categories.insertOne({
  "_id": UUID("550e8400-e29b-41d4-a716-446655440000"),
  "name": "בשרי"
})
```

---

## 12. שגיאות נפוצות

### שגיאה 1: ID כפול
```
MongoError: E11000 duplicate key error
```
**פתרון**: השתמש ב-ID ייחודי חדש

### שגיאה 2: ObjectId לא תקין
```
MongoError: Invalid ObjectId
```
**פתרון**: ודא שה-ObjectId בן 24 תווים hex

### שגיאה 3: שדה חובה חסר
```
ValidationError: "name" is required
```
**פתרון**: הוסף את שדות החובה לכל מסמך

---

## סיכום

- **_id** = תמיד קיים ב-MongoDB
- **ObjectId** = ברירת מחדל כשלא מציינים ID
- **String ID** = יותר קל לקריאה
- **InsertOne** = להוסיף מסמך אחד
- **InsertMany** = להוסיף מסמכים מרובים
- **createdAt/updatedAt** = טוב ליומן שינויים
