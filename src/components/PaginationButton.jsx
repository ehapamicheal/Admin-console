import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const PaginationButton = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((page) => {
        return (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        );
      })
      .map((page, index, arr) => (
        <React.Fragment key={page}>
          {index > 0 && page - arr[index - 1] > 1 && (
            <button className="border text-center border-red-1 rounded w-7 h-7 md:w-9 md:h-9">
              <span className="text-black text-center">...</span>
            </button>
          )}
          <button
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-black font-normal text-[12px] md:text-sm flex items-center justify-center rounded-3xl w-7 h-7 md:w-9 md:h-9 cursor-pointer ${
              page === currentPage
                ? "bg-dash-grey-2 border border-red-1"
                : "hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        </React.Fragment>
      ));
  };

  return (
    <div className="flex justify-between items-center py-4 px-2 md:p-4">
      <span className="text-[14px] text-gray-1 font-normal leading-5">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`border rounded-3xl py-1 flex items-center justify-center border-red-1 px-2 w-7 h-7 md:w-9 md:h-9 transition delay-100 group ${
            currentPage === 1 ? 'opacity-50' : 'cursor-pointer hover:bg-red-1'
          }`}
        >
          <IoIosArrowBack className={`text-red-1 ${currentPage !== 1 ? 'group-hover:text-white' : ''}`} />
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`border group rounded-3xl flex items-center justify-center py-1 border-red-1 px-2 w-7 h-7 md:w-9 md:h-9 ${
            currentPage === totalPages ? 'opacity-50' : 'cursor-pointer hover:bg-red-1'
          }`}
        >
          <IoIosArrowForward className={`text-red-1 ${currentPage !== totalPages ? 'group-hover:text-white' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default PaginationButton;  