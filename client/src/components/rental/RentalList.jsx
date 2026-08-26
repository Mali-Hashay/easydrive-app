import React from 'react';
import RentalCard from './RentalCard';
import styles from './RentalList.module.css';

export default function RentalList(props) 
{
    const { rentals } = props;
    
    return (
        <div className={styles.listContainer}> 
            {(rentals || []).map((rental) => (
                <RentalCard key={rental._id || rental.id} rental={rental} />
            ))}
        </div>
    );
}