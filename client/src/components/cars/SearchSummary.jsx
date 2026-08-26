import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./SearchSummary.module.css"; 

export default function SearchSummary() {
    const navigate = useNavigate(); 
    const { pickupDate, pickupTime, returnDate, returnTime } = useSelector(
        (state) => state.rentalFlow.searchParams || {}
    );

    // פונקציית עזר לפרמוט בטוח של התאריך
    const formatDate = (date) => {
        const parsedDate = dayjs(date);
        return parsedDate.isValid()? parsedDate.format('DD/MM/YYYY') : 'לא נבחר תאריך';
    };

    return (
        <div className={styles.summaryContainer}>
            <div className={styles.details}>
                <p className={styles.infoGroup}>
                    <b className={styles.label}>איסוף:</b> 
                    {formatDate(pickupDate)} {pickupTime || ''}
                </p>
                <p className={styles.infoGroup}>
                    <b className={styles.label}>החזרה:</b> 
                    {formatDate(returnDate)} {returnTime || ''}
                </p>
            </div>
            
            <button 
                className={styles.editButton} 
                onClick={() => navigate(-1)}
            >
                עריכה
            </button>
        </div>
    );
}