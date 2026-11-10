import styles from './Accessibility.module.css';

export default function AccessibilityPage()
{
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>הצהרת נגישות</h1>

      <p className={styles.introText}>
        האתר פותח כפרויקט תיק עבודות ואינו מייצג חברה פעילה. האתר לא עבר בדיקת נגישות מקצועית.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>התאמות נגישות באתר</h2>
        <ul className={styles.list}>
          <li>קיים טקסט חלופי לתמונות.</li>
          <li>האתר מותאם לתצוגה במחשב ובטלפון נייד.</li>
          <li>כפתורי התפריטים וחלון ההתחברות כוללים תוויות לקוראי מסך.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>דיווח על בעיה</h2>
        <p className={styles.text}>
          נתקלת בבעיית נגישות? אפשר לדווח עליה דרך עמוד "צור קשר".
        </p>
      </section>
    </div>
  );
}
