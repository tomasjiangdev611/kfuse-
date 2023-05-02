import { useMemo, useState } from 'react';
import getValue from './getValue';
import { TableColumn, TableColumnType } from './types';
import {
  sortTableRowsNumerically,
  sortTableRowsLexicographically,
} from './utils';

type Args = {
  columns: TableColumn<any>[];
  rows: any;
};

type State = {
  key: string;
  asc: boolean;
};

const useTableSort = ({ columns, rows }: Args) => {
  const [state, setState] = useState<State>({ asc: true, key: null });
  const { asc, key } = state;
  const onSort = (nextKey: string) => {
    setState((prevState) => ({
      key: nextKey,
      asc: nextKey === prevState.key ? !prevState.asc : true,
    }));
  };

  const sortedRows = useMemo(() => {
    if (state.key) {
      const columnsByKey = columns.reduce(
        (obj, column) => ({ ...obj, [column.key]: column }),
        {},
      );

      const column = columnsByKey[key];
      if (column) {
        if (column.type === TableColumnType.NUMBER) {
          return rows.sort(sortTableRowsNumerically({ asc, column }));
        }
      }

      return rows.sort(sortTableRowsLexicographically({ asc, column }));
    }

    return rows;
  }, [columns, rows, state]);

  return {
    ...state,
    onSort,
    sortedRows,
  };
};

export default useTableSort;
