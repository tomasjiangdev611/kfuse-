import { useMergeState } from 'hooks';
import { Widget as WidgetType } from 'types';

const saveState = (state) => {
  localStorage.setItem('state', JSON.stringify(state));
};

const loadState = () => {
  return JSON.parse(localStorage.getItem('state'));
};

const useWidgets = () => {
  const [state, setState] = useMergeState({
    rows: [],
  });

  const setAndPersistState = (nextStateCallback) => {
    setState((prevState) => {
      const nextState = nextStateCallback(prevState);
      saveState(nextState);
      return nextState;
    });
  };

  const addWidgetToNewRow = (widget) => {
    setAndPersistState((prevState) => {
      const newRow = [widget];
      const nextRows = [...prevState.rows, newRow];

      return {
        rows: nextRows,
      };
    });
  };

  const addWidgetToRow = (rowIndex: number, widget: any) => {
    setAndPersistState((prevState) => {
      const nextRows = [...prevState.rows];
      const row = [...prevState.rows[rowIndex], widget];
      nextRows[rowIndex] = row;

      return {
        rows: nextRows,
      };
    });
  };

  const editWidget = (
    rowIndex: number,
    widgetIndex: number,
    widget: WidgetType,
  ) => {
    setAndPersistState((prevState) => {
      const nextRows = [...prevState.rows];
      const nextRow = [...prevState.rows[rowIndex]];
      nextRow[widgetIndex] = widget;
      nextRows[rowIndex] = nextRow;

      return {
        rows: nextRows,
      };
    });
  };

  const removeWidget = (rowIndex: number, widgetIndex: number) => {
    setAndPersistState((prevState) => {
      const nextRows = [...prevState.rows];
      const nextRow = [...prevState.rows[rowIndex]];
      nextRow.splice(widgetIndex, 1);

      if (nextRow.length === 0) {
        nextRows.splice(rowIndex, 1);
      } else {
        nextRows[rowIndex] = nextRow;
      }

      return {
        rows: nextRows,
      };
    });
  };

  const load = () => {
    const loadedState = loadState();
    if (loadedState !== null) {
      setState(loadedState);
    }
  };

  return {
    ...state,
    addWidgetToNewRow,
    addWidgetToRow,
    editWidget,
    load,
    removeWidget,
  };
};

export default useWidgets;
