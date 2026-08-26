import styles from './Accessibility.module.css';

export default function AccessibilityPage() 
{
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>הצהרת נגישות</h1>
      <p className={styles.lastUpdated}>תאריך עדכון אחרון: 01/01/2024</p>
      
      <p className={styles.introText}>
        אנו רואים חשיבות רבה במתן שירות שוויוני ונגיש לכלל לקוחותינו, ומשקיעים מאמצים ומשאבים רבים בהנגשת האתר והסניפים שלנו לאנשים עם מוגבלויות.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>נגישות האתר</h2>
        <p className={styles.text}>
          אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג 2013. התאמות הנגישות בוצעו עפ"י המלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA ומסמך WCAG2.0 הבינלאומי.
        </p>
        <ul className={styles.list}>
          <li>האתר מספק מבנה סמנטי עבור טכנולוגיות מסייעות ותמיכה בדפוס השימוש המקובל להפעלה עם מקלדת (מקשי Tab, Enter ו-Esc).</li>
          <li>מותאם לתצוגה בדפדפנים הנפוצים ולשימוש בטלפונים סלולריים.</li>
          <li>הקפדה על ניגודיות צבעים ויחס טקסט לרקע קריא וברור.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>הסדרי נגישות פיזיים במשרדי החברה</h2>
        <p className={styles.text}>
          בסניף המרכזי של החברה קיימים הסדרי הנגישות הבאים:
        </p>
        <ul className={styles.list}>
          <li>חניות נכים מוסדרות בקרבת הכניסה.</li>
          <li>גישה רציפה וללא מדרגות מהחניה ועד לעמדות השירות.</li>
          <li>דלפק שירות נגיש ומערכת עזר לשמיעה (לולאת השראה).</li>
          <li>שירותי נכים תקניים במבנה.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>דרכי פנייה לבקשות ושיפורים בנושא נגישות</h2>
        <p className={styles.text}>
          אנו ממשיכים במאמצים לשפר את הנגישות כחלק ממחויבותנו לאפשר לכלל האוכלוסייה, כולל אנשים עם מוגבלויות, לקבל את השירות הנגיש ביותר. אם נתקלת בבעיה או בתקלה כלשהי בנושא נגישות, נשמח שתעדכן/י אותנו בכך ואנו נעשה כל מאמץ למצוא פתרון מתאים ולטפל בתקלה בהקדם.
        </p>
        <div className={styles.contactInfo}>
            <p><strong>רכז/ת נגישות:</strong> צוות תמיכה ונגישות EasyDrive</p>
            <p><strong>טלפון:</strong> 03-1234567</p>
            <p><strong>דוא"ל:</strong> accessibility@easydrive-demo.co.il</p>
        </div>
      </section>
    </div>
  );
}