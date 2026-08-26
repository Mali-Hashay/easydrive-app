import React, { useState } from "react";
import { forgotPassword } from "../../api/authApi";
import styles from "./ForgotPassword.module.css";
import { alertService } from "../../utils/alertService";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/validators";

export default function ForgotPassword({ onSuccess, onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleBackToLogin = () => {
        if (onSwitchToLogin) {
            onSwitchToLogin();
        } else {
            navigate('/login');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailErr = validateEmail(email);
        if (emailErr) {
            setError(emailErr);
            return;
        }

        setIsLoading(true);

        try {
            await forgotPassword(email);
            await alertService.successModal('קישור לאיפוס סיסמה נשלח בהצלחה לכתובת האימייל שלך', '');
            
            // אם מופעל בתוך מודאל - סוגר אותו או מחזיר להתחברות, אחרת מנווט בדף
            if (onSuccess) {
                onSuccess();
            } else if (onSwitchToLogin) {
                onSwitchToLogin();
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'אירעה שגיאה, אנא נסה בשנית');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <h2 className={styles.title}>שכחת סיסמה?</h2>
                <p className={styles.subtitle}>
                    הזן את כתובת הדוא"ל שלך ונשלח לך קישור לאיפוס הסיסמה.
                </p>
                
                {error && (
                    <div className={styles.errorMessageContainer}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>כתובת דוא"ל</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}  
                            className={`${styles.input} ${error ? styles.inputError : ''}`}
                            placeholder="name@example.com"
                            dir="ltr" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`${styles.submitBtn} ${isLoading ? styles.loadingBtn : ''}`}
                    >
                        {isLoading ? 'שולח...' : 'שלח קישור לאיפוס'}
                    </button>

                    <div className={styles.backBtnContainer}>
                        <button 
                            type="button" 
                            onClick={handleBackToLogin}
                            className={styles.backBtn}
                        >
                            חזרה להתחברות
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}