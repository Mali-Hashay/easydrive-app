import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCars, removeCar } from "../../store/slices/carSlice";
import AdminCarRow from "../../components/admin/AdminCarRow";
import CarDrawer from "../../components/admin/CarDrawer";
import FilterTabs from "../../components/admin/FilterTabs"; 
import { alertService } from "../../utils/alertService";
import styles from "./AdminTable.module.css"; 
import { useLocation } from "react-router-dom";

export default function AdminCars() {
    const allCars = useSelector(state => state.cars.allCars);
    const dispatch = useDispatch();
    const location = useLocation();

    const [activeDrawer, setActiveDrawer] = useState({ isOpen: false, carToEdit: null });
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchAllCars());
    }, [dispatch]);

    useEffect(() => {
        if (location.state?.openAddDrawer) 
            setActiveDrawer({ isOpen: true });
    }, [location]);
    
    const carTabs = [
        { id: 'all', label: 'הכל', count: (allCars || []).length },
        { id: 'available', label: 'זמין', count: (allCars || []).filter(c => c.status === 'available').length },
        { id: 'rented', label: 'מושכר', count: (allCars || []).filter(c => c.status === 'rented').length },
        { id: 'maintenance', label: 'בטיפול', count: (allCars || []).filter(c => c.status === 'maintenance').length }
    ];

    const filteredCars = (allCars || []).filter(car => {
        if (filter === 'all') return true;
        return car.status === filter;
    });

    const handleOpenAdd = () => {
        setActiveDrawer({ isOpen: true, carToEdit: null });
    };

    const handleOpenEdit = (car) => {
        setActiveDrawer({ isOpen: true, carToEdit: car });
    };

    const handleCloseDrawer = () => {
        setActiveDrawer({ isOpen: false, carToEdit: null });
    };

    const handleDelete = async (carId) => {
        const isConfirmed = await alertService.confirm(
            'מחיקת רכב', 
            'האם אתה בטוח שברצונך למחוק את הרכב מהמערכת לצמיתות?', 
            true
        );

        if (isConfirmed) {
            try {
                await dispatch(removeCar(carId)).unwrap();
                alertService.success('הרכב הוסר בהצלחה מהמערכת');
            } catch (err) {
                alertService.errorToast(err);
            }
        }
    };
    
    return (
        <div className={styles.container}>

            <div className={styles.stickyHeader}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>ניהול מלאי רכבים</h2>
                    <button 
                        className={styles.addButton}
                        onClick={handleOpenAdd}
                    >
                        + הוסף רכב חדש
                    </button>
                </div>


                <FilterTabs 
                    tabs={carTabs} 
                    activeTab={filter} 
                    onTabChange={setFilter} 
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>תמונה</th>
                            <th className={styles.th}>יצרן ודגם</th>
                            <th className={styles.th}>מושבים</th>
                            <th className={styles.th}>מחיר ליום</th>
                            <th className={styles.th}>סטטוס</th>
                            <th className={styles.th}>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCars.length === 0 ? (
                            <tr className={styles.row}>
                                <td colSpan="6" className={styles.cell} style={{ textAlign: 'center' }}>
                                    אין רכבים להצגה בסטטוס זה
                                </td>
                            </tr>
                        ) : (
                            filteredCars.map((car) => (
                                <AdminCarRow
                                    key={car._id} 
                                    car={car} 
                                    onEdit={() => handleOpenEdit(car)} 
                                    onDelete={handleDelete} 
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {activeDrawer.isOpen && (
                <CarDrawer
                    carToEdit={activeDrawer.carToEdit}
                    onClose={handleCloseDrawer}
                    onSuccess={() => {
                        dispatch(fetchAllCars());
                        handleCloseDrawer();
                    }}
                />
            )}
        </div>
    );
}