import React from 'react';
import { carStatuses } from '../../constants/translations';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../../pages/admin/AdminTable.module.css';

export default function AdminCarRow(props) {
    const { car, onEdit, onDelete } = props;
    const { brand, model, seats, dailyPrice, status, imageUrl } = car;

    const isRented = status === 'rented';

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
                        onClick={() => onDelete(car)} 
                        disabled={isRented}
                        className={`${styles.button} ${styles.deleteBtn} ${isRented ? styles.disabledBtn : ''}`}
                        title={isRented ? "לא ניתן למחוק רכב בסטטוס מושכר" : "מחק רכב"}
                    >
                        <DeleteIcon fontSize="small" /> מחק
                    </button>
                </div>
            </td>
        </tr>
    );
}