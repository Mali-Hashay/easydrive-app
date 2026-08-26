import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CarCard from "./CarCard";
import { setSelectedCar } from "../../store/slices/rentalFlowSlice";
import LoadingSpinner from "../ui/LoadingSpinner"; 
import AuthModal from "../ui/AuthModal"; 
import styles from "./AvailableCarsList.module.css";

export function AvailableCarsList(props) {
    const { cars, loading } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (!cars || cars.length === 0) {
        return <p className={styles.noCarsMessage}>לא נמצאו רכבים התואמים את הגדרות החיפוש</p>;
    }

    const handleOrder = (selectedCar) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }

        dispatch(setSelectedCar(selectedCar));
        navigate('/rental');
    };

    return (
        <div className={styles.carsGrid}>
            {cars.map(car => (
                <CarCard key={car._id} car={car}>
                    <button onClick={() => handleOrder(car)}>לבחירה</button>
                </CarCard>
            ))}

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                message="כדי להשלים את הזמנת הרכב יש להתחבר למערכת"
            />
        </div>
    );
}