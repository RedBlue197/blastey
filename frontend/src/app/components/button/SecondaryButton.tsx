// SecondaryButton.jsx
import React, { useState } from 'react'; // Import useState
import styles from './SecondaryButton.module.css';

interface SecondaryButtonProps {
  label: string;
  onClick?: () => Promise<void> | void; // Support async/await
  disabled?: boolean;
}


const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, onClick, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      setLoading(true);
      try {
        await onClick();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      className={`${styles.secondaryButton} ${loading ? styles.loading : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      disabled={disabled || loading} // Disable while loading or if explicitly disabled
    >
      {loading ? (
        <div className={styles.dotsContainer}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      ) : (
        <span className={styles.secondaryButtonText}>{label}</span>
      )}
    </button>
  );
};

export default SecondaryButton;