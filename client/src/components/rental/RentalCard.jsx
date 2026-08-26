import dayjs from 'dayjs';
import React, { useState } from 'react';
import { rentalStatuses } from '../../constants/translations';
import { useDispatch } from 'react-redux';
import { cancelClientRental, extendRentalTime } from '../../store/slices/rentalSlice';
import styles from './RentalCard.module.css';
import { alertService } from '../../utils/alertService';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExtendRentalModal from './modals/ExtendRentalModal';
import ContactSupportModal from './modals/ContactSupportModal';
import { formatRentalDate, formatRentalTime } from '../../utils/dateUtils';

export default function RentalCard(props) {
    const { rental } = props;
    const dispatch = useDispatch();
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const handleCancel = async () => {
        const isConfirmed = await alertService.confirm(
            'ביטול הזמנה',
            'האם את/ה בטוח/ה שברצונך לבטל את ההזמנה?',
            true
        );

        if (isConfirmed) {    
            try {
                await dispatch(cancelClientRental(rental._id)).unwrap();
                alertService.success('ההזמנה בוטלה ועברה להיסטוריית ההזמנות');
            } catch(err) {
                alertService.errorToast('שגיאה: לא ניתן לבטל את ההזמנה');
            }
        }
    };

    const handleConfirmExtend = async (newReturnDate) => {
        try {
            await dispatch(extendRentalTime({ rentalId: rental._id, newReturnDate })).unwrap();
            alertService.success('ההשכרה הוארכה בהצלחה!');
            setIsExtendOpen(false);
        } catch (err) {
            alertService.errorToast(err.message || 'לא ניתן להאריך את ההשכרה (ייתכן שהרכב תפוס)');
        }
    };
    
    const isCancellable = dayjs(rental.pickupDate).diff(dayjs(), 'hour') >= 24;

    const carImageSrc = rental.carId?.imageUrl;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    רכב: {rental.carId?.brand || 'לא ידוע'} {rental.carId?.model}
                </h3>
                {carImageSrc && (
                    <img 
                        src={carImageSrc} 
                        alt={`${rental.carId?.brand} ${rental.carId?.model}`} 
                        className={styles.carImage} 
                    />
                )}
            </div>
            
            <div className={styles.infoDetails}>
                <p className={styles.text}>
                    <strong>תאריך התחלה: </strong>
                    {formatRentalDate(rental.pickupDate)}
                    <span className={styles.timeLabel}> שעה: {formatRentalTime(rental.pickupDate)}</span>
                </p>
                <p className={styles.text}>
                    <strong>תאריך סיום: </strong>
                    {formatRentalDate(rental.plannedReturnDate)}
                    <span className={styles.timeLabel}>  שעה: {formatRentalTime(rental.plannedReturnDate)}</span>
                </p>
                <p className={styles.text}>
                    <strong>סטטוס:</strong> {rentalStatuses[rental.status] || rental.status}
                </p>
                <p className={`${styles.text} ${styles.price}`}>
                    <strong>מחיר כולל:</strong> <span className={styles.priceAmount}>₪{rental.totalPrice}</span>
                </p>
            </div>

            {rental.status === 'overdue' && (
                <div className={styles.overdueWarning}>
                    <WarningAmberIcon className={styles.warningIcon} />
                    <span>שים לב: זמן ההשכרה עבר! אנא הארך את ההשכרה או צור קשר מיידית.</span>
                </div>
            )}

            <div className={styles.actionsContainer}>
                {rental.status === 'confirmed' && (
                    <button 
                        onClick={handleCancel} 
                        disabled={!isCancellable}
                        title={!isCancellable ? "לא ניתן לבטל הזמנה פחות מ-24 שעות לפני מועד האיסוף" : ""}
                        className={styles.cancelButton}
                    >
                        ביטול השכרה
                    </button>
                )}
            
                {(['active','confirmed','overdue'].includes(rental.status)) && (
                    <div className={styles.activeButtonsGroup}>
                        <button 
                            onClick={() => setIsExtendOpen(true)} 
                            className={styles.extendButton}
                        >
                            הארכת השכרה
                        </button>
                        <button 
                            onClick={() => setIsContactOpen(true)} 
                            className={styles.contactButton}
                            disabled={rental.status === 'confirmed'}
                            title={rental.status === 'confirmed' ? "ההשכרה אינה פעילה עדיין" : ""}
                        >
                            צור קשר לסיום השכרה
                        </button>
                    </div>
                )}
            </div>

            <ExtendRentalModal
                isOpen={isExtendOpen}
                onClose={() => setIsExtendOpen(false)}
                onConfirm={handleConfirmExtend}
                minDate={rental.plannedReturnDate}
            />

            <ContactSupportModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                rental={rental}
            />
        </div>
    );
}