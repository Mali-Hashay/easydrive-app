import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from './Header';
import styles from './AdminLayout.module.css';
import AdminFooter from './AdminFooter';

export default function AdminLayout() {
    return (
        <div className={styles.layoutContainer}>
            <Header /> 
            <div className={styles.contentWrapper}>
                <AdminSidebar />
                <div className={styles.mainColumn}>
                    <main className={styles.mainArea}>
                        <Outlet />
                    </main>
                    <AdminFooter />
                </div>
            </div>
        </div>
    );
}