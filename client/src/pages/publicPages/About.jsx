import React from 'react';
import styles from './About.module.css';
import SecurityIcon from '@mui/icons-material/Security';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function AboutUs() {
    return (
        <div className={styles.aboutContainer}>
            
           
            <div className={styles.heroWrapper}>
                <section className={styles.heroSection}>
                    <h1 className={styles.title}>הדרך שלכם, השקט שלכם.</h1>
                    <p className={styles.subtitle}>
                        אנחנו לא פה רק כדי לתת לכם מפתחות לרכב. אנחנו פה כדי לוודא שהנסיעה שלכם תהיה חלקה, בטוחה, ובלי הפתעות.
                    </p>
                </section>
            </div>

            <section className={styles.contentSection}>
                <div className={styles.textContent}>
                    <h2 className={styles.sectionTitle}>מי אנחנו?</h2>
                    <p className={styles.paragraph}>
                         החברה הוקמה במטרה לשנות את חוויית השכרת הרכב. זיהינו את התסכול של לקוחות מעמלות נסתרות, רכבים לא מתוחזקים ותהליכים מסורבלים, והחלטנו לייצר סטנדרט חדש.
                    </p>
                    <p className={styles.paragraph}>
                        אצלנו, השקיפות היא ערך עליון. הצי שלנו מתחדש בתדירות גבוהה, עובר בדיקות בטיחות קפדניות, והצוות שלנו זמין עבורכם לכל שאלה – מהרגע שהזמנתם ועד שהחזרתם את הרכב.
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.iconWrapper}>
                            <SecurityIcon fontSize="large" />
                        </div>
                        <h3>שקיפות מלאה</h3>
                        <p>בלי אותיות קטנות ובלי חיובים מפתיעים בסוף ההשכרה.</p>
                    </div>
                    
                    <div className={styles.featureCard}>
                        <div className={styles.iconWrapper}>
                            <DirectionsCarIcon fontSize="large" />
                        </div>
                        <h3>צי רכבים חדיש</h3>
                        <p>רכבים מתוחזקים בקפידה, נקיים ומוכנים לנסיעה ארוכה.</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.iconWrapper}>
                            <SupportAgentIcon fontSize="large" />
                        </div>
                        <h3>שירות מכל הלב</h3>
                        <p>מענה אנושי מהיר וזמין, כדי שתמיד תסעו בראש שקט.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}