import React from 'react';
import { carStatuses } from '../../constants/translations';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../../pages/admin/AdminTable.module.css';

export default function AdminCarRow(props) {
    const { car, futureBookingsCount, onEdit, onDelete } = props;
    const { brand, model, seats, dailyPrice, status, imageUrl } = car;

    const isRented = status === 'rented';
    const hasFutureBookings = futureBookingsCount > 0;
    const cannotDelete = isRented || hasFutureBookings;

    let deleteTitle = "מחק רכב";
    if (isRented)
        deleteTitle = "לא ניתן למחוק רכב בסטטוס מושכר";
    else if (hasFutureBookings)
        deleteTitle = `לרכב יש ${futureBookingsCount} הזמנות עתידיות, יש לבטל אותן לפני מחיקה`;

    return (
        <tr className={styles.row}>
            <td className={styles.cell}>
                <img src={imageUrl} alt={`${brand} ${model}`} className={styles.image} />
            </td>
            
            <td className={`${styles.cell} ${styles.primaryText}`}>
                {brand} {model}
            </td>
            
            <td className={styles.cell}>{seats}</td>
            
            <td className={styles.cell}>₪{dailyPrice}</td>

            <td className={styles.cell}>{carStatuses[status]}</td>
            
            <td className={styles.cell}>
                <div className={styles.actions}>
                    <button 
                        onClick={() => onEdit(car)} 
                        className={`${styles.button} ${styles.editBtn}`}
                    >
                        <EditIcon fontSize="small" /> ערוך
                    </button>
                    
                    <button 
                        onClick={() => onDelete(car._id)}
                        disabled={cannotDelete}
                        className={`${styles.button} ${styles.deleteBtn} ${cannotDelete ? styles.disabledBtn : ''}`}
                        title={deleteTitle}
                    >
                        <DeleteIcon fontSize="small" /> מחק
                    </button>
                </div>
            </td>
        </tr>
    );
}