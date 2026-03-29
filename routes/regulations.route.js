import express from 'express';

const router = express.Router();

// דף תקנון ועיצוב האתר
router.get('/page', (req, res) => {
    const regulationsPage = {
        title: "יהדות בטעמים - תקנון ועיצוב האתר",
        sections: [
            {
                heading: "🎨 עיצוב האתר",
                content: `
                    אתר "יהדות בטעמים" עוצב בעיצוב מודרני ונוח לשימוש.
                    הצבעים העיקריים משקפים את המסורת היהודית והטעם האוכל.
                    
                    צבעים עיקריים:
                    - כתום חם (#FF6B35) - צבע ראשי
                    - שחור עמוק (#1A1A1A) - רקע וטקסט
                    - לבן (#FFFFFF) - טקסט על רקע כהה
                `
            },
            {
                heading: "📋 תקנון השימוש באתר",
                content: `
                    1. כל המתכונים באתר הם בעיבוד ושימוש חופשי לשימוש אישי.
                    2. אסור להעתיק מתכונים ללא קרדיט לאתר.
                    3. כל משתמש חייב להיות בן 13 ומעלה.
                    4. שמירת פרטיות המשתמשים היא חובה.
                    5. אסור להשתמש באתר לצורכים מסחריים ללא הסכמה.
                `
            },
            {
                heading: "🔒 מדיניות פרטיות",
                content: `
                    פרטי המשתמשים מוגנים בתקן גבוה של אבטחה.
                    אנחנו לא משתפים את הנתונים שלכם עם צדדים שלישיים.
                    כל סיסמה מוצפנת ומאובטחת.
                    לפרטים נוספים, צרו קשר: info@jehudotbetaamim.com
                `
            },
            {
                heading: "📞 יצירת קשר",
                content: `
                    אם יש לכם שאלות או תגובות:
                    Email: info@jehudotbetaamim.com
                    טלפון: 123-456-7890
                    עמוד Facebook: facebook.com/jehudotbetaamim
                `
            }
        ],
        footerText: "© 2026 יהדות בטעמים. כל הזכויות שמורות.",
        design: {
            fontFamily: "Arial, Helvetica, sans-serif",
            primaryColor: "#FF6B35",
            backgroundColor: "#1A1A1A",
            textColor: "#FFFFFF",
            accentColor: "#FFB347"
        }
    };

    res.status(200).json(regulationsPage);
});

// דף תקנון בטקסט HTML
router.get('/html', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>יהדות בטעמים - תקנון ועיצוב</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                background-color: #1A1A1A;
                color: #FFFFFF;
                line-height: 1.6;
            }
            header {
                background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
                padding: 40px 20px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            header p {
                font-size: 1.1em;
                opacity: 0.9;
            }
            main {
                max-width: 900px;
                margin: 40px auto;
                padding: 0 20px;
            }
            section {
                background-color: #2A2A2A;
                margin-bottom: 30px;
                padding: 25px;
                border-right: 4px solid #FF6B35;
                border-radius: 5px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            }
            section h2 {
                color: #FF6B35;
                margin-bottom: 15px;
                font-size: 1.8em;
            }
            section p {
                white-space: pre-wrap;
                font-size: 1em;
                opacity: 0.95;
            }
            footer {
                background-color: #0D0D0D;
                text-align: center;
                padding: 20px;
                margin-top: 50px;
                border-top: 2px solid #FF6B35;
            }
            footer p {
                opacity: 0.7;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>🍳 יהדות בטעמים</h1>
            <p>תקנון ועיצוב האתר</p>
        </header>
        
        <main>
            <section>
                <h2>🎨 עיצוב האתר</h2>
                <p>אתר "יהדות בטעמים" עוצב בעיצוב מודרני ונוח לשימוש.
                הצבעים העיקריים משקפים את המסורת היהודית והטעם האוכל.

                צבעים עיקריים:
                - כתום חם (#FF6B35) - צבע ראשי
                - שחור עמוק (#1A1A1A) - רקע וטקסט
                - לבן (#FFFFFF) - טקסט על רקע כהה</p>
            </section>

            <section>
                <h2>📋 תקנון השימוש באתר</h2>
                <p>1. כל המתכונים באתר הם בעיבוד ושימוש חופשי לשימוש אישי.
                2. אסור להעתיק מתכונים ללא קרדיט לאתר.
                3. כל משתמש חייב להיות בן 13 ומעלה.
                4. שמירת פרטיות המשתמשים היא חובה.
                5. אסור להשתמש באתר לצורכים מסחריים ללא הסכמה.</p>
            </section>

            <section>
                <h2>🔒 מדיניות פרטיות</h2>
                <p>פרטי המשתמשים מוגנים בתקן גבוה של אבטחה.
                אנחנו לא משתפים את הנתונים שלכם עם צדדים שלישיים.
                כל סיסמה מוצפנת ומאובטחת.
                לפרטים נוספים, צרו קשר: info@jehudotbetaamim.com</p>
            </section>

            <section>
                <h2>📞 יצירת קשר</h2>
                <p>אם יש לכם שאלות או תגובות:
                Email: info@jehudotbetaamim.com
                טלפון: 123-456-7890
                עמוד Facebook: facebook.com/jehudotbetaamim</p>
            </section>
        </main>

        <footer>
            <p>© 2026 יהדות בטעמים. כל הזכויות שמורות.</p>
        </footer>
    </body>
    </html>
    `;
    
    res.send(htmlContent);
});

export default router;
