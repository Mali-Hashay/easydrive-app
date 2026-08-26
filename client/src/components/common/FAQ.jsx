import { useState } from "react";
import styles from "./FAQ.module.css";

export default function FAQ() 
{
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "מהם תנאי הסף להשכרת רכב?",
            answer: "השכרת רכב מתאפשרת לכל נהג בעל רישיון נהיגה בתוקף של חצי שנה לפחות וכרטיס אשראי בינלאומי על שמו לטובת פיקדון מסגרת."
        },
        {
            question: "האם ניתן לבטל או לשנות את ההזמנה?",
            answer: "בוודאי. ניתן לבטל או לשנות את פרטי ההזמנה בקלות ובחינם עד 24 שעות לפני מועד האיסוף דרך האזור האישי או מול שירות הלקוחות שלנו."
        },
        {
            question: "מה כולל מחיר השכרת הרכב?",
            answer: "המחיר המוצג באתר כולל מע\"מ, כיסוי ביטוחי בסיסי מפני נזקים וגניבות (עם השתתפות עצמית), וקילומטראז' חופשי בהתאם למדיניות ההזמנה."
        },
        {
            question: "כיצד מתבצע תהליך איסוף והחזרת הרכב?",
            answer: "בעת האיסוף יש להציג רישיון נהיגה ישראלי או בינלאומי בתוקף, תעודת זהות וכרטיס אשראי על שם הנהג הראשי. ההחזרה מתבצעת בנקודה שנקבעה מראש ובאותו מצב דלק שבו הרכב נמסר."
        }
    ];

    return (
        <div className={styles.faqSection}>
            <h3 className={styles.faqTitle}>שאלות נפוצות</h3>
            <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`${styles.faqItem} ${activeFaq === index ? styles.faqItemActive : ''}`}
                    >
                        <button 
                            type="button"
                            className={styles.faqQuestion} 
                            onClick={() => toggleFaq(index)}
                        >
                            <span>{faq.question}</span>
                            <span className={`${styles.faqIcon} ${activeFaq === index ? styles.faqIconActive : ''}`}>
                                +
                            </span>
                        </button>
                        <div className={`${styles.faqAnswer} ${activeFaq === index ? styles.faqAnswerActive : ''}`}>
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}