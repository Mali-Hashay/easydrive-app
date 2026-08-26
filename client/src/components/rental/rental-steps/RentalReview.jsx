import dayjs from "dayjs";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./RentalReview.module.css";

export default function RentalReview(props) {
    const { onNext } = props;
    const { pickupDate, pickupTime, returnDate, returnTime } = useSelector(state => state.rentalFlow.searchParams);
    const selectedCar = useSelector(state => state.rentalFlow.selectedCar);
   
    const duration = useMemo(() => {
        if (!pickupDate || !pickupTime || !returnDate || !returnTime) 
            return 0;

        const start = dayjs(`${pickupDate}T${pickupTime}`);
        const end = dayjs(`${returnDate}T${returnTime}`);

        return Math.ceil(end.diff(start, 'day', true));
    }, [pickupDate, pickupTime, returnDate, returnTime]);

    if (!selectedCar) return null;

    return (
        <div className={styles.container}>
            <h2 className={styles.mainTitle}>פרטי ההזמנה</h2>
            
            <div className={styles.detailsCard}>
                
                <div className={styles.infoSection}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>איסוף:</span>
                        <p className={styles.infoValue}>
                            {dayjs(pickupDate).format('DD/MM/YYYY')} בשעה {pickupTime}
                        </p>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>החזרה:</span>
                        <p className={styles.infoValue}>
                            {dayjs(returnDate).format('DD/MM/YYYY')} בשעה {returnTime}
                        </p>
                    </div>
                    
                    <div className={styles.totalDays}>
                       מספר ימי השכרה סה''כ: {duration}
                    </div>

                    <div className={styles.includesList}>
                        <p>✓ כולל מע"מ</p>
                        <p>✓ כולל כיסוי ביטוחי בסיסי</p>
                        <p>✓ קילומטראז' ללא הגבלה</p>
                    </div>
                </div>
            </div>
            
            <div className={styles.buttonContainer}>
                <button onClick={() => onNext()} className={styles.nextButton}>
                    המשך לשלב הבא
                </button>
            </div>
        </div>
    );
}