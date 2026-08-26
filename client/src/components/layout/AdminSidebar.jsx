import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminSidebar.module.css';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PaymentIcon from '@mui/icons-material/Payment';

export default function AdminSidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>מערכת ניהול</h2>
            </div>

            <nav className={styles.nav}>
                <NavLink 
                    to="/admin/cars" 
                    className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                >
                    <DirectionsCarIcon fontSize="small" />
                    ניהול רכבים
                </NavLink>
                
                <NavLink 
                    to="/admin/users" 
                    className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                >
                    <GroupIcon fontSize="small" />
                    ניהול משתמשים
                </NavLink>
                
                <NavLink 
                    to="/admin/rentals" 
                    className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                >
                    <ReceiptIcon fontSize="small" />
                    ניהול הזמנות
                </NavLink>

                <NavLink 
                    to="/admin/payments" 
                    className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                >
                    <PaymentIcon fontSize="small" />
                    ניהול תשלומים
                </NavLink>
                
                <NavLink 
                    to="/admin/categories" 
                    className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                >
                    <CategoryIcon fontSize="small" />
                    ניהול קטגוריות
                </NavLink>

                <NavLink 
                    to="/admin/contacts" 
                    className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                >
                    <ContactMailIcon fontSize="small" />
                    ניהול פניות 
                </NavLink>
            </nav>
        </aside>
    );
}