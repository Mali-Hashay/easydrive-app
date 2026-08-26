import React from 'react';
import styles from './CarCard.module.css';
import { carsTransmission, fuelTypes } from '../../constants/translations';

// ייבוא אייקונים מ-MUI
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import EventSeatIcon from '@mui/icons-material/EventSeat';

export default function CarCard(props) {
    const { car, children } = props;

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img 
                    src={car.imageUrl} 
                    alt={`${car.brand} ${car.model}`} 
                    className={styles.image}
                />
            </div>
            
            <h3 className={styles.title}>{car.brand} {car.model}</h3>
            
            <div className={styles.detailsRow}>
                <span className={styles.carInfo}>
                    <EventSeatIcon className={styles.icon} />
                    {car.seats} מושבים
                </span>
                <span className={styles.carInfo}>
                    <SettingsIcon className={styles.icon} />
                    {carsTransmission[car.transmission]}
                </span>
                <span className={styles.carInfo}>
                    <LocalGasStationIcon className={styles.icon} />
                    {fuelTypes[car.fuelType]}
                </span>
            </div>
            
            <p className={styles.price}>
                מחיר ליום באתר: <span className={styles.priceAmount}>{car.dailyPrice}₪</span>
            </p>
            
            <div className={styles.actionWrapper}>
                {children}
            </div>
        </div>
    );
}