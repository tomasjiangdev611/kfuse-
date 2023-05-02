import { useState } from 'react';

type SetStateMergeCallBack<T> = (prevState: T) => Partial<T>;

const useMergeState = <T>(
  initialState: T,
): [T, (nextState: Partial<T>) => void] => {
  const [state, setState] = useState<T>(initialState);

  const setStateMerge = (nextState: Partial<T> | SetStateMergeCallBack<T>) => {
    setState((prevState: T) => {
      return {
        ...prevState,
        ...(typeof nextState === 'function' ? nextState(prevState) : nextState),
      };
    });
  };

  return [state, setStateMerge];
};

export default useMergeState;
