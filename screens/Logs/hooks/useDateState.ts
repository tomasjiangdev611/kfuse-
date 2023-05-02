import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DateSelection } from 'types';

const useDateState = (key: string, initialState: any) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialStateFromParams = params.get(key);

  const [state, setState] = useState<DateSelection>(
    initialStateFromParams ? JSON.parse(initialStateFromParams) : initialState,
  );

  const setStateAndUpdateUrl = (nextState) => {
    setState((prevState) => {
      const computedNextState =
        typeof nextState === 'function' ? nextState(prevState) : nextState;

      params.delete('live-tail');
      params.set(
        key,
        JSON.stringify({
          ...computedNextState,
          startLabel: null,
          endLabel: null,
        }),
      );
      navigate(`?${params.toString()}`, { replace: true });

      return computedNextState;
    });
  };

  return [state, setStateAndUpdateUrl];
};

export default useDateState;
