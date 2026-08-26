import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import SearchSummary from "../../components/cars/SearchSummary" 
import FilterOptions from "../../components/cars/FilterOptions"
import { AvailableCarsList } from "../../components/cars/AvailableCarsList"
import { fetchAvailableCars } from "../../store/slices/carSlice"
import { fetchAllCategories } from "../../store/slices/categorySlice"
import styles from "./SearchResultsPage.module.css"

export default function SearchResultsPage() {
    const dispatch = useDispatch();
    
    const { searchParams } = useSelector(state => state.rentalFlow);
    const { pickupDate, pickupTime, returnDate, returnTime } = searchParams;

    const [categories, setCategories] = useState([]);
    const [transmission, setTransmission] = useState('');
    
    const availableCars = useSelector(state => state.cars.availableCars);
    const loading = useSelector(state => state.cars.loading);
    const allCategories = useSelector(state => state.categories.categories);

    useEffect(() => {
        dispatch(fetchAvailableCars({ pickupDate, pickupTime, returnDate, returnTime }));
        dispatch(fetchAllCategories());
    }, [dispatch, pickupDate, pickupTime, returnDate, returnTime]);

    const filteredCars = availableCars.filter(car => {
        const matchCategory = categories.length === 0 ||
                              car.categories.some(c => categories.includes(c.toString()));
        
        const matchTransmission = transmission === '' || transmission === 'all' ||
                                  transmission === car.transmission;

        return matchCategory && matchTransmission;
    });

    return (
        <div className={styles.mainDiv}>
            
            <div className={styles.summaryContainer}>
                <SearchSummary />
            </div>
            
            
            <div className={styles.filterContainer}>
                <FilterOptions 
                    allCategories={allCategories}
                    categories={categories} 
                    transmission={transmission}
                    setCategories={setCategories}
                    setTransmission={setTransmission}
                />
            </div>

        
            <AvailableCarsList cars={filteredCars} loading={loading} />
        </div>
    );
}