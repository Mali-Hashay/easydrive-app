import React from 'react';
import { CircularProgress } from '@mui/material';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 60, color="#e31b23" , message }) {
    return (
        <div className={styles.spinnerContainer}>
            <CircularProgress size={size} style={{ color }} />
            {message && <p className={styles.spinnerText}>{message}</p>}
        </div>
    );
}