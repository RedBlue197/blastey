"use client";

import React from 'react';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;  // New prop for loading state
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onClick, disabled = false, loading = false }) => {
  return (
    <button 
      className={styles.primaryButton} 
      onClick={onClick} 
      disabled={disabled || loading} // Disable when loading or explicitly disabled
    >
    
      <span className={styles.primaryButtonText}>
        {label}
      </span>
      {loading && <div className={styles.spinner}></div>}  {/* Show spinner when loading */}
    </button>
  );
};

export default PrimaryButton;
