import { useEffect, useState } from "react";
import { alertService } from '../../utils/alertService.js';
import styles from './AdminTable.module.css';
import AdminRentalRow from '../../components/admin/AdminRentalRow.jsx';
import RentalDrawer from '../../components/admin/RentalDrawer.jsx';
import ExtendRentalModal from '../../components/rental/modals/ExtendRentalModal.jsx';
import { useDispatch, useSelector } from "react-redux";
import { extendRentalTime, removeRental, fetchAllRentals, adminCompleteRental, adminChangeRentalStatus, cancelExistingRental } from "../../store/slices/rentalSlice.js";
import dayjs from "dayjs";
import FilterTabs from "../../components/admin/FilterTabs.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

export default function AdminRentals() {
    const [filter, setFilter] = useState('all');
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);

    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [rentalToExtend, setRentalToExtend] = useState(null);

    const dispatch = useDispatch();
    const { rentalsList, loading } = useSelector(state => state.rentals);

    useEffect(() => {
        dispatch(fetchAllRentals());
    }, [dispatch]);

    const handleOpenAdd = () => {
        setSelectedRental(null);
        setIsDrawerOpen(true);
    };

    const handleEditRental = (rental) => {
        setSelectedRental(rental);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedRental(null);
    };

    const handleExtendRental = (rental) => {
        setRentalToExtend(rental);
        setIsExtendModalOpen(true);
    };

    const handleConfirmExtension = async (newReturnDate) => {
        if (!rentalToExtend) return;

        try {
            // newReturnDate is already converted to an ISO string  by the modal
            await dispatch(extendRentalTime({
                rentalId: rentalToExtend._id,
                newReturnDate
            })).unwrap();

            alertService.success('ההשכרה הוארכה בהצלחה!');
            setIsExtendModalOpen(false);
            setRentalToExtend(null);
            dispatch(fetchAllRentals());
        } catch (err) {
            console.error(err);
            alertService.errorToast(err || 'הארכת ההשכרה נכשלה');
        }
    };

    // keyed by the rental's current status: each one allows a single manual transition
    const statusChangeConfirmations = {
        'confirmed': { title: 'סימון איסוף', text: 'האם ברצונך לסמן שהלקוח אסף את הרכב? ההשכרה תהפוך לפעילה והרכב יעודכן כמושכר.', isDanger: false },
        'active': { title: 'הלקוח לא הגיע', text: 'האם לסמן שהלקוח לא הגיע לאיסוף? ההשכרה תבוטל והרכב יעודדכן כזמין.', isDanger: true },
        'completed': { title: 'ביטול סיום השכרה', text: 'האם לבטל את סיום ההשכרה? ההשכרה תחזור להיות פעילה והרכב יעודכן כמושכר.', isDanger: true }
    };

    const handleChangeStatus = async (rental, newStatus) => {
        const { title, text, isDanger } = statusChangeConfirmations[rental.status];
        const isConfirmed = await alertService.confirm(title, text, isDanger);
        if (!isConfirmed) return;

        try {
            await dispatch(adminChangeRentalStatus({ id: rental._id, status: newStatus })).unwrap();
            alertService.success('סטטוס ההזמנה עודכן בהצלחה');
        } catch (err) {
            alertService.errorToast(err || 'עדכון הסטטוס נכשל');
        }
    };

    const handleCompleteRental = async (id) => {
        try {
            await dispatch(adminCompleteRental(id)).unwrap();
            alertService.success('סטטוס ההזמנה עודכן בהצלחה!');
        } catch (err) {
            alertService.errorToast('עדכון הסטטוס נכשל');
        }
    };
    
    const handleCancelRental = async (rental) => {
        const isConfirmed = await alertService.confirm(
            'ביטול הזמנה',
            'האם לבטל את ההזמנה? לא ניתן לשחזר הזמנה שבוטלה.',
            true
        );
        if (!isConfirmed) return;

        try {
            await dispatch(cancelExistingRental(rental._id)).unwrap();
            alertService.success('ההזמנה בוטלה בהצלחה');
        } catch (err) {
            alertService.errorToast(err || 'ביטול ההזמנה נכשל');
        }
    };

    const handleDeleteRental = async (rental) => {
        if (rental.status === 'active' || rental.status === 'overdue') {
            alertService.errorToast('לא ניתן למחוק השכרה פעילה');
            return;
        }

        const isConfirmed = await alertService.confirm(
            'מחיקת הזמנה',
            'האם את בטוחה שברצונך למחוק הזמנה זו  ממאגר הנתונים?',
            true
        );

        if (!isConfirmed) return;

        try {
            await dispatch(removeRental(rental._id)).unwrap(); 
            alertService.success('ההזמנה נמחקה מהמערכת');
        } catch (err) {
            console.error(err);
            alertService.errorToast(err);
        }
    };

    const rentalTabs = [
        { id: 'all', label: 'הכל', count: (rentalsList || []).length },
        { id: 'active', label: 'פעילות', count: (rentalsList || []).filter(r => r.status === 'active').length },
        { id: 'overdue', label: 'באיחור', count: (rentalsList || []).filter(r => r.status === 'overdue').length },
        { id: 'confirmed', label: 'מאושרות', count: (rentalsList || []).filter(r => r.status === 'confirmed').length },
        { id: 'completed', label: 'הושלמו', count: (rentalsList || []).filter(r => r.status === 'completed').length },
        { id: 'cancelled', label: 'מבוטלות', count: (rentalsList || []).filter(r => r.status === 'cancelled').length },
    ];

    const filteredRentals = (rentalsList || []).filter(r => {
        if (filter === 'all') return true;
        return r.status === filter;
    });

    if (loading && !isDrawerOpen && !isExtendModalOpen) return <LoadingSpinner message="טוען הזמנות..."/>;

    return (
        <div className={styles.container}>
           
            <div className={styles.stickyHeader}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>ניהול השכרות</h2>
                    <button 
                        className={styles.addButton} 
                        onClick={handleOpenAdd}
                    >
                        + צור הזמנה חדשה
                    </button>
                </div>

                <FilterTabs
                    tabs={rentalTabs} 
                    activeTab={filter} 
                    onTabChange={setFilter} 
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>שם הלקוח</th>
                            <th className={styles.th}>רכב</th>
                            <th className={styles.th}>תאריך איסוף</th>
                            <th className={styles.th}>החזרה מתוכננת</th>
                            <th className={styles.th}>סה"כ לתשלום</th>
                            <th className={styles.th}>סטטוס</th>
                            <th className={styles.th}>פעולות מנהל</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRentals.length === 0 ? (
                            <tr className={styles.row}>
                                <td colSpan="7" className={styles.cell} style={{ textAlign: 'center' }}>
                                    אין הזמנות להצגה בסטטוס זה
                                </td>
                            </tr>
                        ) : (
                            filteredRentals.map(rental => (
                                <AdminRentalRow 
                                    key={rental._id} 
                                    rental={rental} 
                                    onEdit={handleEditRental}
                                    onExtend={handleExtendRental}
                                    onChangeStatus={handleChangeStatus}
                                    onComplete={handleCompleteRental}
                                    onCancel={handleCancelRental}
                                    onDelete={handleDeleteRental} 
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isDrawerOpen && (
                <RentalDrawer
                    rentalToEdit={selectedRental}
                    onClose={handleCloseDrawer}
                    onSuccess={() => {
                        handleCloseDrawer();
                        dispatch(fetchAllRentals());
                    }}
                />
            )}

            {isExtendModalOpen && (
                <ExtendRentalModal
                    isOpen={isExtendModalOpen}
                    onClose={() => {
                        setIsExtendModalOpen(false);
                        setRentalToExtend(null);
                    }}
                    onConfirm={handleConfirmExtension}
                    minDate={rentalToExtend?.plannedReturnDate}
                />
            )}
        </div>
    );
}