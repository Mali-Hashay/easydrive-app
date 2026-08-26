import React from 'react';
import styles from '../../pages/admin/AdminTable.module.css'
import dayjs from 'dayjs';

export default function ContactRow(props) 
{
    const { contact, onToggleStatus, onDelete } = props;
    return (
        <tr className={styles.row}>
           
            <td className={styles.cell}>
                {dayjs(contact.createdAt).format('DD/MM/YYYY')}
            </td>
            
            <td className={`${styles.cell} ${styles.primaryText}`}>
                {contact.name}
            </td>
            
            <td className={styles.cell}>{contact.email}</td>
            <td className={styles.cell}>{contact.phone || '—'}</td>
            
            <td className={styles.cell} title={contact.message}>
                {contact.message}
            </td>
            
            <td className={styles.cell}>
                <span className={`${styles.statusBadge} ${styles[contact.status]}`}>
                    {contact.status === 'pending' ? 'בטיפול' : 'טופל'}
                </span>
            </td>
            
            <td className={styles.cell}>
                <div className={styles.actions}>
                    <button 
                        onClick={() => onToggleStatus(contact._id, contact.status)}
                        className={`${styles.button} ${styles.editBtn}`}
                        style={{ whiteSpace: 'nowrap' }} 
                    >
                        {contact.status === 'pending' ? 'סמן כטופל' : 'החזר לטיפול'}
                    </button>
                
                    <button 
                        onClick={() => onDelete(contact._id)}
                        className={`${styles.button} ${styles.deleteBtn}`}
                    >
                        מחק
                    </button>
                </div>
            </td>
        </tr>
    );
}