import { useEffect, useState } from 'react';
import useToggle from './useToggle';

const useLocalStorageState = (
  key: string,
  defaultValue = {},
): [any, any, boolean] => {
  const isReadyToggle = useToggle();
  const [state, setState] = useState(defaultValue);

  const setStateWithLocalStorage = (nextStateOrCallback) => {
    setState((prevState) => {
      const nextState =
        typeof nextStateOrCallback === 'function'
          ? nextStateOrCallback(prevState)
          : nextStateOrCallback;

      localStorage.setItem(key, JSON.stringify(nextState));
      return nextState;
    });
  };

  useEffect(() => {
    try {
      const nextState = JSON.parse(localStorage.getItem(key));
      if (
        nextState ||
        typeof nextState === 'number' ||
        typeof nextState === 'boolean'
      ) {
        setState(nextState);
      }
    } catch (e) {
      // no-op
    }

    isReadyToggle.on();
  }, []);

  return [state, setStateWithLocalStorage, isReadyToggle.value];
};

export default useLocalStorageState;
