import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import { alertService } from "../../utils/alertService";
import { validatePassword } from "../../utils/validators";
import styles from "./ResetPassword.module.css";

export default function ResetPasswordPage() {
    const { id, token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        const passwordErr = validatePassword(newPassword);
        if (passwordErr) {
            newErrors.newPassword = passwordErr;
        }

        if (!verifyPassword) {
            newErrors.verifyPassword = 'יש לאשר את הסיסמה החדשה';
        } else if (newPassword !== verifyPassword) {
            newErrors.verifyPassword = 'הסיסמאות אינן תואמות';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const data = await resetPassword(id, token, newPassword);
            await alertService.successModal('הסיסמה שונתה בהצלחה!', data.message || 'אנא התחבר למערכת עם הסיסמה החדשה.');   
            navigate("/login");
        } catch (error) {
            alertService.errorToast(error.message || 'אירעה שגיאה בעדכון הסיסמה');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <h2 className={styles.title}>איפוס סיסמה</h2>
                <p className={styles.subtitle}>
                    אנא בחר סיסמה חדשה ומאובטחת עבור החשבון שלך.
                </p>
                
                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>סיסמה חדשה</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                            }}
                            className={`${styles.input} ${errors.newPassword ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            dir="ltr"
                        />
                        {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>אישור סיסמה חדשה</label>
                        <input 
                            type="password" 
                            value={verifyPassword} 
                            onChange={(e) => {
                                setVerifyPassword(e.target.value);
                                if (errors.verifyPassword) setErrors(prev => ({ ...prev, verifyPassword: '' }));
                            }}
                            className={`${styles.input} ${errors.verifyPassword ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            dir="ltr"
                        />
                        {errors.verifyPassword && <p className="error-text">{errors.verifyPassword}</p>}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={styles.submitBtn}
                    >
                        {isLoading ? 'מעדכן...' : 'עדכן סיסמה'}
                    </button>
                </form>
            </div>
        </div>
    );
}