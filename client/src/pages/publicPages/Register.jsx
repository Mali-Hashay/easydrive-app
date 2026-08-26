import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../store/slices/authSlice";
import { validateName, validateEmail, validatePhone, validatePassword } from "../../utils/validators";
import styles from "./Register.module.css";

export default function RegisterPage({ onSuccess, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        verifyPassword: '',
        termsAccepted: false 
    });

    const [formErrors, setFormErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: fieldValue
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const firstNameErr = validateName(formData.firstName, 'שם פרטי');
        if (firstNameErr) newErrors.firstName = firstNameErr;

        const lastNameErr = validateName(formData.lastName, 'שם משפחה');
        if (lastNameErr) newErrors.lastName = lastNameErr;

        const emailErr = validateEmail(formData.email);
        if (emailErr) newErrors.email = emailErr;

        const phoneErr = validatePhone(formData.phoneNumber);
        if (phoneErr) newErrors.phoneNumber = phoneErr;

        const passwordErr = validatePassword(formData.password);
        if (passwordErr) newErrors.password = passwordErr;

        if (!formData.verifyPassword) 
            newErrors.verifyPassword = 'חובה להזין אימות סיסמה';
        else if (formData.password !== formData.verifyPassword) 
            newErrors.verifyPassword = 'הסיסמאות אינן תואמות';

        if (!formData.termsAccepted) 
            newErrors.termsAccepted = 'חובה לאשר את תנאי השימוש';

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const { verifyPassword, termsAccepted, ...dataToSend } = formData;
            await dispatch(registerUser(dataToSend)).unwrap();

            //   סגירה/החלפה במודאל, או ניווט דף מלא
            if (onSuccess) {
                onSuccess();
            } else if (onSwitchToLogin) {
                onSwitchToLogin();
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        //מעבר להתחברות: החלפת טאב פנימית במודאל או מעבר עמוד
        if (onSwitchToLogin) {
            onSwitchToLogin();
        } else {
            navigate('/login');
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.title}>יצירת חשבון חדש</p>
            {error && <div className={styles.globalError}>{error}</div>}
            
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.row}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>שם פרטי</label>
                        <input 
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`${styles.input} ${formErrors.firstName ? 'input-error' : ''}`}
                        />
                        {formErrors.firstName && <p className="error-text">{formErrors.firstName}</p>}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>שם משפחה</label>
                        <input 
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`${styles.input} ${formErrors.lastName ? 'input-error' : ''}`}
                        />
                        {formErrors.lastName && <p className="error-text">{formErrors.lastName}</p>}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>דוא"ל</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${styles.input} ${formErrors.email ? 'input-error' : ''}`}
                    />
                    {formErrors.email && <p className="error-text">{formErrors.email}</p>}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>טלפון</label>
                    <input 
                        type="tel" 
                        name="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        className={`${styles.input} ${formErrors.phoneNumber ? 'input-error' : ''}`}
                    />
                    {formErrors.phoneNumber && <p className="error-text">{formErrors.phoneNumber}</p>}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>סיסמה</label>
                    <input 
                        type="password"
                        name="password"
                        value={formData.password} 
                        onChange={handleChange}
                        className={`${styles.input} ${formErrors.password ? 'input-error' : ''}`}
                    />
                    {formErrors.password && <p className="error-text">{formErrors.password}</p>}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>אימות סיסמה</label>
                    <input 
                        type="password"
                        name="verifyPassword"
                        value={formData.verifyPassword} 
                        onChange={handleChange}
                        className={`${styles.input} ${formErrors.verifyPassword ? 'input-error' : ''}`}
                    />
                    {formErrors.verifyPassword && <p className="error-text">{formErrors.verifyPassword}</p>}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.checkboxContainer}>
                        <input 
                            type="checkbox" 
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className={styles.checkbox} 
                        />
                        <span>הריני מאשר/ת את תנאי השימוש באתר</span>
                    </label>
                    {formErrors.termsAccepted && <p className="error-text">{formErrors.termsAccepted}</p>}
                </div>

                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <button 
                        type="button" 
                        onClick={handleLoginClick} 
                        className={styles.link}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        כבר יש לך חשבון? להתחברות
                    </button>
                </div>

                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? 'מבצע הרשמה...' : 'הרשמה'}
                </button>
            </form>
        </div>
    );
}