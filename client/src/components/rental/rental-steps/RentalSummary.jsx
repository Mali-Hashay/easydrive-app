import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearRentalFlow } from "../../../store/slices/rentalFlowSlice";
import dayjs from "dayjs";
import styles from "./RentalSummary.module.css";
import { calculateTotalDays, calculateTotalPrice } from "../../../utils/dateUtils";

import CheckIcon from '@mui/icons-material/Check';


export default function RentalSummary(props)
{
    console.log("RentalSummary render");
    const {rentalId} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {pickupDate,pickupTime, returnDate, returnTime} = useSelector(state => state.rentalFlow.searchParams);
    const selectedCar = useSelector(state=> state.rentalFlow.selectedCar);

    const totalPrice = calculateTotalPrice(pickupDate, pickupTime, returnDate, returnTime, selectedCar.dailyPrice);
    

    return(
        <>
        <div className={styles.container}>
            <div className={styles.checkIcon}>
                <CheckIcon fontSize="large" />
            </div>
            <h2 className={styles.successTitle}>ההזמנה הושלמה בהצלחה!</h2>
            <p className={styles.successMessage}>תודה שבחרת להשכיר רכב דרכנו.</p>
            
            <div className={styles.detailsBox}>
                <h4 className={styles.detailsTitle}>פרטי ההזמנה:</h4>
                <p><b>רכב:</b> {selectedCar?.brand} {selectedCar?.model}</p>
                <p><b>איסוף:</b> {dayjs(`${pickupDate}T${pickupTime}`).format('DD/MM/YYYY HH:mm')}</p>
                <p><b>החזרה:</b> {dayjs(`${returnDate}T${returnTime}`).format('DD/MM/YYYY HH:mm')}</p>
                <p><b>סה"כ לתשלום:</b> ₪{totalPrice}</p>
            </div>
            
            {rentalId && (
                <div className={styles.orderBox}>
                <p className={styles.orderLabel}>מספר ההזמנה שלך הוא:</p>
                <h3 className={styles.orderValue}>{rentalId}</h3>
                <small>אנא שמור מספר זה למעקב ובירורים.</small>
                </div>
            )}

            <div className={styles.buttonContainer}>
                <button 
                onClick={() => {dispatch(clearRentalFlow());navigate('/')}}
                className={styles.homeBtn}
                >
                חזרה לעמוד הבית
                </button>
            </div>
        </div>
    </>
    )
}