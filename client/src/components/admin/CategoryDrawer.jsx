import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCategoryDetails, addNewCategory } from '../../store/slices/categorySlice';
import { alertService } from '../../utils/alertService';
import { validateCategoryName } from '../../utils/validators';
import styles from './AdminForm.module.css';

const INITIAL_STATE = {
    name: '',
    status: 'active'
};

export default function CategoryDrawer({ categoryToEdit, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const isEdit = Boolean(categoryToEdit);

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (categoryToEdit) {
            setFormData({
                name: categoryToEdit.name || '',
                status: categoryToEdit.status || 'active'
            });
        } else {
            setFormData(INITIAL_STATE);
        }
        setErrors({});
    }, [categoryToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        const nameError = validateCategoryName(formData.name);
        if (nameError) {
            newErrors.name = nameError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) 
            return;
        
        setSubmitting(true);
        try {
            if (isEdit) {
                await dispatch(updateCategoryDetails({
                    id: categoryToEdit._id,
                    updatedFields: { name: formData.name.trim(), status: formData.status }
                })).unwrap();
                alertService.success('הקטגוריה עודכנה בהצלחה');
            } else {
                await dispatch(addNewCategory({
                    name: formData.name.trim(),
                    status: formData.status
                })).unwrap();
                alertService.success('קטגוריה חדשה נוספה בהצלחה');
            }
            onSuccess();
        } catch (error) {
            alertService.error('אירעה שגיאה בעת שמירת הקטגוריה');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>{isEdit ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}</h3>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.formGroup}>
                        <label>שם הקטגוריה *</label>
                        <input
                            type="text"
                            name="name"
                            className={`${styles.inputField} ${errors.name ? 'input-error' : ''}`}
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>סטטוס</label>
                        <select
                            name="status"
                            className={styles.inputField}
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">פעיל</option>
                            <option value="inActive">לא פעיל</option>
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            ביטול
                        </button>
                        <button type="submit" disabled={submitting} className={styles.submitBtn}>
                            {submitting ? 'שומר...' : (isEdit ? 'שמור שינויים' : 'צור קטגוריה')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}