import React from 'react';

interface SecondaryButtonProps {
  label: string;
  onClick: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="bg-[#ff914d] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#e6813b] active:transform active:scale-95"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SecondaryButton;
