import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './AdminForm.module.css';
import { alertService } from '../../utils/alertService';

import { 
    validateName, 
    validateEmail, 
    validatePassword, 
    validatePhone, 
    validateIdNumber 
} from '../../utils/validators.js';
import { addNewUser, updateUserDetails } from '../../store/slices/userSlice.js';

export default function UserDrawer(props) {
    const { userToEdit, onClose, onSuccess } = props; 
    const dispatch = useDispatch();
    const isEdit = Boolean(userToEdit && userToEdit._id);
    const [submitting, setSubmitting] = useState(false);
    
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        idNumber: '',
        role: 'customer'
    });

    useEffect(() => {
        if (isEdit) {
            setFormData({
                firstName: userToEdit.firstName || '',
                lastName: userToEdit.lastName || '',
                email: userToEdit.email || '',
                password: '',
                phoneNumber: userToEdit.phoneNumber || '',
                idNumber: userToEdit.idNumber || '',
                role: userToEdit.role || 'customer'
            });
        }
        setErrors({});
    }, [userToEdit, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) 
            setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        const firstNameErr = validateName(formData.firstName, 'שם פרטי');
        if (firstNameErr) newErrors.firstName = firstNameErr;

        const lastNameErr = validateName(formData.lastName, 'שם משפחה');
        if (lastNameErr) newErrors.lastName = lastNameErr;

        const emailErr = validateEmail(formData.email);
        if (emailErr) newErrors.email = emailErr;

        if (!isEdit || formData.password) {
            const passwordErr = validatePassword(formData.password);
            if (passwordErr) newErrors.password = passwordErr;
        }

        if (formData.phoneNumber) {
            const phoneErr = validatePhone(formData.phoneNumber);
            if (phoneErr) newErrors.phoneNumber = phoneErr;
        }
    
        if (formData.idNumber) {
            const idErr = validateIdNumber(formData.idNumber);
            if (idErr) newErrors.idNumber = idErr;
        }

        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) 
            return;

        try {
            setSubmitting(true);
            
            if (isEdit) {
                const dataToSend = { ...formData };
                if (!dataToSend.password) 
                    delete dataToSend.password;

                await dispatch(updateUserDetails({ 
                    userId: userToEdit._id, 
                    updatedFields: dataToSend 
                })).unwrap();

                alertService.success('פרטי המשתמש עודכנו בהצלחה');
            } else {
                await dispatch(addNewUser(formData)).unwrap();
                alertService.success('משתמש חדש נוצר בהצלחה');
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            alertService.errorToast(err || 'הפעולה נכשלה');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.drawerHeader}>
                    <h2 className={styles.title}>
                        {isEdit ? 'עריכת פרטי משתמש' : 'הוספת משתמש חדש'}
                    </h2>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGrid}>
                        
                        <div className={styles.formGroup}>
                            <label>שם פרטי *</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                value={formData.firstName} 
                                onChange={handleInputChange} 
                                className={`${styles.inputField} ${errors.firstName ? 'input-error' : ''}`}
                            />
                            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>שם משפחה *</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={formData.lastName} 
                                onChange={handleInputChange} 
                                className={`${styles.inputField} ${errors.lastName ? 'input-error' : ''}`}
                            />
                            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>אימייל *</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                className={`${styles.inputField} ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>{isEdit ? 'סיסמה חדשה (השאר ריק לשמירת הקיימת)' : 'סיסמה *'}</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleInputChange} 
                                className={`${styles.inputField} ${errors.password ? 'input-error' : ''}`}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>טלפון</label>
                            <input 
                                type="tel" 
                                name="phoneNumber" 
                                value={formData.phoneNumber} 
                                onChange={handleInputChange} 
                                className={`${styles.inputField} ${errors.phoneNumber ? 'input-error' : ''}`}
                            />
                            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>ת.ז / מס' רישיון</label>
                            <input 
                                type="text" 
                                name="idNumber" 
                                value={formData.idNumber} 
                                onChange={handleInputChange} 
                                className={`${styles.inputField} ${errors.idNumber ? 'input-error' : ''}`}
                            />
                            {errors.idNumber && <span className="error-text">{errors.idNumber}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>תפקיד</label>
                            <select 
                                name="role" 
                                value={formData.role} 
                                onChange={handleInputChange} 
                                className={styles.inputField}
                            >
                                <option value="customer">לקוח</option>
                                <option value="admin">מנהל</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className={styles.cancelBtn}
                        >
                            ביטול
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className={styles.submitBtn}
                        >
                            {submitting ? 'שומר...' : (isEdit ? 'עדכן משתמש' : 'צור משתמש')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}