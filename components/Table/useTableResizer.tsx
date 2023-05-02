import { MouseMoverCoordinates } from 'hooks';
import { useEffect, useState } from 'react';
import { TableColumn, TableWidths } from './types';

interface Args<T> {
  columns: TableColumn<T>[];
}

type Result = {
  isTableReady: boolean;
  onMouseMoveHandler: (
    leftColumnIndex: number,
  ) => (coordinates: MouseMoverCoordinates) => void;
  registerWidth: (key: string, width: number) => void;
  widths: TableWidths;
};

const useTableResizer = <T,>({ columns }: Args<T>): Result => {
  const [state, setState] = useState<{ [key: string]: number }>({});
  const [isTableReady, setIsTableReady] = useState<boolean>(false);

  const onMouseMoveHandler =
    (leftColumnIndex: number) =>
    ({ deltaX }: MouseMoverCoordinates) => {
      setState((prevState) => {
        const leftColumnKey = columns[leftColumnIndex].key;
        const nextColumnWidth = prevState[leftColumnKey] + deltaX;
        const nextState = {
          ...prevState,
          [leftColumnKey]: Math.max(50, nextColumnWidth),
        };
        localStorage.setItem('logsTableWidths', JSON.stringify(nextState));

        return nextState;
      });
    };

  const registerWidth = (key: string, width: number) => {
    setState((prevState) => {
      const nextState = {
        ...prevState,
        [key]: width,
      };
      localStorage.setItem('logsTableWidths', JSON.stringify(nextState));
      return nextState;
    });
  };

  const init = async () => {
    const initialState = await localStorage.getItem('logsTableWidths');
    if (initialState) {
      setState(JSON.parse(initialState));
    }
    setIsTableReady(true);
  };

  useEffect(() => {
    init();
  }, []);

  return {
    isTableReady,
    onMouseMoveHandler,
    registerWidth,
    widths: state,
  };
};

export default useTableResizer;
