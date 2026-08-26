import React from 'react';
import styles from './HowItWorks.module.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import KeyIcon from '@mui/icons-material/Key';

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            icon: <CalendarMonthIcon className={styles.icon} />,
            title: '1. בוחרים תאריכים',
            description: 'מזינים את תאריכי האיסוף וההחזרה במערכת ההזמנות המהירה שלנו.'
        },
        {
            id: 2,
            icon: <DirectionsCarIcon className={styles.icon} />,
            title: '2. בוחרים רכב',
            description: 'מעיינים בקטלוג שלנו ובוחרים את הרכב שמתאים בדיוק לצרכים שלכם.'
        },
        {
            id: 3,
            icon: <KeyIcon className={styles.icon} />,
            title: '3. יוצאים לדרך',
            description: 'אוספים את המפתחות ונהנים מנסיעה בטוחה ובראש שקט.'
        }
    ];

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>
                איך זה עובד?
            </h2>
            
            <div className={styles.stepsContainer}>
                {steps.map((step) => (
                    <div key={step.id} className={styles.stepCard}>
                        <div className={styles.iconWrapper}>
                            {step.icon}
                        </div>
                        <h3 className={styles.stepTitle}>
                            {step.title}
                        </h3>
                        <p className={styles.stepDescription}>
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}