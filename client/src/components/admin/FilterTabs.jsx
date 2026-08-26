import React from 'react';
import styles from './FilterTabs.module.css'; 

export default function FilterTabs({ tabs = [], activeTab, onTabChange }) {
    return (
        <div className={styles.filterTabs}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? styles.activeTab : ''}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label} {tab.count !== undefined && `(${tab.count})`}
                </button>
            ))}
        </div>
    );
}