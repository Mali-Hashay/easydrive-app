import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/authSlice";
import { validateEmail, validatePassword } from "../../utils/validators";
import styles from "./Login.module.css";

export default function LoginPage({ onSuccess, onSwitchToRegister, onSwitchToForgot }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector(state => state.auth.loading);
    const authError = useSelector(state => state.auth.error);

    const validateForm = () => {
        const newErrors = {};

        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await dispatch(loginUser({ email, password })).unwrap();
            
            // אם הופעל בתוך מודאל- סגירת המודאל, אחרת ניווט בדף
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        // מעבר להרשמה (מודאל או דף)
        if (onSwitchToRegister) {
            onSwitchToRegister();
        } else {
            navigate('/register');
        }
    };

    const handleForgotClick = (e) => {
        e.preventDefault();
        // מעבר לשכחתי סיסמה 
        if (onSwitchToForgot) 
            onSwitchToForgot();
        
    };

    return (
        <div className={styles.container}>
            <p className={styles.title}>התחברות לחשבון</p>
            
            {authError && <div className={styles.globalError}>{authError}</div>}
            
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>כתובת דוא"ל</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={`${styles.input} ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>סיסמה</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className={`${styles.input} ${errors.password ? 'input-error' : ''}`}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
                
                <div className={styles.linkGroup} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <button 
                        type="button" 
                        onClick={handleForgotClick} 
                        className={styles.link}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        שכחתי סיסמה
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleRegisterClick} 
                        className={styles.link}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        אין לך חשבון? להרשמה
                    </button>
                </div>
                
                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? 'מתחבר...' : 'התחברות'}
                </button>
            </form>
        </div>
    );
}