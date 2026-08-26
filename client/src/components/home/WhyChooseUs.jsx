import React from 'react';
import styles from './WhyChooseUs.module.css'; 
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function WhyChooseUs() 
{
    const features = [
        { 
            id: 1, 
            icon: <DirectionsCarIcon className={styles.icon} />, 
            title: 'צי רכבים חדיש', 
            description: 'כל הרכבים שלנו עוברים בדיקות קפדניות, מטופלים ונקיים תמיד.' 
        },
        { 
            id: 2, 
            icon: <CheckCircleOutlinedIcon className={styles.icon} />, 
            title: 'ביטול חינם', 
            description: 'גמישות מלאה! אפשרות לביטול ללא עלות עד 24 שעות לפני האיסוף.' 
        },
        { 
            id: 3, 
            icon: <CreditCardIcon className={styles.icon} />, 
            title: 'ללא עמלות נסתרות', 
            description: 'המחיר שאת/ה רואה הוא המחיר שתשלם/י. שקיפות מלאה ללא הפתעות.' 
        }
    ];

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>למה לבחור בנו?</h2>
            
            <div className={styles.featuresContainer}>
                {features.map((feature) => (
                    <div key={feature.id} className={styles.featureCard}>
                        <div className={styles.iconWrapper}>
                            {feature.icon}
                        </div>
                        <h3 className={styles.featureTitle}>
                            {feature.title}
                        </h3>
                        <p className={styles.featureText}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}