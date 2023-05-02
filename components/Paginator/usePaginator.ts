import { useLocalStorageState } from 'hooks';
import { useEffect } from 'react';

type Args = {
  key: string;
  rows: any[];
};

const usePaginator = ({ key, rows }: Args) => {
  const [state, setState] = useLocalStorageState(key, {
    activePageIndex: 0,
    numberOfRowsPerPage: null,
  });

  const { activePageIndex, numberOfRowsPerPage } = state;

  const setActivePageIndex = (nextActivePageIndex) => {
    setState((prevState) => ({
      ...prevState,
      activePageIndex:
        typeof nextActivePageIndex === 'function'
          ? nextActivePageIndex(prevState.activePageIndex)
          : nextActivePageIndex,
    }));
  };

  const setNumberOfRowsPerPage = (nextNumberOfRowsPerPage: number) => {
    setState((prevState) => ({
      activePageIndex: 0,
      numberOfRowsPerPage: nextNumberOfRowsPerPage,
    }));
  };

  const maxNumberOfPages = Math.ceil(rows.length / numberOfRowsPerPage);

  useEffect(() => {
    setActivePageIndex(0);
  }, [rows]);

  return {
    activePageIndex,
    maxNumberOfPages,
    numberOfRowsPerPage,
    paginatedRows:
      numberOfRowsPerPage === null
        ? rows
        : rows.slice(
            activePageIndex * numberOfRowsPerPage,
            activePageIndex * numberOfRowsPerPage + numberOfRowsPerPage,
          ),
    rowsCount: rows.length,
    setActivePageIndex,
    setNumberOfRowsPerPage,
    showPrevPage: () => {
      setActivePageIndex((prevActivePageIndex) =>
        Math.max(0, prevActivePageIndex - 1),
      );
    },
    showNextPage: () => {
      setActivePageIndex((prevActivePageIndex) =>
        Math.min(prevActivePageIndex + 1, maxNumberOfPages - 1),
      );
    },
  };
};

export default usePaginator;
