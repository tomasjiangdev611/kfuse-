import React from 'react';
import useTableSearch from './useTableSearch';
import { Input } from '../Input';

type Props = {
  tableSearch: ReturnType<typeof useTableSearch>;
};

const TableSearch = ({ tableSearch }: Props) => {
  return (
    <div className="table-search">
      <Input
        className="input--small"
        onChange={tableSearch.setSearch}
        placeholder="Search"
        type="text"
        value={tableSearch.search}
      />
    </div>
  );
};

export default TableSearch;
