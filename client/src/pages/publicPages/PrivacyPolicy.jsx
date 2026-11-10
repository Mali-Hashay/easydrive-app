import React from 'react';
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>מדיניות פרטיות</h1>
      <p className={styles.introText}>
        האתר פותח כפרויקט תיק עבודות ואינו מייצג חברה פעילה. אין להזין בו פרטים אישיים אמיתיים, למעט כתובת דוא"ל לקבלת הודעות מהמערכת.
      </p>

      <p className={styles.text}>
        המידע שמוזן באתר (פרטי חשבון, פרטי נהג והזמנות) משמש רק להדגמת פעולת המערכת, ואינו נמכר או מועבר לגורמים אחרים, למעט ספקי האירוח והדוא"ל הנדרשים להפעלת האתר. סיסמאות נשמרות כגיבוב (hash) חד-כיווני, ופרטי כרטיס אשראי אינם נאספים.
      </p>

      <p className={styles.text}>
        לבקשה למחיקת מידע ניתן לפנות דרך עמוד "צור קשר".
      </p>
    </div>
  );
}
