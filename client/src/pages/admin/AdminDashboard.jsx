import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRentals } from '../../store/slices/rentalSlice'; 
import { fetchUsers } from '../../store/slices/userSlice'; 

import styles from './AdminDashboard.module.css';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AddIcon from '@mui/icons-material/Add';
import { rentalStatuses } from '../../constants/translations';
import dayjs from 'dayjs';
import { formatRentalDate } from '../../utils/dateUtils';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { rentalsList, loading: rentalsLoading } = useSelector(state => state.rentals );
    const { users, loading: usersLoading } = useSelector(state => state.users);
    const user = useSelector(state=> state.auth.user);

    useEffect(() => {
        dispatch(fetchAllRentals());
        dispatch(fetchUsers()); 
    }, [dispatch]);

    // 5 ההשכרות האחרונות במערכת
    const recentRentals = [...rentalsList]
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 5);

    // חישוב מדדים דינמיים
    const totalRevenue = rentalsList
        .filter(r => r.status === 'completed' || r.status === 'paid')
        .reduce((sum, r) => sum + (r.totalPrice || r.sum || 0), 0);

    const activeRentalsCount = rentalsList.filter(r => r.status === 'active').length;
    const pendingRentalsCount = rentalsList.filter(r => r.status === 'pending').length;

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.welcomeHeader}>
                <h2>{`${user?.firstName}- מנהל מערכת`}</h2>
                <p>{`סקירה כללית של הנתונים במערכת נכון להיום- ${dayjs().format('DD/MM/YYYY')}`}</p>
            </div>

            {/* כרטיסי מדדים */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.iconWrapper}>
                        <AttachMoneyIcon />
                    </div>
                    <div>
                        <span className={styles.statTitle}>סה"כ הכנסות</span>
                        <h3 className={styles.statValue}>₪{totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconWrapper}>
                        <ShoppingBagIcon />
                    </div>
                    <div>
                        <span className={styles.statTitle}>השכרות פעילות</span>
                        <h3 className={styles.statValue}>{activeRentalsCount}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconWrapper} >
                        <PeopleIcon />
                    </div>
                    <div>
                        <span className={styles.statTitle}>משתמשים רשומים</span>
                        <h3 className={styles.statValue}>
                            {usersLoading ? '...' : users.length}
                        </h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconWrapper}>
                        <PendingActionsIcon />
                    </div>
                    <div>
                        <span className={styles.statTitle}>ממתינים לאישור</span>
                        <h3 className={styles.statValue}>{pendingRentalsCount}</h3>
                    </div>
                </div>
            </div>

            {/* פעולות מהירות */}
            <div className={styles.quickActionsSection}>
                <h3>פעולות מהירות</h3>
                <div className={styles.actionButtons}>

                    <button onClick={() => navigate('/admin/users', { state: { openAddDrawer: true } })}>
                        <AddIcon fontSize="small" /> הוספת משתמש
                    </button>
                    <button onClick={() => navigate('/admin/payments', { state: { openAddDrawer: true } })}>
                        <AddIcon fontSize="small" /> רישום תשלום
                    </button>
                    <button onClick={() => navigate('/admin/cars', { state: { openAddDrawer: true } })}>
                        <AddIcon fontSize="small" /> הוספת רכב 
                    </button>
                </div>
            </div>

            {/* טבלת השכרות אחרונות */}
            <div className={styles.recentSection}>
                <h3>השכרות אחרונות במערכת</h3>
                <div className={styles.tableContainer}>
                    {rentalsLoading ? (
                        <div>טוען השכרות...</div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>מזהה השכרה</th>
                                    <th>שם לקוח / מזהה</th>
                                    <th>תאריך</th>
                                    <th>סכום</th>
                                    <th>סטטוס</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRentals.length > 0 ? (
                                    recentRentals.map((rental) => (
                                        <tr key={rental._id}>
                                            <td>#{rental._id?.slice(-6)}</td>
                                            <td>
                                                {`${rental.clientId?.firstName || ''} ${rental.clientId?.lastName || ''}`.trim() || 'לקוח'}
                                            </td>
                                            <td>
                                                {formatRentalDate(rental.createdAt)}
                                            </td>
                                            <td>₪{rental.totalPrice }</td>
                                            <td>
                                                <span className={styles.badge}>{rentalStatuses[rental.status]}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>
                                            אין השכרות להצגה
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}