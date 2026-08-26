import React, { useState, useEffect } from 'react';
import { getAllPayments, updatePayment, addPayment } from '../../api/paymentsApi.js';
import styles from '../../pages/admin/AdminTable.module.css';
import AdminPaymentsRow from '../../components/admin/AdminPaymentRow';
import { alertService } from '../../utils/alertService';
import PaymentDrawer from '../../components/admin/PaymentDrawer.jsx';
import FilterTabs from '../../components/admin/FilterTabs.jsx';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeDrawer, setActiveDrawer] = useState({ isOpen: false, paymentToEdit: null });

    const location = useLocation();

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await getAllPayments();
            setPayments(data || []);
        } catch (err) {
            alertService.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (location.state?.openAddDrawer) 
            setActiveDrawer({isOpen:true});
    }, [location]);

    const handleOpenAdd = () => {
        setActiveDrawer({ isOpen: true, paymentToEdit: null });
    };

    const handleOpenEdit = (payment) => {
        setActiveDrawer({ isOpen: true, paymentToEdit: payment });
    };

    const handleCloseDrawer = () => {
        setActiveDrawer({ isOpen: false, paymentToEdit: null });
    };

    const handleSubmitPayment = async (paymentData, paymentId) => {
        if (paymentId) {
            const updated = await updatePayment(paymentId, paymentData);
            setPayments(prev => prev.map(p => p._id === paymentId ? updated : p));
        } else {
            const newPayment = await addPayment(paymentData);
            setPayments(prev => [newPayment, ...prev]);
        }
        handleCloseDrawer();
    };

    const totalRevenue = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.sum || 0), 0);

    const pendingAmount = payments
        .filter(p => p.status === 'pending' || p.status === 'authorized')
        .reduce((sum, p) => sum + (p.sum || 0), 0);

    const getCountByStatus = (statusKey) => {
        if (statusKey === 'all') return payments.length;
        return payments.filter(p => p.status === statusKey).length;
    };

    const paymentTabs = [
        { id: 'all', label: 'הכל', count: getCountByStatus('all') },
        { id: 'paid', label: 'שולם', count: getCountByStatus('paid') },
        { id: 'pending', label: 'ממתין', count: getCountByStatus('pending') },
        { id: 'authorized', label: 'מאושר', count: getCountByStatus('authorized') },
        { id: 'failed', label: 'נכשל', count: getCountByStatus('failed') },
        { id: 'refunded', label: 'זיכוי', count: getCountByStatus('refunded') },
        { id: 'cancelled', label: 'בוטל', count: getCountByStatus('cancelled') }
    ];

    const filteredPayments = payments.filter(p => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
            (p._id && p._id.toLowerCase().includes(search)) ||
            (p.rentalId && p.rentalId.toString().toLowerCase().includes(search));
        
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingSpinner message = 'טוען נתוני תשלומים'/>;

    return (
        <div className={styles.container}>
            <div className={styles.stickyHeader}>
                <header className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>ניהול תשלומים ועסקאות</h2>
                    <button 
                        className={styles.addButton}
                        onClick={handleOpenAdd}
                    >
                        + רישום תשלום חדש
                    </button>
                </header>

                
                <FilterTabs 
                    tabs={paymentTabs} 
                    activeTab={statusFilter} 
                    onTabChange={setStatusFilter} 
                />

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="חפש לפי מזהה תשלום או מזהה השכרה"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.statsCards}>
                    <div className={styles.card}>
                        <h4>סה"כ הכנסות (שולם)</h4>
                        <span className={styles.statPaid}>₪{totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className={styles.card}>
                        <h4>ממתין לגבייה / אישור</h4>
                        <span className={styles.statPending}>₪{pendingAmount.toLocaleString()}</span>
                    </div>
                    <div className={styles.card}>
                        <h4>סה"כ עסקאות</h4>
                        <span>{payments.length}</span>
                    </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>מזהה תשלום</th>
                            <th className={styles.th}>מזהה השכרה</th>
                            <th className={styles.th}>סכום</th>
                            <th className={styles.th}>אמצעי תשלום</th>
                            <th className={styles.th}>סטטוס</th>
                            <th className={styles.th}>תאריך</th>
                            <th className={styles.th}>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map(payment => (
                                <AdminPaymentsRow
                                    key={payment._id}
                                    payment={payment}
                                    onEdit={handleOpenEdit}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.messageCell}>
                                    לא נמצאו תשלומים מתאימים
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {activeDrawer.isOpen && (
                <PaymentDrawer
                    paymentToEdit={activeDrawer.paymentToEdit}
                    onClose={handleCloseDrawer}
                    onSubmit={handleSubmitPayment}
                    onSuccess={() => {
                        fetchPayments();
                        handleCloseDrawer();
                    }}
                />
            )}
        </div>
    );
}