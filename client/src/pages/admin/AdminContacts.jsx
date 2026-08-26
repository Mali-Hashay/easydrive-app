import React, { useEffect, useState } from "react";
import { deleteContact, getAllContacts, updateContactStatus } from "../../api/contactApi";
import { alertService } from '../../utils/alertService.js';
import styles from './AdminTable.module.css';
import AdminContactRow from '../../components/admin/AdminContactRow.jsx';
import FilterTabs from '../../components/admin/FilterTabs.jsx'; 
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllContacts(); 
                setContacts(data);
            } catch (err) {
                console.error(err.message);
                alertService.errorToast('לא ניתן לטעון את פניות הלקוחות');
            } finally {
                setIsLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'pending' ? 'handled' : 'pending';
            
            await updateContactStatus(id, newStatus);
            
            setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
            alertService.success('סטטוס הפנייה עודכן בהצלחה');
        } catch (err) {
            alertService.errorToast('עדכון הסטטוס נכשל');
        }
    };

    const handleDeleteContact = async (id) => {
        const isConfirmed = await alertService.confirm(
            'מחיקת פנייה',
            'האם את בטוחה שברצונך למחוק פנייה זו לצמיתות ממאגר הנתונים?',
            true
        );

        if (!isConfirmed) return;

        try {
            await deleteContact(id); 
            setContacts(prevContacts => prevContacts.filter(c => c._id !== id));
            alertService.success('הפנייה נמחקה מהמערכת');
        } catch (err) {
            console.error(err);
            alertService.errorToast('מחיקת הפנייה נכשלה');
        }
    };

    const contactTabs = [
        { id: 'all', label: 'הכל', count: contacts.length },
        { id: 'pending', label: 'בטיפול', count: contacts.filter(c => c.status === 'pending').length },
        { id: 'handled', label: 'טופל', count: contacts.filter(c => c.status === 'handled').length }
    ];

    const filteredContacts = contacts.filter(c => {
        if (filter === 'all') return true;
        return c.status === filter;
    });

    if (isLoading) return <LoadingSpinner message="טוען פניות..."/>;

    return (
        <div className={styles.container}>

            <div className={styles.stickyHeader}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>ניהול פניות לקוחות</h2>
                </div>

                <FilterTabs 
                    tabs={contactTabs} 
                    activeTab={filter} 
                    onTabChange={setFilter} 
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>תאריך פנייה</th>
                            <th className={styles.th}>שם פונה</th>
                            <th className={styles.th}>אימייל</th>
                            <th className={styles.th}>טלפון</th>
                            <th className={styles.th}>תוכן ההודעה</th>
                            <th className={styles.th}>סטטוס</th>
                            <th className={styles.th}>פעולות מנהל</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.length === 0 ? (
                            <tr className={styles.row}>
                                <td colSpan="7" className={styles.cell} style={{ textAlign: 'center' }}>
                                    אין פניות להצגה בסטטוס זה
                                </td>
                            </tr>
                        ) : (
                            filteredContacts.map(contact => (
                                <AdminContactRow 
                                    key={contact._id} 
                                    contact={contact} 
                                    onToggleStatus={handleToggleStatus} 
                                    onDelete={handleDeleteContact} 
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}