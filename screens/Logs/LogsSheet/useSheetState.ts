import { useState } from 'react';

const initialState = {
  locked: {},
  selection: {
    initX: null,
    initY: null,
    startX: null,
    startY: null,
    endX: null,
    endY: null,
  },
  scroll: {
    firstRowIndex: 0,
    firstRowOffset: 0,
    scrollX: 0,
    scrollY: 0,
  },
};

const useSheetState = () => {
  const [state, setState] = useState(initialState);

  const onAutoScroll = (scroll, selection) => {
    setState((prevState) => ({
      ...prevState,
      scroll,
      selection: {
        ...prevState.selection,
        ...selection,
      },
    }));
  };

  const onScrollUpdate = (scroll) => {
    setState((prevState) => ({ ...prevState, scroll }));
  };

  const onSelectionUpdate = (selection) => {
    const { startX, startY, endX, endY } = state.selection;
    if (
      startX !== selection.startX ||
      startY !== selection.startY ||
      endX !== selection.endX ||
      endY !== selection.endY
    ) {
      setState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          ...selection,
        },
      }));
    }
  };

  const resetSelection = () => {
    setState(prevState => ({
      ...prevState,
      selection: initialState.selection,
    }))
  };

  const onToggleLock = (columnIndex) => {
    setState((prevState) => ({
      ...prevState,
      locked: {
        ...prevState.locked,
        [columnIndex]: prevState.locked[columnIndex] ? 0 : 1,
      },
    }));
  };

  return {
    onAutoScroll,
    onScrollUpdate,
    onSelectionUpdate,
    onToggleLock,
    resetSelection,
    state,
  };
};

export default useSheetState;
