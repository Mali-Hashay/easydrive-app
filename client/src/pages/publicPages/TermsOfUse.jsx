import React from 'react';
import styles from './TermsOfUse.module.css';

export default function TermsOfUsePage() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>תנאי שימוש</h1>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <p>
                            האתר פותח כפרויקט תיק עבודות ואינו מייצג חברה פעילה. ההזמנות באתר אינן מחייבות, לא מתבצע בו חיוב כספי, ולא מושכרים בו רכבים בפועל.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>כללי ההזמנה במערכת</h2>
                        <ul>
                            <li>מחיר ההשכרה מחושב לפי ימים. כל 24 שעות שהתחילו נספרות כיום מלא.</li>
                            <li>ניתן לערוך הזמנה עד מועד האיסוף.</li>
                            <li>ניתן לבטל הזמנה עד 24 שעות לפני מועד האיסוף.</li>
                            <li>ניתן להאריך השכרה פעילה, בתנאי שהרכב פנוי בתאריכים החדשים.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>שימוש באתר</h2>
                        <p>
                            האתר מוצג כפי שהוא, לצורכי הדגמה בלבד.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
