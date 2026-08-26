import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styles from './AdminTable.module.css';

import { 
    fetchUsers, 
    updateUserDetails, 
    removeUser 
} from '../../store/slices/userSlice';

import { alertService } from '../../utils/alertService';
import AdminUsersRow from '../../components/admin/AdminUsersRow';
import UserDrawer from '../../components/admin/UserDrawer';
import FilterTabs from '../../components/admin/FilterTabs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminUsers() {
    const dispatch = useDispatch();
    const location = useLocation();

    const { users, loading } = useSelector((state) => state.users);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [activeDrawer, setActiveDrawer] = useState({ isOpen: false, userToEdit: null });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (location.state?.openAddDrawer) {
            setActiveDrawer({ isOpen: true, userToEdit: null });
        }
    }, [location]);

    const handleOpenEdit = (user) => {
        setActiveDrawer({ isOpen: true, userToEdit: user });
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await dispatch(
                updateUserDetails({ userId, updatedFields: { role: newRole } })
            ).unwrap();
            alertService.success('התפקיד עודכן בהצלחה');
        } catch (err) {
            alertService.error(err || 'עדכון התפקיד נכשל');
        }
    };

    const handleChangeStatus = async (userId, newStatus) => {
        try {
            await dispatch(
                updateUserDetails({ userId, updatedFields: { status: newStatus } })
            ).unwrap();
            alertService.success('סטטוס המשתמש עודכן בהצלחה');
        } catch (err) {
            alertService.error(err || 'עדכון הסטטוס נכשל');
        }
    };

    const handleDeleteUser = async (userId) => {
        const isConfirmed = await alertService.confirm(
            'האם אתה בטוח?',
            'פעולה זו תמחק את המשתמש מהמערכת.',
            true
        );

        if (!isConfirmed) return;

        try {
            await dispatch(removeUser(userId)).unwrap();
            alertService.success('המשתמש נמחק בהצלחה');
        } catch (err) {
            alertService.error(err || 'מחיקת המשתמש נכשלה');
        }
    };

    const userStatusTabs = [
        { id: 'all', label: 'הכל', count: users.length },
        { id: 'active', label: 'פעיל', count: users.filter((u) => u.status === 'active').length },
        { id: 'inactive', label: 'לא פעיל', count: users.filter((u) => u.status === 'inactive').length },
        { id: 'blocked', label: 'חסום', count: users.filter((u) => u.status === 'blocked').length },
    ];

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = fullName.includes(search) || email.includes(search);
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    if (loading && users.length === 0) {
        return <LoadingSpinner message="טוען משתמשים..." />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.stickyHeader}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>ניהול משתמשים</h2>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className={styles.inputField}
                        >
                            <option value="all">כל התפקידים</option>
                            <option value="client">לקוח</option>
                            <option value="admin">מנהל</option>
                        </select>

                        <input
                            type="text"
                            placeholder="חפש לפי שם או אימייל..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />

                        <button
                            onClick={() => setActiveDrawer({ isOpen: true, userToEdit: null })}
                            className={styles.addButton}
                        >
                            + הוסף משתמש
                        </button>
                    </div>
                </div>

                <FilterTabs
                    tabs={userStatusTabs}
                    activeTab={statusFilter}
                    onTabChange={setStatusFilter}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>שם מלא</th>
                            <th className={styles.th}>אימייל</th>
                            <th className={styles.th}>טלפון</th>
                            <th className={styles.th}>ת.ז / רישיון</th>
                            <th className={styles.th}>תפקיד</th>
                            <th className={styles.th}>סטטוס</th>
                            <th className={styles.th}>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <AdminUsersRow
                                    key={user._id}
                                    user={user}
                                    onChangeRole={handleChangeRole}
                                    onEdit={() => handleOpenEdit(user)}
                                    onChangeStatus={handleChangeStatus}
                                    onDelete={handleDeleteUser}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.cell} style={{ textAlign: 'center' }}>
                                    לא נמצאו משתמשים מתאימים
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {activeDrawer.isOpen && (
                <UserDrawer
                    userToEdit={activeDrawer.userToEdit}
                    onClose={() => setActiveDrawer({ isOpen: false, userToEdit: null })}
                    onSuccess={() => {
                        setActiveDrawer({ isOpen: false, userToEdit: null });
                    }}
                />
            )}
        </div>
    );
}