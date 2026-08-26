import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../../store/slices/categorySlice';
import { addNewCar, updateCar } from '../../store/slices/carSlice';
import { alertService } from '../../utils/alertService';
import {
    validateCarText,
    validateLicensePlate,
    validateCarYear,
    validateSeats,
    validateMileage,
    validateDailyPrice
} from '../../utils/validators'; 
import styles from './AdminForm.module.css';
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const INITIAL_STATE = {
    brand: '',
    model: '',
    licensePlate: '',
    year: '',
    categories: [],
    seats: '',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: '',
    dailyPrice: '',
    status: 'available',
    imageUrl: ''
};

// פונקציית עזר לחישוב Hash מתוכן הקובץ
const calculateFileHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default function CarDrawer({ carToEdit, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const isEdit = Boolean(carToEdit);
    const allCategories = useSelector(state => state.categories.categories) || [];

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!allCategories || allCategories.length === 0) {
            dispatch(fetchAllCategories());
        }
    }, [dispatch, allCategories]);

    useEffect(() => {
        if (carToEdit) {
            setFormData({
                brand: carToEdit.brand || '',
                model: carToEdit.model || '',
                licensePlate: carToEdit.licensePlate || '',
                year: carToEdit.year || '',
                categories: carToEdit.categories || [],
                seats: carToEdit.seats || '',
                transmission: carToEdit.transmission || 'automatic',
                fuelType: carToEdit.fuelType || 'gasoline',
                mileage: carToEdit.mileage || '',
                dailyPrice: carToEdit.dailyPrice || '',
                status: carToEdit.status || 'available',
                imageUrl: carToEdit.imageUrl || ''
            });
        } else {
            setFormData(INITIAL_STATE);
        }
        setErrors({});
    }, [carToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (errors[name]) 
            setErrors(prev => ({ ...prev, [name]: '' }));

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alertService.errorToast('נא לבחור קובץ תמונה תקין');
            return;
        }

        setUploadingImage(true);

        try {
            // שימוש בפונקציית החישוב
            const fileHash = await calculateFileHash(file);

            //  הוספת הנתונים ל-FormData
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            data.append('public_id', fileHash); // הגדרת השם של הקובץ לפי ה-Hash

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                data
            );

            if (res.data.secure_url) {
                setFormData(prev => ({ ...prev, imageUrl: res.data.secure_url }));
                alertService.success('התמונה הועלתה בהצלחה');
            }
        } catch (error) {
            const errorMessage = error || 'כשל בהעלאת התמונה לשרת';
            alertService.errorToast(errorMessage);
        } finally {
            setUploadingImage(false);
        }
    };



    const handleCategoryToggle = (categoryId) => {
        setFormData(prev => {
            const isSelected = prev.categories.includes(categoryId);
            return {
                ...prev,
                categories: isSelected
                    ? prev.categories.filter(id => id !== categoryId)
                    : [...prev.categories, categoryId]
            };
        });
    };

    const validateForm = () => {
        const newErrors = {};

        const brandErr = validateCarText(formData.brand, 'יצרן');
        if (brandErr) newErrors.brand = brandErr;

        const modelErr = validateCarText(formData.model, 'דגם');
        if (modelErr) newErrors.model = modelErr;

        const plateErr = validateLicensePlate(formData.licensePlate, formData.year);
        if (plateErr) newErrors.licensePlate = plateErr;

        const yearErr = validateCarYear(formData.year);
        if (yearErr) newErrors.year = yearErr;

        const seatsErr = validateSeats(formData.seats);
        if (seatsErr) newErrors.seats = seatsErr;

        const mileageErr = validateMileage(formData.mileage);
        if (mileageErr) newErrors.mileage = mileageErr;

        const priceErr = validateDailyPrice(formData.dailyPrice);
        if (priceErr) newErrors.dailyPrice = priceErr;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) 
            return;

        if (uploadingImage) {
            alertService.errorToast('יש להמתין לסיום העלאת התמונה');
            return;
        }

        setSubmitting(true);

        const dataToSend = {
            ...formData,
            brand: formData.brand.trim(),
            model: formData.model.trim(),
            licensePlate: formData.licensePlate.trim(),
            year: Number(formData.year),
            seats: Number(formData.seats),
            mileage: Number(formData.mileage),
            dailyPrice: Number(formData.dailyPrice),
            categories: formData.categories.filter(Boolean)
        };

        try {
            if (isEdit) {
                await dispatch(updateCar({ id: carToEdit._id, updatedFields: dataToSend })).unwrap();
                alertService.success('הרכב עודכן בהצלחה');
            } else {
                await dispatch(addNewCar(dataToSend)).unwrap();
                alertService.success('הרכב נוסף בהצלחה');
            }
            onSuccess();
        } catch (error) {
            alertService.errorToast(error || 'התרחשה שגיאה בשמירת הנתונים');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>{isEdit ? 'עריכת רכב' : 'הוספת רכב חדש'}</h3>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    {/* יצרן */}
                    <div className={styles.formGroup}>
                        <label>יצרן *</label>
                        <input
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={`${styles.inputField} ${errors.brand ? 'input-error' : ''}`}
                        />
                        {errors.brand && <span className="error-text">{errors.brand}</span>}
                    </div>

                    {/* דגם */}
                    <div className={styles.formGroup}>
                        <label>דגם *</label>
                        <input
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={`${styles.inputField} ${errors.model ? 'input-error' : ''}`}
                        />
                        {errors.model && <span className="error-text">{errors.model}</span>}
                    </div>

                    {/* לוחית רישוי */}
                    <div className={styles.formGroup}>
                        <label>לוחית רישוי *</label>
                        <input
                            name="licensePlate"
                            value={formData.licensePlate}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={`${styles.inputField} ${errors.licensePlate ? 'input-error' : ''}`}
                        />
                        {errors.licensePlate && <span className="error-text">{errors.licensePlate}</span>}
                    </div>

                    {/* שנה */}
                    <div className={styles.formGroup}>
                        <label>שנה *</label>
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={`${styles.inputField} ${errors.year ? 'input-error' : ''}`}
                        />
                        {errors.year && <span className="error-text">{errors.year}</span>}
                    </div>

                    {/* מספר מקומות */}
                    <div className={styles.formGroup}>
                        <label>מספר מקומות *</label>
                        <input
                            type="number"
                            name="seats"
                            value={formData.seats}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={`${styles.inputField} ${errors.seats ? 'input-error' : ''}`}
                        />
                        {errors.seats && <span className="error-text">{errors.seats}</span>}
                    </div>

                    {/* קילומטראז' */}
                    <div className={styles.formGroup}>
                        <label>קילומטראז' *</label>
                        <input
                            type="number"
                            name="mileage"
                            value={formData.mileage}
                            onChange={handleChange}
                            className={`${styles.inputField} ${errors.mileage ? 'input-error' : ''}`}
                        />
                        {errors.mileage && <span className="error-text">{errors.mileage}</span>}
                    </div>

                    {/* מחיר ליום */}
                    <div className={styles.formGroup}>
                        <label>מחיר ליום (₪) *</label>
                        <input
                            type="number"
                            name="dailyPrice"
                            value={formData.dailyPrice}
                            onChange={handleChange}
                            className={`${styles.inputField} ${errors.dailyPrice ? 'input-error' : ''}`}
                        />
                        {errors.dailyPrice && <span className="error-text">{errors.dailyPrice}</span>}
                    </div>

                    {/* העלאת תמונה */}
                    <div className={styles.formGroup}>
                        <label>תמונת הרכב</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className={styles.inputField}
                        />
                        {uploadingImage && <p className={styles.uploadStatus}>מעלה תמונה, אנא המתן...</p>}
                        
                        {formData.imageUrl && (
                            <div className={styles.previewContainer}>
                                <img
                                    src={formData.imageUrl}
                                    alt="תצוגה מקדימה"
                                    className={styles.previewImage}
                                />
                            </div>
                        )}
                    </div>

                    {/* תיבת הילוכים */}
                    <div className={styles.formGroup}>
                        <label>תיבת הילוכים</label>
                        <select
                            name="transmission"
                            value={formData.transmission}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={styles.inputField}
                        >
                            <option value="automatic">אוטומטית</option>
                            <option value="manual">ידנית</option>
                        </select>
                    </div>

                    {/* סוג דלק */}
                    <div className={styles.formGroup}>
                        <label>סוג דלק</label>
                        <select
                            name="fuelType"
                            value={formData.fuelType}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={styles.inputField}
                        >
                            <option value="gasoline">בנזין</option>
                            <option value="diesel">דיזל</option>
                            <option value="hybrid">היברידי</option>
                            <option value="electric">חשמלי</option>
                        </select>
                    </div>

                    {/* סטטוס */}
                    <div className={styles.formGroup}>
                        <label>סטטוס</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={styles.inputField}
                        >
                            <option value="available">זמין</option>
                            <option value="rented">מושכר</option>
                            <option value="maintenance">בתחזוקה</option>
                        </select>
                    </div>

                    {/* קטגוריות */}
                    <div className={styles.formGroup}>
                        <label>שיוך לקטגוריות:</label>
                        <div className={styles.categoriesWrapper}>
                            {allCategories.map(cat => (
                                <label key={cat._id} className={styles.categoryItem}>
                                    <input
                                        type="checkbox"
                                        checked={formData.categories?.includes(cat._id)}
                                        onChange={() => handleCategoryToggle(cat._id)}
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            ביטול
                        </button>
                        <button type="submit" disabled={submitting || uploadingImage} className={styles.submitBtn}>
                            {submitting ? 'שומר...' : (isEdit ? 'עדכן רכב' : 'הוסף רכב')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}