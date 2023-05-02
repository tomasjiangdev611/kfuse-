import React, { Fragment } from 'react';

type Props = {
  currentPage: number;
  pages: number;
  setPage: any;
  pageLimit: number;
};

const Pagination = ({ currentPage, pages, setPage, pageLimit }: Props) => {
  const numPages = Math.ceil(pages / pageLimit);

  const getPaginationNumbers = () => {
    const blocks = [];
    for (let i = 0; i < numPages; i++) {
      blocks.push(i + 1);
    }
    return blocks;
  };

  const renderPageBlocks = () => {
    const getPageNumbers = getPaginationNumbers();
    return getPageNumbers.map((pageNum) => (
      <a
        key={pageNum}
        className="pagination__page"
        onClick={() => setPage(pageNum)}
        style={
          pageNum === currentPage ? { backgroundColor: 'lightBlue' } : null
        }
      >
        {pageNum}
      </a>
    ));
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setPage(currentPage + 1);
    }
  };

  const renderPrevPageBlocks = () => {
    return (
      <Fragment>
        <a
          key="first-page"
          className="pagination__page"
          onClick={() => (currentPage > 1 ? setPage(1) : '')}
        >
          &#171;
        </a>
        <a
          key="prev-page"
          className="pagination__page"
          onClick={() => (currentPage > 1 ? goToPrevPage() : '')}
        >
          &#8592;
        </a>
      </Fragment>
    );
  };

  const renderNextPageBlocks = () => {
    return (
      <Fragment>
        <a
          key="next-page"
          className="pagination__page"
          onClick={() => (currentPage < numPages ? goToNextPage() : '')}
        >
          &rarr;
        </a>
        <a
          key="last-page"
          className="pagination__page"
          onClick={() => (currentPage < numPages ? setPage(numPages) : '')}
        >
          &raquo;
        </a>
      </Fragment>
    );
  };

  return (
    <div className="pagination__main">
      {renderPrevPageBlocks()}
      {renderPageBlocks()}
      {renderNextPageBlocks()}
    </div>
  );
};

export default Pagination;
