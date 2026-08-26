import React from 'react';
import styles from './TermsOfUse.module.css';
import dayjs from 'dayjs';


export default function TermsOfUsePage() {
    const lastUpdated = dayjs().format('DD/MM/YYYY');

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>תנאי שימוש ותקנון המערכת</h1>
                    <p className={styles.subtitle}>עודכן לאחרונה: {lastUpdated}</p>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. כללי</h2>
                        <p>
                            ברוכים הבאים למערכת השכרת הרכבים. הגישה והשימוש באתר ובשירותים המוצעים בו כפופים לתנאי השימוש המפורטים להלן. 
                            עצם השימוש במערכת או ביצוע הזמנה מהווים הסכמה מלאה ומפורשת לתנאים אלו.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. תנאי כשירות ודרישות נהג</h2>
                        <ul>
                            <li><strong>רישיון נהיגה:</strong> המזמין מתחייב להציג רישיון נהיגה בתוקף עם ותק של שישה  חודשים לפחות.</li>
                            <li><strong>כרטיס אשראי:</strong> נדרשת הצגת כרטיס אשראי בתוקף על שם השוכר הראשי לצרכי פיקדון וביטחון.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. ביצוע הזמנות ותשלומים</h2>
                        <p>
                            כל ההזמנות במערכת כפופות לאישור זמינות הרכב. המחירים המוצגים כוללים מע"מ וכיסוי ביטוחי בסיסי, אלא אם צוין אחרת. 
                            החיוב מבוצע במועד אישור ההזמנה או במועד איסוף הרכב, בהתאם לתנאי הדיל שנבחר.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. מדיניות ביטולים ושינויים</h2>
                        <p>
                            ביטול הזמנה עד 24 שעות לפני מועד האיסוף יתאפשר ללא דמי ביטול. ביטול בפרק זמן קצר מ-24 שעות עשוי להיות כרוך בדמי ביטול 
                            בהתאם להוראות חוק הגנת הצרכן, תשמ"א-1981.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>5. שימוש ברכב ואחריות השוכר</h2>
                        <ul>
                            <li>השוכר מתחייב לשמור על תקינות הרכב ולא להשתמש בו לצרכים לא חוקיים, מרוצים, לימוד נהיגה, או הסעת נוסעים בשכר.</li>
                            <li><strong>מדיניות דלק:</strong> החזרת הרכב תתבצע עם כמות דלק זהה לרמה שבה התקבל (Full to Full), אלא אם נרכש שירות תדלוק מראש.</li>
                            <li>איסור מוחלט על מעבר גבולות המדינה עם הרכב המושכר.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. הגבלת אחריות</h2>
                        <p>
                            מפעיל המערכת עושה כמיטב יכולתו להבטיח זמינות ותקינות רציפה של המערכת, אך אינו מתחייב שהשירות פועל ללא הפסקות או שגיאות טכניות. 
                            השירות מסופק כפי שהוא (As-Is).
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. סמכות שיפוט</h2>
                        <p>
                            על תנאי שימוש אלו יחולו אך ורק דיני מדינת ישראל. כל מחלוקת הנוגעת לשימוש במערכת תובא לדיון בבתי המשפט המוסמכים בלבד.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}