import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const useUrlState = (key: string, initialState: any) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialStateFromParams = params.get(key);

  const [state, setState] = useState(
    initialStateFromParams ? JSON.parse(initialStateFromParams) : initialState,
  );

  const setStateAndUpdateUrl = (nextState) => {
    setState((prevState) => {
      const computedNextState =
        typeof nextState === 'function' ? nextState(prevState) : nextState;

      params.set(key, JSON.stringify(computedNextState));
      navigate(`?${params.toString()}`, { replace: true });

      return computedNextState;
    });
  };

  return [state, setStateAndUpdateUrl];
};

export default useUrlState;
