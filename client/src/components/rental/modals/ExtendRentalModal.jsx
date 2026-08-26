import React, { useState } from 'react';
import RentalDateAndTime from '../RentalDateAndTime';
import { validateExtensionDate } from '../../../utils/validators'; 
import styles from './ExtendRentalModal.module.css';

export default function ExtendRentalModal(props) {
  const { isOpen, onClose, onConfirm, minDate } = props;
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateExtensionDate(dateValue, timeValue, minDate);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const fullDateTime = `${dateValue}T${timeValue}`;
    onConfirm(fullDateTime);
  };

  const handleClose = () => {
    setError('');
    setDateValue('');
    setTimeValue('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>הארכת השכרה</h3>

        <form onSubmit={handleSubmit}>
          <RentalDateAndTime
            dateLabel="בחר תאריך החזרה חדש"
            timeLabel="בחר שעת החזרה חדשה"
            dateValue={dateValue}
            timeValue={timeValue}
            mode="both"
            onDateChange={(d) => { setDateValue(d); setError(''); }}
            onTimeChange={(t) => { setTimeValue(t); setError(''); }}
            minDate={minDate}
            hasError={!!error}
          />

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.confirmBtn}>
              אישור והארכה
            </button>
            <button type="button" onClick={handleClose} className={styles.cancelBtn}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}