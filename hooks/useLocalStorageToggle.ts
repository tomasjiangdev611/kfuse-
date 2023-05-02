import { useLocalStorageState } from 'hooks';

type Result = {
  off: () => void;
  on: () => void;
  toggle: () => void;
  value: boolean;
};

const useLocalStorageToggle = (key: string, initialValue = false): Result => {
  const [state, setState] = useLocalStorageState(key, initialValue);

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

export default useLocalStorageToggle;
