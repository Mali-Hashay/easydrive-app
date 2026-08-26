import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setSearchParams as setReduxSearchParams } from "../../store/slices/rentalFlowSlice";
import RentalDateAndTime from "../../components/rental/RentalDateAndTime";
import styles from "./SearchCar.module.css";
import FAQ from "../../components/common/FAQ";
import { calculateTotalDays } from "../../utils/dateUtils";
import { validateRentalDates } from "../../utils/validators"; 

export default function SearchCar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useState({
        pickupDate: '',
        pickupTime: '',
        returnDate: '',
        returnTime: ''
    });

    const [errors, setErrors] = useState({});

    const { pickupDate, pickupTime, returnDate, returnTime } = searchParams;

    let totalDays = 0;
    if (pickupDate && pickupTime && returnDate && returnTime) 
        totalDays = calculateTotalDays(pickupDate, pickupTime, returnDate, returnTime);

    const handleChangeField = (name, value) => {
        setSearchParams(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'pickupTime' && prev.pickupDate === prev.returnDate && prev.returnTime && prev.returnTime <= value
                ? { returnTime: '' }
                : {})
        }));

        if (errors[name] || errors.plannedReturnDate) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
                plannedReturnDate: '',
            }));
        }
    };

    const validateForm = () => {
        const validationError = validateRentalDates(pickupDate, pickupTime, returnDate, returnTime);

        if (validationError) {
            setErrors(validationError);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleFindCar = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        dispatch(setReduxSearchParams(searchParams));
        navigate('/search-results');   
    };

    const today = dayjs().format('YYYY-MM-DD');

    return (
        <div className={styles.container}>
            <form onSubmit={handleFindCar} className={styles.searchForm} noValidate>
                
                {/* תאריך איסוף */}
                <div className={styles.inputGroup}>
                    <RentalDateAndTime
                        dateLabel="תאריך איסוף"
                        dateValue={pickupDate}
                        onDateChange={(val) => handleChangeField('pickupDate', val)}
                        minDate={today}
                        inputClassName={styles.input} 
                        mode="date"
                        hasError={!!errors.pickupDate}
                    />
                    {errors.pickupDate && (
                        <p className={styles.errorText}>
                            {errors.pickupDate}
                        </p>
                    )}
                </div>

                {/* שעת איסוף */}
                <div className={styles.inputGroup}>
                    <RentalDateAndTime
                        timeLabel="שעת איסוף"
                        timeValue={pickupTime}
                        dateValue={pickupDate}
                        onTimeChange={(val) => handleChangeField('pickupTime', val)}
                        inputClassName={styles.input} 
                        mode="time"
                        hasError={!!errors.pickupTime}
                    />
                    {errors.pickupTime && (
                        <p className={styles.errorText}>
                            {errors.pickupTime}
                        </p>
                    )}
                </div>

                {/* תאריך החזרה */}
                <div className={styles.inputGroup}>
                    <RentalDateAndTime
                        dateLabel="תאריך החזרה"
                        dateValue={returnDate}
                        onDateChange={(val) => handleChangeField('returnDate', val)}
                        minDate={pickupDate || today}
                        inputClassName={styles.input} 
                        mode="date"
                        hasError={!!(errors.returnDate || errors.plannedReturnDate)}
                    />
                    {(errors.returnDate || errors.plannedReturnDate) && (
                        <p className={styles.errorText}>
                            {errors.returnDate || errors.plannedReturnDate}
                        </p>
                    )}
                </div>

                {/* שעת החזרה */}
                <div className={styles.inputGroup}>
                    <RentalDateAndTime
                        timeLabel="שעת החזרה"
                        timeValue={returnTime}
                        dateValue={returnDate}
                        compareDate={pickupDate}
                        compareTime={pickupTime}
                        onTimeChange={(val) => handleChangeField('returnTime', val)}
                        inputClassName={styles.input} 
                        mode="time"
                        hasError={!!errors.returnTime}
                    />
                    {errors.returnTime && (
                        <p className={styles.errorText}>
                            {errors.returnTime}
                        </p>
                    )}
                </div>

                <button type="submit" className={styles.submitButton}>מצאו לי רכב</button>

                {totalDays > 0 && (
                    <p className={styles.summaryText}>{totalDays} ימי השכרה סה''כ</p>
                )}
            </form>

            <FAQ />
        </div>
    );
}