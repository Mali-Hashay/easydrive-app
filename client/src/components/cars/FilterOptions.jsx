import React from 'react';
import styles from './FilterOptions.module.css';
import MultiSelectDropdown from '../ui/MultiSelectDropdown';

export default function FilterOptions(props) 
{
    const { allCategories, categories, setCategories, transmission, setTransmission } = props;

    return (
        <div className={styles.container}>
            <h2 className={styles.mainTitle}>סינון לפי:</h2>
            
            <div className={styles.filterRow}>

                <MultiSelectDropdown 
                    title="קטגוריות"
                    options={allCategories || []}
                    selectedOptions={categories}
                    onChange={setCategories}
                />

                <div className={styles.selectGroup}>
                    <label className={styles.sectionTitle}>סוג גיר:</label> 
                    <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                        className={styles.select}
                    >
                        <option value="all">הכל</option>
                        <option value="automatic">אוטומטי</option>
                        <option value="manual">ידני</option>
                    </select>
                </div>
            </div>
        </div>
    );
}