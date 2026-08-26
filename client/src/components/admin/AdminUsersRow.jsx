import React from 'react';
import styles from '../../pages/admin/AdminTable.module.css';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AdminUsersRow(props) {
    const { user, onChangeRole, onChangeStatus, onDelete, onEdit } = props;

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        if (newRole) {
            onChangeRole(user._id, newRole);
        }
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
                <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.active : styles.blocked}`}>
                    {user.status === 'active' ? 'פעיל' : 'חסום'}
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

                    <button 
                        onClick={() => onDelete(user._id)}
                        className={`${styles.button} ${styles.deleteBtn}`}
                    >
                        <DeleteIcon fontSize="small" /> מחק
                    </button>
                </div>
            </td>
        </tr>
    );
}