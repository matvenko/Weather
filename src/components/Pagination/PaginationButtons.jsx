import React from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const PaginationButtons = ({ setCurrentPage, currentPage, totalPages }) => {
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const showNextButton = currentPage !== totalPages;
  const showPrevButton = currentPage !== 1;

  return (
    <div>
      <ReactPaginate
        breakLabel={<span className="mr-4">...</span>}
        nextLabel={
          showNextButton ? (
            <span className="w-10 h-10 flex items-center justify-center bg-lightGray pagination-span">
              <BsChevronRight />
            </span>
          ) : null
        }
        // onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        previousLabel={
          showPrevButton ? (
            <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md mr-4 pagination-span">
              <BsChevronLeft />
            </span>
          ) : null
        }
        renderOnZeroPageCount={null}
        containerClassName="flex items-center justify-center mt-8 mb-4"
        pageClassName="flex items-center justify-center mr-4 pagination-item"
        activeClassName="active-pagination-item"
        onPageChange={handlePageClick}
      />
    </div>
  );
};

export default PaginationButtons;
