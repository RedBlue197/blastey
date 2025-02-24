import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 0) {
    return (
      <div className="flex justify-center items-center py-2 text-gray-500">
        This is the end of the page.
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-2">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-md ${
            page === currentPage ? 'bg-[#00bf63] text-white' : 'bg-gray-200'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;