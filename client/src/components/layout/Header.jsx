import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import styles from './Header.module.css';
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './../../store/slices/authSlice.js';
import AuthModal from '../ui/AuthModal.jsx';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    const isAdmin = user?.role === 'admin' 

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authInitialTab, setAuthInitialTab] = useState('login');

    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    const handleLogout = () => {
        dispatch(logout());
        closeMenu();
        navigate('/'); 
    };

    const closeMenu = () => {
        setIsMenuOpen(false); 
        setIsUserMenuOpen(false);
    };

    const handleOpenLogin = () => {
        setAuthInitialTab('login');
        setIsAuthModalOpen(true);
        closeMenu();
    };

    const handleOpenRegister = () => {
        setAuthInitialTab('register');
        setIsAuthModalOpen(true);
        closeMenu();
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                
                <Link to="/" className={styles.logo} onClick={closeMenu}>
                    <img src={logo} alt="EasyDrive" className={styles.logoImage} />
                </Link>

                <nav className={`${styles.navMenu} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <ul className={styles.navList}>
                        <li>
                            <Link to="/" className={styles.navLink} onClick={closeMenu}>דף הבית</Link>
                        </li>
                        <li>
                            <Link to="/search" className={styles.navLink} onClick={closeMenu}>השכרת רכב</Link>
                        </li>
                        <li>
                            <Link to="/about" className={styles.navLink} onClick={closeMenu}>אודות</Link>
                        </li>
                        <li>
                            <Link to="/contact" className={styles.navLink} onClick={closeMenu}>צור קשר</Link>
                        </li>
                        {isAuthenticated && isAdmin && (
                            <li>
                                <Link to="/admin" className={styles.navLink} onClick={closeMenu}>ניהול</Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <div className={styles.leftSection}>
                    <div className={styles.userArea} ref={userMenuRef}>
                        <button 
                            className={styles.userTrigger} 
                            aria-label="תפריט משתמש" 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <AccountCircle className={styles.userIcon} />
                        </button>
                        
                        {isUserMenuOpen && (
                            <div className={styles.dropdownActive}>
                                {isAuthenticated ? (
                                    isAdmin ? (
                                        <>
                                            <button onClick={handleLogout} className={styles.logoutButton}>התנתקות</button>
                                        </>
                                    ) : (
                        
                                        <>
                                            <Link to="/profile" className={styles.dropdownLink} onClick={closeMenu}>פרופיל אישי</Link>
                                            <Link to="/my-rentals" className={styles.dropdownLink} onClick={closeMenu}>ההזמנות שלי</Link>
                                            <button onClick={handleLogout} className={styles.logoutButton}>התנתקות</button>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <button onClick={handleOpenLogin} className={styles.dropdownLink}>התחברות</button>
                                        <button onClick={handleOpenRegister} className={styles.dropdownLink}>הרשמה</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button 
                        className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`} 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="תפריט ניווט"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

            </div>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                initialTab={authInitialTab} 
            />
        </header>
    );
}