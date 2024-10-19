"use client";

import React, { useState } from 'react';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps {
  label: string;
  onClick?: () => Promise<void> | void;  // Support async functions
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onClick, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      setLoading(true);
      try {
        await onClick();  // Handle async actions
      } finally {
        setLoading(false);  // Stop loading after action completes
      }
    }
  };

  return (
    <button 
      className={`${styles.primaryButton} ${loading ? styles.loading : ''}`} 
      onClick={handleClick} 
      disabled={disabled || loading} // Disable when loading or explicitly disabled
    >
      {loading ? (
        <div className={styles.dotsContainer}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      ) : (
        <span className={styles.primaryButtonText}>
          {label}
        </span>
      )}
    </button>
  );
};

export default PrimaryButton;
