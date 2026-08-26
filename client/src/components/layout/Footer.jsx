import { Link } from "react-router-dom";
import React from "react";
import styles from "./Footer.module.css";
import logo from '../../assets/logo.png';
import { MAIN_BRANCH } from "../../constants/branchData";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                
                <div className={styles.brandColumn}>
                    <img src={logo} alt="לוגו השכרת רכב" className={styles.footerLogo} />
                    <p className={styles.description}>
                        השותפים שלך לדרך. אנו מציעים מגוון רחב של רכבים מתוחזקים היטב, 
                        שירות לקוחות אמין וחווית נסיעה בטוחה ונוחה לכל יעד שתבחרו.
                    </p>
                </div>

                <div className={styles.linkColumn}>
                    <span className={styles.linkTitle}>ניווט מהיר</span>
                    <Link to="/" className={styles.link}>דף הבית</Link>
                    <Link to="/rental" className={styles.link}>השכרת רכב</Link>
                    <Link to="/faq" className={styles.link}>שאלות ותשובות</Link>
                </div>

                <div className={styles.linkColumn}>
                    <span className={styles.linkTitle}>מידע משפטי</span>
                    <Link to="/terms" className={styles.link}>תנאי שימוש</Link>
                    <Link to="/privacy" className={styles.link}>מדיניות פרטיות</Link>
                    <Link to="/accessibility" className={styles.link}>הצהרת נגישות</Link>
                </div>

                <div className={styles.contactColumn}>
                    <span className={styles.linkTitle}>צור קשר</span>
                    <div className={styles.contactInfo}>
                        <p><strong>כתובת:</strong> {MAIN_BRANCH.address}</p>
                        <p><strong>טלפון:</strong> {MAIN_BRANCH.phone}</p>
                        <p><strong>דוא"ל:</strong> {MAIN_BRANCH.email}</p>
                        <p><strong>שעות פעילות:</strong> {MAIN_BRANCH.openingHours}</p>
                    </div>
                    <Link to="/contact" className={styles.contactButton}>
                        למעבר לדף צור קשר
                    </Link>
                </div>
            </div>

            <div className={styles.bottomBar}>
                © {new Date().getFullYear()} השכרת רכב. כל הזכויות שמורות.
            </div>
        </footer>
    );
}