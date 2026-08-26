import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRentals } from '../../store/slices/rentalSlice'; 
import { alertService } from '../../utils/alertService';
import { validateAmount, validateRequiredSelect } from '../../utils/validators'; 
import styles from './AdminForm.module.css';
import { paymentMethods, paymentStatuses } from '../../constants/translations';

const INITIAL_STATE = {
    rentalId: '',
    sum: '',
    paymentMethod: paymentMethods['credit_card'],
    status: paymentStatuses['pending']
};

export default function PaymentDrawer(props) {
    const { paymentToEdit, onClose, onSubmit, onSuccess } = props;
    const isEdit = Boolean(paymentToEdit);
    const dispatch = useDispatch();

    const { rentalsList = [], loading: isLoadingRentals } = useSelector(state => state.rentals);

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (rentalsList.length === 0) {
            dispatch(fetchAllRentals());
        }
    }, [dispatch, rentalsList.length]);

    useEffect(() => {
        if (paymentToEdit) {
            setFormData({
                rentalId: paymentToEdit.rentalId?._id || paymentToEdit.rentalId || '',
                sum: paymentToEdit.sum || '',
                paymentMethod: paymentToEdit.paymentMethod || 'credit_card',
                status: paymentToEdit.status || 'pending'
            });
        } else {
            setFormData(INITIAL_STATE);
        }
        setErrors({});
    }, [paymentToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        const rentalErr = validateRequiredSelect(formData.rentalId, 'השכרה');
        if (rentalErr) newErrors.rentalId = rentalErr;

        const sumErr = validateAmount(formData.sum);
        if (sumErr) newErrors.sum = sumErr;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const payload = isEdit
                ? { status: formData.status, paymentMethod: formData.paymentMethod }
                : { rentalId: formData.rentalId, sum: Number(formData.sum), paymentMethod: formData.paymentMethod };

            await onSubmit(payload, paymentToEdit?._id);
            alertService.success(isEdit ? 'התשלום עודכן בהצלחה!' : 'התשלום נוצר בהצלחה!');
            
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError(err || 'שמירת התשלום נכשלה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                
                <div className={styles.header}>
                    <h3>{isEdit ? 'עדכון פרטי תשלום' : 'רישום תשלום חדש'}</h3>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    {error && <div style={{ color: '#d93025', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label>השכרה *</label>
                        <select
                            name="rentalId"
                            value={formData.rentalId}
                            onChange={handleChange}
                            className={`${styles.inputField} ${errors.rentalId ? 'input-error' : ''}`}
                            disabled={isLoadingRentals || isEdit}
                        >
                            <option value="">בחר/י השכרה מתוך הרשימה</option>
                            {rentalsList.map(rental => (
                                <option key={rental._id} value={rental._id}>
                                    השכרה #{rental._id?.slice(-6)} 
                                    {rental.clientId ? ` | ${rental.clientId.firstName} ${rental.clientId.lastName}` : ''}
                                    {rental.carId ? ` | ${rental.carId.brand} ${rental.carId.model}` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.rentalId && <span className="error-text">{errors.rentalId}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>סכום (₪) *</label>
                        <input
                            type="number"
                            name="sum"
                            value={formData.sum}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            className={`${styles.inputField} ${errors.sum ? 'input-error' : ''}`}
                            disabled={isEdit}
                        />
                        {errors.sum && <span className="error-text">{errors.sum}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>אמצעי תשלום</label>
                        <select 
                            name="paymentMethod" 
                            value={formData.paymentMethod} 
                            onChange={handleChange}
                            className={styles.inputField}
                        >
                            <option value="credit_card">כרטיס אשראי</option>
                            <option value="cash">מזומן</option>
                            <option value="bank_transfer">העברה בנקאית</option>
                        </select>
                    </div>

                    {isEdit && (
                        <div className={styles.formGroup}>
                            <label>סטטוס תשלום</label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange}
                                className={styles.inputField}
                            >
                                <option value="pending">ממתין</option>
                                <option value="authorized">מאושר</option>
                                <option value="paid">שולם</option>
                                <option value="failed">נכשל</option>
                                <option value="cancelled">בוטל</option>
                                <option value="refunded">זיכוי</option>
                                <option value="partial_refund">זיכוי חלקי</option>
                            </select>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            ביטול
                        </button>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'שומר...' : (isEdit ? 'עדכן תשלום' : 'צור תשלום במערכת')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}