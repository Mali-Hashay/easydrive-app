import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalDetails } from "../../../store/slices/rentalFlowSlice.js";
import dayjs from "dayjs";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    validateName,
    validateIdNumber,
    validateLicenseNumber,
    validatePhone,
    validateBirthDate
} from "../../../utils/validators.js";

import styles from "./PersonalDetails.module.css";

export default function PersonalDetails(props) {
    const { onNext, onBack } = props;
    const dispatch = useDispatch();

    const authUser = useSelector((state) => state.auth?.user);
    const existingDetails = useSelector((state) => state.rentalFlow?.personalDetails);

    const [details, setDetails] = useState({
        firstName: existingDetails?.firstName || authUser?.firstName || '',
        lastName: existingDetails?.lastName || authUser?.lastName || '',
        idNumber: existingDetails?.idNumber || authUser?.idNumber || '',
        phoneNumber: existingDetails?.phoneNumber || authUser?.phoneNumber || '',
        birthDate: existingDetails?.birthDate || authUser?.birthDate || '',
        licenseNumber: existingDetails?.licenseNumber || authUser?.licenseNumber || ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (authUser) {
            setDetails((prev) => ({
                ...prev,
                firstName: prev.firstName || authUser.firstName || '',
                lastName: prev.lastName || authUser.lastName || '',
                idNumber: prev.idNumber || authUser.idNumber || '',
                phoneNumber: prev.phoneNumber || authUser.phoneNumber || '',
                birthDate: prev.birthDate || authUser.birthDate || '',
                licenseNumber: prev.licenseNumber || authUser.licenseNumber || ''
            }));
        }
    }, [authUser]);

    const { firstName, lastName, idNumber, phoneNumber, birthDate, licenseNumber } = details;

    const maxAllowedBirthDate = dayjs().subtract(17, 'year').subtract(9, 'month').toDate();
    const minAllowedBirthDate = dayjs().subtract(80, 'year').toDate();

    const handleChange = (e) => {
        let { name, value } = e.target;
        
        if (name === 'idNumber' || name === 'licenseNumber') {
            value = value.replace(/\D/g, '');
        }

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }

        setDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
        
        if (errors.birthDate) {
            setErrors((prev) => ({
                ...prev,
                birthDate: ''
            }));
        }

        setDetails((prev) => ({
            ...prev,
            birthDate: formattedDate
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = {
            firstName: validateName(firstName, 'שם פרטי'),
            lastName: validateName(lastName, 'שם משפחה'),
            idNumber: validateIdNumber(idNumber),
            licenseNumber: validateLicenseNumber(licenseNumber),
            phoneNumber: validatePhone(phoneNumber),
            birthDate: validateBirthDate(birthDate)
        };

        const activeErrors = {};
        Object.keys(validationErrors).forEach((key) => {
            if (validationErrors[key]) {
                activeErrors[key] = validationErrors[key];
            }
        });

        if (Object.keys(activeErrors).length > 0) {
            setErrors(activeErrors);
            return;
        }

        dispatch(setPersonalDetails(details));
        onNext();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.mainTitle}>פרטי הנהג השוכר</h2>
            <p className={styles.subtitle}>
                אנא מלא את פרטי הנהג. אם הינך מחובר, חלק מהפרטים התמלאו אוטומטית.
            </p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>שם פרטי</label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.firstName ? 'input-error' : ''}`}
                        />
                        {errors.firstName && (
                            <span className="error-text">{errors.firstName}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>שם משפחה</label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.lastName ? 'input-error' : ''}`}
                        />
                        {errors.lastName && (
                            <span className="error-text">{errors.lastName}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>מספר תעודת זהות</label>
                        <input
                            type="text"
                            name="idNumber"
                            value={idNumber}
                            maxLength="9"
                            onChange={handleChange}
                            className={`${styles.input} ${errors.idNumber ? 'input-error' : ''}`}
                        />
                        {errors.idNumber && (
                            <span className="error-text">{errors.idNumber}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>מספר רישיון נהיגה</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            value={licenseNumber}
                            maxLength="9"
                            onChange={handleChange}
                            placeholder="123456789"
                            className={`${styles.input} ${errors.licenseNumber ? 'input-error' : ''}`}
                        />
                        {errors.licenseNumber && (
                            <span className="error-text">{errors.licenseNumber}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>מספר טלפון</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.phoneNumber ? 'input-error' : ''}`}
                        />
                        {errors.phoneNumber && (
                            <span className="error-text">{errors.phoneNumber}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>תאריך לידה</label>
                        <DatePicker
                            selected={birthDate ? new Date(birthDate) : null}
                            onChange={handleDateChange}
                            minDate={minAllowedBirthDate}
                            maxDate={maxAllowedBirthDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                            className={`${styles.input} ${errors.birthDate ? 'input-error' : ''}`}
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                        />
                        {errors.birthDate && (
                            <span className="error-text">{errors.birthDate}</span>
                        )}
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button type="button" onClick={onBack} className={styles.backBtn}>
                        חזור
                    </button>
                    <button type="submit" className={styles.nextBtn}>
                        המשך לשלב הבא
                    </button>
                </div>
            </form>
        </div>
    );
}