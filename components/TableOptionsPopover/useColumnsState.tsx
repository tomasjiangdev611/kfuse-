import { TableColumn } from 'components';
import { useLocalStorageState, useToggle } from 'hooks';
import { useMemo } from 'react';

const getResizedWidth = ({ columnsByKey, deltaX, key, prevResizedWidths }) => {
  const prevWidth = prevResizedWidths[key] || columnsByKey[key].width;
  return Math.max(deltaX + prevWidth, 40);
};

type State = {
  resizedWidths: { [key: string]: number };
  selectedColumns: { [key: string]: number };
};

type Args = {
  columns: TableColumn<any>[];
  initialState: State;
  key: string;
  onSelectedColumnToggle?: (args) => void;
};

const useColumnsState = ({
  columns,
  key,
  initialState,
  onSelectedColumnToggle,
}: Args) => {
  const [state, setState, isReady] = useLocalStorageState(key, initialState);

  const columnsByKey = useMemo(() => {
    return columns.reduce(
      (obj, column) => ({ ...obj, [column.key]: column }),
      {},
    );
  }, [columns]);

  const resizeColumnByKey = (key: string, deltaX) => {
    setState((prevState) => ({
      ...prevState,
      resizedWidths: {
        ...prevState.resizedWidths,
        [key]: getResizedWidth({
          columnsByKey,
          deltaX,
          key,
          prevResizedWidths: prevState.resizedWidths,
        }),
      },
    }));
  };

  const toggleSelectedColumnByKey = (key: string) => {
    setState((prevState) => {
      const isSelected = prevState.selectedColumns[key] ? 0 : 1;
      if (onSelectedColumnToggle) {
        onSelectedColumnToggle({ key, isSelected });
      }

      return {
        ...prevState,
        selectedColumns: {
          ...prevState.selectedColumns,
          [key]: isSelected,
        },
      };
    });
  };

  return {
    columns,
    isReady,
    renderedColumns: columns.filter(
      (column) => state.selectedColumns[column.key],
    ),
    resizeColumnByKey,
    state,
    toggleSelectedColumnByKey,
  };
};

export default useColumnsState;
