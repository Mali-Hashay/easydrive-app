import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories, removeCategory } from "../../store/slices/categorySlice";
import { fetchAllCars } from "../../store/slices/carSlice"; 
import { categoryStatuses } from "../../constants/translations";
import { alertService } from "../../utils/alertService";
import CategoryDrawer from "../../components/admin/CategoryDrawer";
import FilterTabs from "../../components/admin/FilterTabs";
import styles from "./AdminTable.module.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminCategories() {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories.categories);
    
    const carsList = useSelector(state => state.cars?.allCars || []);

    const [activeDrawer, setActiveDrawer] = useState({ isOpen: false, categoryToEdit: null });
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchAllCategories());
        dispatch(fetchAllCars());
    }, [dispatch]);

    const hasAssignedCars = (category) => {
        if (!category) return false;

        if (category.carsCount && category.carsCount > 0) return true;
        if (Array.isArray(category.cars) && category.cars.length > 0) return true;

        const isCarAttached = carsList.some(car => {
            const carCategories = car.categories;

            if (Array.isArray(carCategories)) {
                return carCategories.some(cat => {
                    return String(cat) === String(category._id);
                });
            }
            return false;
        });

        return isCarAttached;
    };

    const categoryTabs = [
        { id: 'all', label: 'הכל', count: (categories || []).length },
        { id: 'active', label: 'פעיל', count: (categories || []).filter(c => c.status === 'active').length },
        { id: 'inactive', label: 'לא פעיל', count: (categories || []).filter(c => c.status === 'inactive').length },
    ];

    const filteredCategories = (categories || []).filter(c => {
        if (filter === 'all') return true;
        return c.status === filter;
    });

    const handleDeleteClick = async (category) => {
        if (hasAssignedCars(category)) {
            alertService.errorToast('לא ניתן למחוק קטגוריה שמשויכים אליה רכבים');
            return;
        }

        const isConfirmed = await alertService.confirm('מחיקת קטגוריה', 'האם אתה בטוח שברצונך למחוק קטגוריה זו?');
        if (isConfirmed) {
            try {
                await dispatch(removeCategory(category._id)).unwrap();
                alertService.success('הקטגוריה הוסרה בהצלחה.');
            } catch (err) {
                alertService.error(err.message || 'מחיקת הקטגוריה נכשלה');
            }
        }
    }; 

    const handleOpenEdit = (category) => {
        setActiveDrawer({ isOpen: true, categoryToEdit: category });
    };

    const handleOpenAdd = () => {
        setActiveDrawer({ isOpen: true, categoryToEdit: null });
    };

    const handleCloseDrawer = () => {
        setActiveDrawer({ isOpen: false, categoryToEdit: null });
    };

    return (
        <div className={styles.container} style={{maxWidth: '750px', margin: '0 auto 20px auto', justifyContent: 'center'}}>
            
            <div className={styles.stickyHeader}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>ניהול קטגוריות</h2>
                    <button className={styles.addButton} onClick={handleOpenAdd}>
                        + הוספת קטגוריה חדשה
                    </button>
                </div>

                <FilterTabs 
                    tabs={categoryTabs} 
                    activeTab={filter} 
                    onTabChange={setFilter} 
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>שם</th>
                            <th className={styles.th}>סטטוס</th>
                            <th className={styles.th}>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((c) => {
                                const isCategoryInUse = hasAssignedCars(c);

                                return (
                                    <tr key={c._id} className={styles.row}>
                                        <td className={styles.cell}>{c.name}</td>
                                        <td className={styles.cell}>{categoryStatuses[c.status]}</td>
                                        <td className={styles.cell}>
                                            <div className={styles.actions}>
                                                <button 
                                                    className={`${styles.button} ${styles.editBtn}`} 
                                                    onClick={() => handleOpenEdit(c)}
                                                >
                                                    <EditIcon fontSize="small" /> ערוך
                                                </button>

                                                <span title={isCategoryInUse ? "לא ניתן למחוק קטגוריה שמשויכים אליה רכבים" : "מחק קטגוריה"}>
                                                    <button 
                                                        className={`${styles.button} ${styles.deleteBtn}`} 
                                                        onClick={() => handleDeleteClick(c)}
                                                        disabled={isCategoryInUse}
                                                    >
                                                        <DeleteIcon fontSize="small" /> מחק
                                                    </button>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className={styles.cell} style={{ textAlign: 'center' }}>
                                    אין קטגוריות להצגה בסטטוס זה
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {activeDrawer.isOpen && (
                <CategoryDrawer
                    categoryToEdit={activeDrawer.categoryToEdit}
                    onClose={handleCloseDrawer}
                    onSuccess={() => {
                        dispatch(fetchAllCategories());
                        handleCloseDrawer();
                    }}
                />
            )}
        </div>
    );
}