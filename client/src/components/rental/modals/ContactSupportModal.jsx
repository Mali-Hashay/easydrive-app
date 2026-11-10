import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { alertService } from '../../../utils/alertService';
import { submitContactForm } from '../../../api/contactApi';
import styles from './ContactSupportModal.module.css';

// the text shown for each reason, used both in the select and in the message sent to the admin
const REASON_LABELS = {
  urgent_overdue: 'תיאום החזרה דחופה (חריגה בזמנים)',
  early_return: 'תיאום החזרת רכב מוקדמת',
  technical_issue: 'דיווח על תקלה / פגיעה ברכב',
  general_question: 'שאלה כללית בנושא השכרה זו'
};

export default function ContactSupportModal(props) {
  const { isOpen, onClose, rental } = props;
  const [reason, setReason] = useState('general_question');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (rental?.status === 'overdue') 
      setReason('urgent_overdue');
    else 
      setReason('general_question');
  }, [rental]);

  if (!isOpen || !rental) return null;

  const isOverdue = rental.status === 'overdue';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const orderCode = rental._id.slice(-6);
    const fullMessage = `הזמנה #${orderCode} | סיבה: ${REASON_LABELS[reason]}\n${message}`;

    try {
      await submitContactForm({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phoneNumber,
        message: fullMessage
      });
      alertService.success(`הפנייה להזמנה #${orderCode} נשלחה בהצלחה!`);
      setMessage('');
      onClose();
    } catch (err) {
      // the modal stays open so the user doesn't lose what they wrote
      alertService.errorToast(err.message);
    } finally {
      setIsLoading(false);
    }
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
                <option value="urgent_overdue">{REASON_LABELS.urgent_overdue}</option>
              )}
              <option value="early_return">{REASON_LABELS.early_return}</option>
              <option value="technical_issue">{REASON_LABELS.technical_issue}</option>
              <option value="general_question">{REASON_LABELS.general_question}</option>
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