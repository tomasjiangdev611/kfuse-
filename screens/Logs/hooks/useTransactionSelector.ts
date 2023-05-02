import { useMemo, useState } from 'react';

const useTransactionSelector = () => {
  const [state, setState] = useState([]);
  const selectedFpBitmap = useMemo(
    () => state.reduce((obj, fpHash) => ({ ...obj, [fpHash]: 1 }), {}),
    [state],
  );

  const toggleFpHash = (toggledFpHash: string) => {
    setState((prevState) => {
      if (selectedFpBitmap[toggledFpHash]) {
        return prevState.filter((fpHash) => fpHash !== toggledFpHash);
      }

      return [...prevState, toggledFpHash];
    });
  };

  return {
    selectedFpBitmap,
    selectedFpHashes: state,
    toggleFpHash,
  };
};

export default useTransactionSelector;
