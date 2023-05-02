import { useState } from 'react';

type Result = {
  off: () => void;
  on: () => void;
  toggle: () => void;
  value: boolean;
};

const useToggle = (initialValue = false): Result => {
  const [state, setState] = useState<boolean>(initialValue);

  const on = () => {
    setState(true);
  };

  const off = () => {
    setState(false);
  };

  const toggle = () => {
    setState((prevState) => !prevState);
  };

  return {
    off,
    on,
    toggle,
    value: state,
  };
};

export default useToggle;
