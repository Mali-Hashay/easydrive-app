import React from 'react';
import styles from '../../pages/admin/AdminTable.module.css';
import { userStatuses } from '../../utils/constants';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AdminUsersRow(props) {
    const { user, onChangeRole, onChangeStatus, onDelete, onEdit } = props;

    const getStatusStyle = () => {
        if (user.status === 'active') return styles.active;
        if (user.status === 'blocked') return styles.blocked;
        return styles.inactive; 
    };

    return (
        <tr className={styles.row}>
            <td className={`${styles.cell} ${styles.primaryText}`}>
                {user.firstName} {user.lastName}
            </td>

            <td className={styles.cell}>
                {user.email}
            </td>

            <td className={styles.cell}>
                {user.phoneNumber || '—'}
            </td>

            <td className={styles.cell}>
                {user.idNumber || '—'}
            </td>

            <td className={styles.cell}>
                {user.role === 'admin' ? 'מנהל' : 'לקוח'}
            </td>

            <td className={styles.cell}>
                <span className={`${styles.statusBadge} ${getStatusStyle()}`}>
                    {userStatuses[user.status] || 'לא פעיל'}
                </span>
            </td>

            <td className={styles.cell}>
                <div className={styles.actions}>
                    <button 
                        onClick={onEdit}
                        className={`${styles.button} ${styles.editBtn}`}
                    >
                        <EditIcon fontSize="small" /> ערוך
                    </button>

                    {user.status !== 'inactive' && (
                        <button 
                            onClick={() => onChangeStatus(user._id, user.status === 'active' ? 'blocked' : 'active')}
                            className={`${styles.button} ${user.status === 'active' ? styles.deleteBtn : styles.editBtn}`}
                        >
                            {user.status === 'active' ? (
                                <>
                                    <BlockIcon fontSize="small" /> חסום
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon fontSize="small" /> הפעל
                                </>
                            )}
                        </button>
                    )}

                    {user.status!=='inActive' && (
                        <button 
                            onClick={() => onDelete(user._id)}
                            className={`${styles.button} ${styles.deleteBtn}`}
                        >
                            <DeleteIcon fontSize="small" /> מחק
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}