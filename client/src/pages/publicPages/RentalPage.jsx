import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RentalFlow from "../../components/rental/RentalFlow";
import { carsTransmission, fuelTypes } from "../../constants/translations";
import styles from "./RentalPage.module.css";

import EventSeatIcon from '@mui/icons-material/EventSeat';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import EvStationIcon from '@mui/icons-material/EvStation'; // אייקון מומלץ לרכב חשמלי
import { calculateTotalDays, calculateTotalPrice } from "../../utils/dateUtils";

export default function RentalPage() 
{
    const selectedCar = useSelector(state => state.rentalFlow.selectedCar);
    const {pickupDate, pickupTime, returnDate, returnTime} = useSelector(state => state.rentalFlow.searchParams);

    const totalDays = calculateTotalDays(pickupDate, pickupTime, returnDate, returnTime);
    const totalPrice = calculateTotalPrice(pickupDate, pickupTime, returnDate, returnTime, selectedCar?.dailyPrice);
    
    if (!selectedCar) 
        return <Navigate to="/search" replace />; 
            
    return (
        <div className={styles.pageContainer} dir="rtl">
            <div className={styles.mainLayout}>
                
                <main className={styles.mainFlowSection}>
                    <RentalFlow />
                </main>

                <aside className={styles.carSidebar}>
                    <div className={styles.carCard}>
                        
                        <div className={styles.badgeRow}>
                            <span className={styles.statusBadge}>✓ זמין להזמנה</span>
                        </div>

                        <div className={styles.imageContainer}>
                            <img 
                                src={selectedCar.imageUrl} 
                                alt={`${selectedCar.brand} ${selectedCar.model}`} 
                                className={styles.carImage} 
                            />
                        </div>

                        <div className={styles.carHeader}>
                            <h2 className={styles.carTitle}>{selectedCar.brand} {selectedCar.model}</h2>
                            <p className={styles.carSubTitle}>או דגם דומה בקטגוריה</p>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.specsGrid}>
                            <div className={styles.specItem}>
                                <EventSeatIcon className={styles.specIcon} />
                                <span>{selectedCar.seats} מושבים</span>
                            </div>
                            <div className={styles.specItem}>
                                <SettingsIcon className={styles.specIcon} />
                                <span>{carsTransmission[selectedCar.transmission]}</span>
                            </div>
                            <div className={styles.specItem}>
                                <LocalGasStationIcon className={styles.specIcon} />
                                <span>{fuelTypes[selectedCar.fuelType]}</span>
                            </div>
                            <div className={styles.specItem}>
                                <AcUnitIcon className={styles.specIcon} />
                                <span>מזגן</span>
                            </div>
                        </div>

                        {selectedCar.fuelType === 'electric' && (
                            <div className={styles.electricNotice}>
                                <EvStationIcon className={styles.electricIcon} />
                                <div>
                                    <strong>מידע על רכב חשמלי:</strong>
                                    <p>הרכב יימסר טעון (מעל 80%). יש להחזירו עם לפחות 20% סוללה.</p>
                                </div>
                            </div>
                        )}

                        <hr className={styles.divider} />

                        <div className={styles.priceSection}>
                            <span className={styles.priceLabel}>סה"כ לכל התקופה :</span>
                            <div className={styles.priceWrapper}>
                                <span className={styles.currency}>₪{totalPrice}</span>
                            </div>
                        </div>

                    </div>
                </aside>

            </div>
        </div>
    );
}