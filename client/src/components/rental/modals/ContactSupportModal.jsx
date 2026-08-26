import React, { useState, useEffect } from 'react';
import { alertService } from '../../../utils/alertService';
import styles from './ContactSupportModal.module.css';

export default function ContactSupportModal(props) {
  const { isOpen, onClose, rental } = props;
  const [reason, setReason] = useState('general_question');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rental?.status === 'overdue') 
      setReason('urgent_overdue');
    else 
      setReason('general_question');
  }, [rental]);

  if (!isOpen || !rental) return null;

  const isOverdue = rental.status === 'overdue';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alertService.success(`הפנייה להזמנה #${rental._id.slice(-6)} נשלחה בהצלחה!`);
      setMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>
          {isOverdue ? 'פנייה דחופה - חריגה מזמן השכרה' : 'פנייה לצוות התמיכה'}
        </h3>
        
        <p className={styles.subtitle}>
          רכב: <strong>{rental.carId?.brand} {rental.carId?.model}</strong> (קוד הזמנה: #{rental._id.slice(-6)})
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>סיבת הפנייה:</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className={styles.input}>
              {isOverdue && (
                <option value="urgent_overdue">תיאום החזרה דחופה (חריגה בזמנים)</option>
              )}
              <option value="early_return">תיאום החזרת רכב מוקדמת</option>
              <option value="technical_issue">דיווח על תקלה / פגיעה ברכב</option>
              <option value="general_question">שאלה כללית בנושא השכרה זו</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>פירוט נוסף:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isOverdue ? "/ פירוט סיבת האיחור והחזרה מתוכננת..." : "/  פרטים נוספים..."}
              rows={3}
              className={styles.textarea}
            />
          </div>

          <div className={styles.directContactInfo}>
            <p><strong>מענה טלפוני ישיר:</strong> <a href="tel:031234567">03-1234567</a></p>
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'שולח...' : 'שלח פנייה'}
            </button>
            <button type="button" onClick={onClose} disabled={isLoading} className={styles.cancelBtn}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}