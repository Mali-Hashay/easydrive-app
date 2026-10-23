import React, { useState } from 'react';
import dayjs from 'dayjs';
import RentalDateAndTime from '../RentalDateAndTime';
import { validateExtensionDate } from '../../../utils/validators'; 
import { toIsraelISOString } from '../../../utils/dateUtils'; 
import styles from './ExtendRentalModal.module.css';

export default function ExtendRentalModal(props) {
  const { isOpen, onClose, onConfirm, minDate } = props;
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [error, setError] = useState('');
  // blocks a second click while the request is still running
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // for an overdue rental the current return date is already in the past, so don't offer days before today
  const earliestDate = dayjs(minDate).isAfter(dayjs()) ? minDate : dayjs().format('YYYY-MM-DD');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateExtensionDate(dateValue, timeValue, minDate);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');

    const fullDateTime = toIsraelISOString(dateValue, timeValue);

    setIsSubmitting(true);
    try {
      await onConfirm(fullDateTime);
    } finally {
      setIsSubmitting(false);
    }
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
            minDate={earliestDate}
            hasError={!!error}
          />

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.actions}>
            <button type="submit" disabled={isSubmitting} className={styles.confirmBtn}>
              {isSubmitting ? 'מאריך...' : 'אישור והארכה'}
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