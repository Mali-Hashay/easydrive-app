import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewRental } from '../../../store/slices/rentalSlice';
import styles from './Payment.module.css';
import { calculateTotalDays, calculateTotalPrice } from '../../../utils/dateUtils';
import {
  validateName,
  validateCreditCard,
  validateExpiryDate,
  validateCVV
} from '../../../utils/validators';

export default function PaymentStep(props) {
  const { onBack, onSubmit } = props;
  const dispatch = useDispatch();
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const searchParams = useSelector(state => state.rentalFlow.searchParams);
  const { pickupDate, pickupTime, returnDate, returnTime } = searchParams;
  const selectedCar = useSelector(state => state.rentalFlow.selectedCar);
  const personalDetails = useSelector(state => state.rentalFlow.personalDetails);

  const totalDays = calculateTotalDays(pickupDate, pickupTime, returnDate, returnTime);
  const totalPrice = calculateTotalPrice(pickupDate, pickupTime, returnDate, returnTime, selectedCar?.dailyPrice);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length > 2) 
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else if (name === 'cardNumber' || name === 'cvv') {
      value = value.replace(/\D/g, '');
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    const validationErrors = {
      cardName: validateName(paymentDetails.cardName, 'שם בעל הכרטיס'),
      cardNumber: validateCreditCard(paymentDetails.cardNumber),
      expiry: validateExpiryDate(paymentDetails.expiry),
      cvv: validateCVV(paymentDetails.cvv)
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

    setErrors({});
    setIsProcessing(true);

    const fullPickupDate = dayjs(`${pickupDate} ${pickupTime || '00:00'}`).toISOString();
    const fullReturnDate = dayjs(`${returnDate} ${returnTime || '00:00'}`).toISOString();

    const rentalData = {
      carId: selectedCar._id,
      pickupDate: fullPickupDate,
      plannedReturnDate: fullReturnDate,
      actualReturnDate: null,
      driversBirthDate: personalDetails.birthDate, 
      driversIdNumber: personalDetails.idNumber,      
      licenseNumber: personalDetails.licenseNumber,
      totalPrice: totalPrice,
      paymentInfo: {
        cardName: paymentDetails.cardName,
        cardNumber: paymentDetails.cardNumber, 
        expiry: paymentDetails.expiry,
        cvv: paymentDetails.cvv
      }
    };
    
    try {
      const savedRental = await dispatch(addNewRental(rentalData)).unwrap();
      if (onSubmit) {
        onSubmit(savedRental._id);
      }
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setGeneralError(err || 'אירעה שגיאה במהלך ביצוע ההזמנה, אנא נסה שנית.');
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.summaryBox}>
        <h3 className={styles.summaryTitle}>תקציר ההזמנה</h3>
        <p className={styles.summaryText}><b>רכב נבחר:</b> {selectedCar?.brand} {selectedCar?.model}</p>
        <p className={styles.summaryText}>
          <b>תאריך איסוף:</b> {dayjs(pickupDate).format('DD/MM/YYYY')} בשעה {pickupTime}
        </p>
        <p className={styles.summaryText}>
          <b>תאריך החזרה:</b> {dayjs(returnDate).format('DD/MM/YYYY')} בשעה {returnTime}
        </p>
        <p className={styles.summaryText}><b>סה"כ ימי שכירות:</b> {totalDays} ימים</p>
        <hr className={styles.divider} />
        <p className={styles.totalPrice}>סך הכל לתשלום: ₪{totalPrice}</p>
      </div>

      <h2 className={styles.mainTitle}>פרטי תשלום</h2>
      
      {generalError && <div className={styles.errorBox}>{generalError}</div>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>שם בעל הכרטיס</label>
          <input 
            className={`${styles.input} ${errors.cardName ? 'input-error' : ''}`}
            type="text" 
            name="cardName" 
            value={paymentDetails.cardName} 
            onChange={handleChange} 
            placeholder="ישראל ישראלי"
          />
          {errors.cardName && (
            <span className="error-text">{errors.cardName}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>מספר כרטיס אשראי</label>
          <input 
            className={`${styles.input} ${errors.cardNumber ? 'input-error' : ''}`}
            type="text" 
            name="cardNumber" 
            maxLength="16"
            value={paymentDetails.cardNumber} 
            onChange={handleChange} 
            placeholder="0000-0000-0000-0000"
          />
          {errors.cardNumber && (
            <span className="error-text">{errors.cardNumber}</span>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>תוקף (MM/YY)</label>
            <input 
              className={`${styles.input} ${errors.expiry ? 'input-error' : ''}`}
              type="text" 
              name="expiry" 
              maxLength="5"
              value={paymentDetails.expiry} 
              onChange={handleChange} 
              placeholder="12/26"
            />
            {errors.expiry && (
              <span className="error-text">{errors.expiry}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>CVV</label>
            <input 
              className={`${styles.input} ${errors.cvv ? 'input-error' : ''}`}
              type="text" 
              name="cvv" 
              maxLength="4"
              value={paymentDetails.cvv} 
              onChange={handleChange} 
              placeholder="123"
            />
            {errors.cvv && (
              <span className="error-text">{errors.cvv}</span>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button 
            type="button" 
            className={styles.backBtn} 
            onClick={onBack} 
            disabled={isProcessing}
          >
            חזור לשלב הקודם
          </button>
          
          <button 
            type="submit" 
            className={styles.nextBtn} 
            disabled={isProcessing}
          >
            {isProcessing ? 'מעבד תשלום...' : 'בצע תשלום'}
          </button>
        </div>

      </form>
    </div>
  );
}