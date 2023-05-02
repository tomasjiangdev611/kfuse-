import { useMemo, useState } from 'react';

const useTableSearch = ({ rows }) => {
  const [search, setSearch] = useState('');

  const searchedRows: string[] = useMemo(() => {
    const searchLowered = search.toLowerCase().trim();

    if (searchLowered) {
      return rows.filter(
        (row) => JSON.stringify(row).toLowerCase().indexOf(searchLowered) > -1,
      );
    }

    return rows;
  }, [rows, search]);

  return {
    search,
    searchedRows,
    setSearch,
  };
};

export default useTableSearch;
