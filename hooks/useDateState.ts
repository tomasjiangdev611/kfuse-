import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DateSelection } from 'types';

const KEY = 'date';

const getInitialState = () => {
  const endTimeUnix = dayjs().unix();
  const startTimeUnix = dayjs()
    .subtract(60 * 5, 'seconds')
    .unix();

  return {
    startLabel: 'now-5m',
    endLabel: 'now',
    endTimeUnix,
    startTimeUnix,
  };
};

const useDateState = (initialDate?: DateSelection): [DateSelection, any] => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialStateFromParams = params.get(KEY);

  const [state, setState] = useState<DateSelection>(
    initialStateFromParams
      ? JSON.parse(initialStateFromParams)
      : initialDate || getInitialState(),
  );

  const setStateAndUpdateUrl = (
    nextState: DateSelection | ((prevState: DateSelection) => DateSelection),
  ) => {
    setState((prevState) => {
      const computedNextState =
        typeof nextState === 'function' ? nextState(prevState) : nextState;

      params.delete('live-tail');
      params.set(
        KEY,
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
