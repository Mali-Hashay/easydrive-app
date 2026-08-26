import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { addNewRental, updateExistingRental } from '../../store/slices/rentalSlice';
import { fetchAllCars } from '../../store/slices/carSlice';
import { fetchUsers } from '../../store/slices/userSlice'; 

import { alertService } from '../../utils/alertService';
import { calculateTotalPrice, formatRentalDate, formatRentalTime, toIsraelISOString } from '../../utils/dateUtils';
import RentalDateAndTime from '../rental/RentalDateAndTime.jsx';
import styles from './AdminForm.module.css';

import { 
    validateIdNumber, 
    validateLicenseNumber, 
    validateBirthDate, 
    validateAmount,
    validateRequiredSelect,
    validateRentalDates
} from '../../utils/validators.js';

const INITIAL_STATE = {
    clientId: '',
    carId: '',
    driversIdNumber: '',
    licenseNumber: '',
    driversBirthDate: '',
    pickupDate: '',
    pickupTime: '',
    plannedReturnDate: '',
    plannedReturnTime: '',
    totalPrice: ''
};

export default function RentalDrawer(props) {
    const { rentalToEdit, onClose, onSuccess } = props;
    const dispatch = useDispatch();
    const isEdit = Boolean(rentalToEdit);

    const allCars = useSelector(state => state.cars.allCars) || [];
    const { users: usersList, loading: isLoadingUsers } = useSelector(state => state.users) || { users: [], loading: false };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchAllCars());
    }, [dispatch]);

    useEffect(() => {
        if (rentalToEdit) {
            const pickup = rentalToEdit.pickupDate ? dayjs(rentalToEdit.pickupDate) : null;
            const returnDate = rentalToEdit.plannedReturnDate ? dayjs(rentalToEdit.plannedReturnDate) : null;

            setFormData({
                clientId: rentalToEdit.clientId?._id || rentalToEdit.clientId || '',
                carId: rentalToEdit.carId?._id || rentalToEdit.carId || '',
                driversIdNumber: rentalToEdit.driversIdNumber || '',
                licenseNumber: rentalToEdit.licenseNumber || '',
                driversBirthDate: rentalToEdit.driversBirthDate ? dayjs(rentalToEdit.driversBirthDate).format('YYYY-MM-DD') : '',
                pickupDate: pickup ? formatRentalDate(rentalToEdit.pickupDate, 'YYYY-MM-DD') : '',
                pickupTime: pickup ? formatRentalTime(rentalToEdit.pickupDate) : '',
                plannedReturnDate: returnDate ? formatRentalDate(rentalToEdit.plannedReturnDate, 'YYYY-MM-DD') : '',
                plannedReturnTime: returnDate ? formatRentalTime(rentalToEdit.plannedReturnDate) : '',
                totalPrice: rentalToEdit.totalPrice || ''
            });
        } else {
            setFormData(INITIAL_STATE);
        }
        setErrors({}); 
    }, [rentalToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'clientId') {
            const selectedUser = usersList.find(user => user._id === value);
            setFormData(prev => ({
                ...prev,
                clientId: value,
                driversIdNumber: selectedUser?.idNumber || prev.driversIdNumber,
                licenseNumber: selectedUser?.licenseNumber || prev.licenseNumber,
                driversBirthDate: selectedUser?.birthDate 
                    ? dayjs(selectedUser.birthDate).format('YYYY-MM-DD') 
                    : prev.driversBirthDate
            }));

            setErrors(prev => ({
                ...prev,
                clientId: '',
                driversIdNumber: '',
                licenseNumber: '',
                driversBirthDate: ''
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFieldChange = (name, value) => {
        if (errors[name] || errors.plannedReturnDate) {
            setErrors(prev => ({ ...prev, [name]: '', plannedReturnDate: '' }));
        }
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'pickupTime' && prev.pickupDate === prev.plannedReturnDate && prev.plannedReturnTime && prev.plannedReturnTime <= value
                ? { plannedReturnTime: '' }
                : {})
        }));
    };

    useEffect(() => {
        const { carId, pickupDate, pickupTime, plannedReturnDate, plannedReturnTime } = formData;

        if (carId && pickupDate && pickupTime && plannedReturnDate && plannedReturnTime) {
            const selectedCar = allCars.find(c => c._id === carId);
            const pricePerDay = selectedCar?.dailyPrice;

            if (pricePerDay) {
                const computedTotal = calculateTotalPrice(
                    pickupDate,
                    pickupTime,
                    plannedReturnDate,
                    plannedReturnTime,
                    pricePerDay
                );
                setFormData(prev => ({ ...prev, totalPrice: computedTotal }));
                if (errors.totalPrice) {
                    setErrors(prev => ({ ...prev, totalPrice: '' }));
                }
            }
        }
    }, [
        formData.carId,
        formData.pickupDate,
        formData.pickupTime,
        formData.plannedReturnDate,
        formData.plannedReturnTime,
        allCars,
        errors.totalPrice
    ]);

    const validateForm = () => {
        let newErrors = {};

        const clientErr = validateRequiredSelect(formData.clientId, 'לקוח');
        if (clientErr) newErrors.clientId = clientErr;

        const carErr = validateRequiredSelect(formData.carId, 'רכב');
        if (carErr) newErrors.carId = carErr;

        const idErr = validateIdNumber(formData.driversIdNumber);
        if (idErr) newErrors.driversIdNumber = idErr;

        const licenseErr = validateLicenseNumber(formData.licenseNumber);
        if (licenseErr) newErrors.licenseNumber = licenseErr;

        const birthErr = validateBirthDate(formData.driversBirthDate);
        if (birthErr) newErrors.driversBirthDate = birthErr;

        const dateErrors = validateRentalDates(
            formData.pickupDate,
            formData.pickupTime,
            formData.plannedReturnDate,
            formData.plannedReturnTime
        );
        if (dateErrors) {
            newErrors = { ...newErrors, ...dateErrors };
        }

        const priceErr = validateAmount(formData.totalPrice);
        if (priceErr) newErrors.totalPrice = priceErr;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        
        const {
            clientId,
            carId,
            driversIdNumber,
            licenseNumber,
            driversBirthDate,
            pickupDate,
            pickupTime,
            plannedReturnDate,
            plannedReturnTime,
            totalPrice
        } = formData;

        const payload = {
            clientId,
            carId,
            driversIdNumber,
            licenseNumber,
            driversBirthDate,
            pickupDate: toIsraelISOString(pickupDate, pickupTime),
            plannedReturnDate: toIsraelISOString(plannedReturnDate, plannedReturnTime),
            totalPrice: Number(totalPrice)
        };

        try {
            setSubmitting(true);

            if (isEdit) {
                await dispatch(updateExistingRental({ id: rentalToEdit._id, updatedFields: payload })).unwrap();
                alertService.success('ההזמנה עודכנה בהצלחה!');
            } else {
                await dispatch(addNewRental(payload)).unwrap();
                alertService.success('ההזמנה נוצרה בהצלחה!');
            }

            if (onSuccess) onSuccess();
            onClose();

        } catch (err) {
            console.error(err);
            alertService.errorToast(err.message || err || 'שמירת ההזמנה נכשלה');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                
                <div className={styles.header}>
                    <h3>{isEdit ? 'עריכת הזמנה' : 'יצירת הזמנה חדשה'}</h3>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                
                    <div className={styles.formGroup}>
                        <label>לקוח *</label>
                        <select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            className={`${styles.inputField} ${errors.clientId ? 'input-error' : ''}`}
                            disabled={isLoadingUsers || isEdit}
                        >
                            <option value="">בחר לקוח מתוך המערכת</option>
                            {usersList.map(client => (
                                <option key={client._id} value={client._id}>
                                    {client.firstName} {client.lastName} ({client.phone || client.email})
                                </option>
                            ))}
                        </select>
                        {errors.clientId && <span className="error-text">{errors.clientId}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>רכב *</label>
                        <select
                            name="carId"
                            value={formData.carId}
                            onChange={handleChange}
                            className={`${styles.inputField} ${errors.carId ? 'input-error' : ''}`}
                            disabled={isEdit}
                        >
                            <option value="">בחר רכב מצי הרכבים</option>
                            {allCars
                                .filter(car => car.status === 'available' || car._id === formData.carId)
                                .map(car => (
                                    <option key={car._id} value={car._id}>
                                        {car.brand} {car.model} — {car.licensePlate}
                                    </option>
                                ))}
                        </select>
                        {errors.carId && <span className="error-text">{errors.carId}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>מספר ת.ז נהג *</label>
                        <input
                            type="text"
                            name="driversIdNumber"
                            value={formData.driversIdNumber}
                            onChange={handleChange}
                            placeholder="הכנס מספר תעודת זהות"
                            className={`${styles.inputField} ${errors.driversIdNumber ? 'input-error' : ''}`}
                        />
                        {errors.driversIdNumber && <span className="error-text">{errors.driversIdNumber}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>מספר רישיון נהיגה *</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            placeholder="הכנס/י מספר רישיון נהיגה"
                            className={`${styles.inputField} ${errors.licenseNumber ? 'input-error' : ''}`}
                        />
                        {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>תאריך לידה *</label>
                        <input
                            type="date"
                            name="driversBirthDate"
                            value={formData.driversBirthDate}
                            onChange={handleChange}
                            className={`${styles.inputField} ${errors.driversBirthDate ? 'input-error' : ''}`}
                        />
                        {errors.driversBirthDate && <span className="error-text">{errors.driversBirthDate}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <RentalDateAndTime
                            dateLabel="תאריך איסוף"
                            timeLabel="שעת איסוף"
                            dateValue={formData.pickupDate}
                            timeValue={formData.pickupTime}
                            mode="both"
                            onDateChange={(val) => handleFieldChange('pickupDate', val)}
                            onTimeChange={(val) => handleFieldChange('pickupTime', val)}
                            inputClassName={styles.inputField}
                            hasError={!!(errors.pickupDate || errors.pickupTime)}
                        />
                        {(errors.pickupDate || errors.pickupTime) && (
                            <span className="error-text">{errors.pickupDate || errors.pickupTime}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <RentalDateAndTime
                            dateLabel="תאריך החזרה מתוכנן"
                            timeLabel="שעת החזרה"
                            dateValue={formData.plannedReturnDate}
                            timeValue={formData.plannedReturnTime}
                            mode="both"
                            compareDate={formData.pickupDate}
                            compareTime={formData.pickupTime}
                            onDateChange={(val) => handleFieldChange('plannedReturnDate', val)}
                            onTimeChange={(val) => handleFieldChange('plannedReturnTime', val)}
                            minDate={formData.pickupDate || dayjs().format('YYYY-MM-DD')}
                            inputClassName={styles.inputField}
                            hasError={!!(errors.plannedReturnDate || errors.plannedReturnTime)}
                        />
                        {(errors.plannedReturnDate || errors.plannedReturnTime) && (
                            <span className="error-text">{errors.plannedReturnDate || errors.plannedReturnTime}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>מחיר כולל (₪) *</label>
                        <input
                            type="number"
                            name="totalPrice"
                            value={formData.totalPrice}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            className={`${styles.inputField} ${errors.totalPrice ? 'input-error' : ''}`}
                        />
                        {errors.totalPrice && <span className="error-text">{errors.totalPrice}</span>}
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            ביטול
                        </button>
                        <button type="submit" disabled={submitting} className={styles.submitBtn}>
                            {submitting ? 'שומר...' : (isEdit ? 'עדכן הזמנה' : 'צור הזמנה במערכת')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}