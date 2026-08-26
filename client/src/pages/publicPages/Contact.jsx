import React, { useState } from 'react';
import styles from './Contact.module.css';
import { alertService } from '../../utils/alertService';
import { submitContactForm } from '../../api/contactApi';
import { validateName, validatePhone, validateEmail } from '../../utils/validators';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) 
            setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        const nameErr = validateName(formData.name, 'שם מלא');
        if (nameErr) 
            newErrors.name = nameErr;

        const phoneErr = validatePhone(formData.phone);
        if (phoneErr) 
            newErrors.phone = phoneErr;

        const emailErr = validateEmail(formData.email);
        if (emailErr) 
            newErrors.email = emailErr;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) 
            return;

        setIsLoading(true);
        try {
            await submitContactForm(formData);
            alertService.success('פנייתך נשלחה בהצלחה!');
            setFormData({ name: '', phone: '', email: '', message: '' });
            setErrors({});
        } catch (err) {
            alertService.errorToast('תקלת תקשורת עם השרת');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.infoSection}>
                <h1 className={styles.mainTitle}>צור קשר</h1>
                <p className={styles.subtitle}>אנו זמינים לשירותכם תמיד.</p>
                
                <div className={styles.hoursBox}>
                    <h3 className={styles.hoursTitle}>שעות פעילות:</h3>
                    <p className={styles.hourLine}><strong>ימים א'-ה':</strong> 08:30 - 20:00</p>
                    <p className={styles.hourLine}><strong>יום ו' וערבי חג:</strong> 08:30 - 12:30</p>
                </div>
            </div>

            <div className={styles.formSection}>
                <h3 className={styles.formTitle}>השאירו פרטים ונחזור אליכם בהקדם</h3>
                
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    
                    <div className={styles.fieldGroup}>
                        <input 
                            className={`${styles.input} ${errors.name ? 'input-error' : ''}`} 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="שם מלא" 
                        />
                        {errors.name && <p className="error-text">{errors.name}</p>}
                    </div>

                    <div className={styles.fieldGroup}>
                        <input 
                            className={`${styles.input} ${errors.phone ? 'input-error' : ''}`} 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange} 
                            placeholder="טלפון" 
                        />
                        {errors.phone && <p className="error-text">{errors.phone}</p>}
                    </div>

                    <div className={styles.fieldGroup}>
                        <input 
                            className={`${styles.input} ${errors.email ? 'input-error' : ''}`} 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange} 
                            placeholder="אימייל" 
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>

                    <div className={styles.fieldGroup}>
                        <textarea 
                            className={styles.textarea} 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="תוכן ההודעה (אופציונלי)" 
                            rows="4"
                        ></textarea>
                    </div>
                    
                    <button 
                        className={styles.submitBtn} 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'שולח...' : 'שליחה'}
                    </button>
                </form>
            </div>
        </div>
    );
}