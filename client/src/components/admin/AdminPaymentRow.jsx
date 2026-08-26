import React from 'react';
import styles from '../../pages/admin/AdminTable.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { paymentMethods, paymentStatuses } from '../../constants/translations';
import dayjs from 'dayjs';

export default function AdminPaymentsRow(props) {
    const { payment, onEdit } = props;

    return (
        <tr className={styles.row}>
            <td className={`${styles.cell} ${styles.primaryText}`}>
                {payment._id}
            </td>
            <td className={styles.cell}>
                {payment.rentalId}
            </td>
            <td className={`${styles.cell} ${styles.primaryText}`}>
                ₪{(payment.sum || payment.amount || 0).toLocaleString()}
            </td>
            <td className={styles.cell}>
                {paymentMethods[payment.paymentMethod] || 'לא צוין'}
            </td>
            <td className={styles.cell}>
                <span className={`${styles.statusBadge} ${styles[payment.status] || ''}`}>
                    {paymentStatuses[payment.status] || payment.status}
                </span>
            </td>
            <td className={styles.cell}>
                {payment.paidAt ? dayjs(payment.paidAt).format('DD/MM/YYYY') : '-'}
            </td>
            <td className={styles.cell}>
                <button 
                    type="button" 
                    className={`${styles.button} ${styles.editBtn}` } 
                    onClick={() => onEdit(payment)}
                >
                    <EditIcon fontSize="small" /> 
                    ערוך
                </button>
            </td>
        </tr>
    );
}