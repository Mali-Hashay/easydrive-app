import React from 'react';
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>מדיניות פרטיות</h1>
      <p className={styles.introText}>
        חברת EasyDrive (להלן: "החברה") מכבדת את פרטיות המשתמשים במערכת. מסמך זה מפרט את האופן שבו אנו אוספים, שומרים ומשתמשים במידע שלך במסגרת קבלת שירותי השכרת הרכב.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. איסוף מידע</h2>
        <p className={styles.text}>
          בעת השימוש במערכת, רישום לאתר או ביצוע הזמנת רכב, אנו עשויים לאסוף פרטים אישיים. אלו כוללים, בין היתר: שם מלא, דרכי התקשרות (טלפון ודוא"ל), כתובת מגורים, פרטי רישיון נהיגה ונתוני אמצעי תשלום.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. מטרות השימוש במידע</h2>
        <p className={styles.text}>
          המידע שנאסף משמש אך ורק למטרות הבאות:
        </p>
        <ul className={styles.list}>
          <li>ניהול, אישור ותפעול שוטף של הזמנות הרכב.</li>
          <li>יצירת קשר במקרי חירום, שינויים בהזמנה או עדכונים תפעוליים.</li>
          <li>שיפור חוויית המשתמש והשירות באתר.</li>
          <li>עמידה בדרישות החוק ותקנות התעבורה הרלוונטיות.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. אבטחת מידע</h2>
        <p className={styles.text}>
          אנו מיישמים מערכות ונהלים מתקדמים לאבטחת מידע כדי לשמור על הנתונים שלך מוגנים מפני גישה, שימוש או חשיפה בלתי מורשית. פרטי אשראי אינם נשמרים בשרתי החברה אלא מעובדים באמצעות ספק סליקה חיצוני ומאובטח.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. העברת מידע לצד שלישי</h2>
        <p className={styles.text}>
          החברה מתחייבת לא להעביר את פרטיך האישיים לצד שלישי, אלא במקרים בהם הדבר נדרש לצורך השלמת תהליך ההשכרה (כגון חברות ביטוח), או במקרה של דרישה חוקית מצד רשויות האכיפה.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. יצירת קשר</h2>
        <p className={styles.text}>
          בכל שאלה, בקשה לעיון במידע או דרישה למחיקת נתונים, ניתן לפנות לשירות הלקוחות שלנו דרך עמוד "צור קשר" במערכת.
        </p>
      </section>
    </div>
  );
}