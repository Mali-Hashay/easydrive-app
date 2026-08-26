import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RentalList from '../../components/rental/RentalList';
import { fetchMyRentals } from '../../store/slices/rentalSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner'; 
import styles from './MyRentalsPage.module.css';
import { alertService } from '../../utils/alertService';

export default function MyRentalsPage() {
    const dispatch = useDispatch();
    const { myRentals, loading, error } = useSelector(state => state.rentals);

    const activeRentals = myRentals?.filter(rental => 
        ['confirmed', 'active', 'overdue'].includes(rental.status)
    ) || [];
    
    const pastRentals = myRentals?.filter(rental => 
        ['completed', 'cancelled'].includes(rental.status)
    ) || [];

    useEffect(() => {
        dispatch(fetchMyRentals());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            alertService.errorToast(error);
        }
    }, [error]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>ההזמנות שלי</h1>
            
            {myRentals?.length === 0 ? (
                <p className={styles.emptyState}>אין לך הזמנות כרגע.</p>
            ) : (
                <>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>הזמנות פעילות</h2>
                        <RentalList rentals={activeRentals} />
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>היסטוריית הזמנות</h2>
                        <RentalList rentals={pastRentals} />
                    </div>
                </>
            )}
        </div>
    );
}