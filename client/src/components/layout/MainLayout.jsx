import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./MainLayout.module.css"; 

export default function MainLayout() {
    return (
        <div className={styles.layoutWrapper}>
           
            <Header />

            <main className={styles.mainContent}>
                <Outlet /> 
            </main>
        
            <Footer />
        </div>
    );
}