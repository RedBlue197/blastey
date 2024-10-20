"use client"; // Ensure this component is client-side

import React, { useState } from 'react';
import styles from './LinkWithIconButton.module.css';

interface LinkWithIconButtonProps {
  label: string;
  icon?: React.ReactNode;  // Icon to display before the label
  onClick?: () => Promise<void> | void;
  href?: string;  // URL for the link behavior
  disabled?: boolean;
}

const LinkWithIconButton: React.FC<LinkWithIconButtonProps> = ({ label, icon, onClick, href, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      e.preventDefault();  // Prevent link behavior if onClick exists
      setLoading(true);
      try {
        await onClick();
      } finally {
        setLoading(false);
      }
    }
  };

  // Button/link content that shows loading state or icon + label
  const ButtonContent = (
    <>
      {loading ? (
        <div className={styles.dotsContainer}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      ) : (
        <span className={styles.buttonText}>
          {icon && <span className={styles.iconContainer}>{icon}</span>}
          {label}
        </span>
      )}
    </>
  );

  // Render a link if href is provided, otherwise a button
  if (href) {
    return (
      <a
        href={href}
        className={`${styles.linkButton} ${loading ? styles.loading : ''}`}
        onClick={onClick ? handleClick : undefined}
        aria-disabled={disabled || loading}
      >
        {ButtonContent}
      </a>
    );
  }

  return (
    <button
      className={`${styles.linkButton} ${loading ? styles.loading : ''}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {ButtonContent}
    </button>
  );
};

export default LinkWithIconButton;
