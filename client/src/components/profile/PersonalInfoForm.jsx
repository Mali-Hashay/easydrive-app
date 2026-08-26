import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../store/slices/authSlice";
import { alertService } from "../../utils/alertService";
import {
  validateName,
  validatePhone,
  validateIdNumber,
  validateLicenseNumber,
  validateBirthDate
} from "../../utils/validators"; 
import styles from "./PersonalInfoForm.module.css";

export default function PersonalInfoForm(props) {
  const { onUpdate } = props;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    idNumber: '',
    licenseNumber: '',
    birthDate: ''
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        idNumber: currentUser.idNumber || '',
        licenseNumber: currentUser.licenseNumber || '',
        birthDate: (currentUser?.birthDate && dayjs(currentUser.birthDate).isValid())
          ? dayjs(currentUser.birthDate).format('YYYY-MM-DD')
          : ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
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

    const phoneErr = validatePhone(formData.phoneNumber);
    if (phoneErr) newErrors.phoneNumber = phoneErr;

    const idErr = validateIdNumber(formData.idNumber);
    if (idErr) newErrors.idNumber = idErr;

    const licenseErr = validateLicenseNumber(formData.licenseNumber);
    if (licenseErr) newErrors.licenseNumber = licenseErr;

    const birthErr = validateBirthDate(formData.birthDate);
    if (birthErr) newErrors.birthDate = birthErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { email, ...updateData } = formData;

      await dispatch(updateUserProfile(updateData)).unwrap();
      alertService.success('הפרטים שונו בהצלחה!');

      if (onUpdate) onUpdate();
    } catch (err) {
      alertService.errorToast('אירעה שגיאה בעת שינוי הפרטים');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>עדכון פרטים אישיים</h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* שם פרטי */}
        <div className={styles.formGroup}>
          <label className={styles.label}>שם פרטי</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`${styles.input} ${errors.firstName ? 'input-error' : ''}`}
          />
          {errors.firstName && (
            <p className="error-text">{errors.firstName}</p>
          )}
        </div>

        {/* שם משפחה */}
        <div className={styles.formGroup}>
          <label className={styles.label}>שם משפחה</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`${styles.input} ${errors.lastName ? 'input-error' : ''}`}
          />
          {errors.lastName && (
            <p className="error-text">{errors.lastName}</p>
          )}
        </div>

        {/* אימייל */}
        <div className={styles.formGroup}>
          <label className={styles.label}>אימייל</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className={styles.input}
            disabled
          />
        </div>

        {/* מספר טלפון */}
        <div className={styles.formGroup}>
          <label className={styles.label}>מספר טלפון</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`${styles.input} ${errors.phoneNumber ? 'input-error' : ''}`}
          />
          {errors.phoneNumber && (
            <p className="error-text">{errors.phoneNumber}</p>
          )}
        </div>

        {/* תעודת זהות */}
        <div className={styles.formGroup}>
          <label className={styles.label}>תעודת זהות</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            className={`${styles.input} ${errors.idNumber ? 'input-error' : ''}`}
          />
          {errors.idNumber && (
            <p className="error-text">{errors.idNumber}</p>
          )}
        </div>

        {/* מספר רישיון נהיגה */}
        <div className={styles.formGroup}>
          <label className={styles.label}>מספר רישיון נהיגה</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className={`${styles.input} ${errors.licenseNumber ? 'input-error' : ''}`}
          />
          {errors.licenseNumber && (
            <p className="error-text">{errors.licenseNumber}</p>
          )}
        </div>

        {/* תאריך לידה */}
        <div className={styles.formGroup}>
          <label className={styles.label}>תאריך לידה</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className={`${styles.input} ${errors.birthDate ? 'input-error' : ''}`}
          />
          {errors.birthDate && (
            <p className="error-text">{errors.birthDate}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'שומר שינויים...' : 'שמור שינויים'}
        </button>
      </form>
    </div>
  );
}