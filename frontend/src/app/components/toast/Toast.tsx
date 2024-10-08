import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // Time in milliseconds before it fades out
}

const Toast: React.FC<ToastProps> = ({ type, message, duration = 10000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>{getIcon(type)}</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✔️';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '';
  }
};

export default Toast;
