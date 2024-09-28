import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'warning';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const bgColor = type === 'success' ? '#00bf63' : '#ff914d';

  return (
    <div className={`bg-[${bgColor}] text-white px-4 py-2 rounded-lg`}>
      {message}
    </div>
  );
};

export default Alert;
