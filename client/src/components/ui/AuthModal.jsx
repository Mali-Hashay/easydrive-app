import React, { useState, useEffect } from 'react';
import styles from './AuthModal.module.css';
import LoginPage from '../../pages/publicPages/Login';
import RegisterPage from '../../pages/publicPages/Register';
import ForgotPassword from '../../pages/publicPages/ForgotPassword';


export default function AuthModal(props) {
    const { isOpen, onClose, initialTab = 'login', message } = props;
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div 
                className={styles.modalContent} 
                onClick={(e) => e.stopPropagation()} 
                role="dialog"
                aria-modal="true"
            >
                <button 
                    className={styles.closeBtn} 
                    onClick={onClose}
                    aria-label="סגור חלון"
                >
                    ✕
                </button>

                {message && (
                    <div className={styles.noticeMessage}>
                        {message}
                    </div>
                )}

                <div className={styles.modalBody}>
                    {activeTab === 'register' ? (
                        <RegisterPage 
                            onSuccess={onClose} 
                            onSwitchToLogin={() => setActiveTab('login')} 
                        />
                    ) : activeTab === 'forgot' ? (
                        <ForgotPassword 
                            onSuccess={onClose} 
                            onSwitchToLogin={() => setActiveTab('login')} 
                        />
                    ) : (
                        <LoginPage 
                            onSuccess={onClose} 
                            onSwitchToRegister={() => setActiveTab('register')}
                            onSwitchToForgot={() => setActiveTab('forgot')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}