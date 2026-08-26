import React, { useState, useEffect, useRef } from 'react';
import styles from './MultiSelectDropdown.module.css';

export default function MultiSelectDropdown(props) {
  const { title, options, selectedOptions, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCheckboxChange = (optionId) => {
    if (selectedOptions.includes(optionId)) 
      onChange(selectedOptions.filter(id => id !== optionId));
    else
      onChange([...selectedOptions, optionId]);
  };

  return (
   
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <label className={styles.label}>{title}</label>
      
      <button 
        type="button"
        className={styles.dropdownButton} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length === 0 
          ? `בחר ${title}...` 
          : `נבחרו (${selectedOptions.length})`}
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <label key={option._id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedOptions.includes(option._id)}
                onChange={() => handleCheckboxChange(option._id)}
              />
              <span>{option.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}