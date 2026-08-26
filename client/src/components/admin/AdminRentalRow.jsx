import React, { useState } from 'react';
import styles from '../../pages/admin/AdminTable.module.css';
import dayjs from 'dayjs';
import { rentalStatuses } from '../../constants/translations';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { formatRentalDateTime } from '../../utils/dateUtils';

export default function AdminRentalRow(props) {
    const { rental, onEdit, onExtend, onChangeStatus, onComplete, onDelete } = props;
    const currentStatus = rentalStatuses[rental.status];

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const isActiveRental = rental.status === 'active' || rental.status === 'overdue';

    return (
        <tr className={styles.row}>
            <td className={`${styles.cell} ${styles.primaryText}`}>
                {rental.clientId ? `${rental.clientId.firstName} ${rental.clientId.lastName}` : 'לקוח לא מזוהה'}
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    ת.ז: {rental.driversIdNumber}
                </div>
            </td>

            <td className={styles.cell}>
                {rental.carId?.brand} {rental.carId?.model}
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    רישוי: {rental.carId?.licensePlate || '—'}
                </div>
            </td>

            <td className={styles.cell}>
                {formatRentalDateTime(rental.pickupDate)}
            </td>

            <td className={styles.cell}>
                {formatRentalDateTime(rental.plannedReturnDate)}
            </td>

            <td className={`${styles.cell} ${styles.primaryText}`}>
                ₪{rental.totalPrice}
            </td>

            <td className={styles.cell}>
                <span className={`${styles.statusBadge} ${styles[currentStatus?.class]}`}>
                    {currentStatus || rental.status}
                </span>
            </td>

            <td className={styles.cell}>
                <div className={styles.actions}>
                    
                    <button 
                        onClick={() => onEdit(rental)} 
                        className={`${styles.button} ${styles.editBtn}`}
                    >
                        <EditIcon fontSize="small" /> ערוך
                    </button>

                    {rental.status !== 'deleted' && (
                        <button 
                            onClick={() => onDelete(rental)}
                            disabled={isActiveRental}
                            className={`${styles.button} ${styles.deleteBtn}`}
                            title={isActiveRental ? "לא ניתן למחוק השכרה פעילה" : "מחק השכרה"}
                        >
                            <DeleteIcon fontSize="small" /> מחק
                        </button>
                    )}

                    <IconButton onClick={handleMenuOpen} size="small">
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        slotProps={{
                            paper: {
                                elevation: 4,
                                style: {
                                    borderRadius: '10px',
                                    minWidth: '190px',
                                    boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
                                }
                            }
                        }}
                    >
                        {['active', 'confirmed', 'overdue'].includes(rental.status) && (
                            <MenuItem onClick={() => { handleMenuClose(); onExtend(rental); }}>
                                הארך השכרה
                            </MenuItem>
                        )}

                        {(rental.status === 'active' || rental.status === 'confirmed') && (
                            <MenuItem onClick={() => { handleMenuClose(); onComplete(rental._id); }}>
                                סמן כהושלם
                            </MenuItem>
                        )}

                        <MenuItem onClick={() => { handleMenuClose(); onChangeStatus(rental._id, 'confirmed'); }}>
                            שנה סטטוס: מאושרת
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); onChangeStatus(rental._id, 'active'); }}>
                            שנה סטטוס: פעילה
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); onChangeStatus(rental._id, 'overdue'); }}>
                            שנה סטטוס: איחור
                        </MenuItem>
                    </Menu>

                </div>
            </td>
        </tr>
    );
}