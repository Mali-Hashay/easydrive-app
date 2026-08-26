import styles from './AdminFooter.module.css';

export default function AdminFooter() {
    return (
        <footer className={styles.footer}>
            <div>
                © {new Date().getFullYear()} כל הזכויות שמורות – ניהול השכרת רכב
            </div>
            <div>
                גרסת מערכת: <span className={styles.version}>1.0.0</span>
            </div>
        </footer>
    );
}