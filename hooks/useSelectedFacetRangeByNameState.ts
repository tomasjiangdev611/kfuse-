import { useState } from 'react';

type State = {
  [key: string]: {
    lower: number;
    upper: number;
  };
};

const useSelectedFacetRangeByNameState = () => {
  const [state, setState] = useState<State>({});

  const changeFacetRange =
    ({ name }: { name: string }) =>
    (nextRange) => {
      setState((prevState) => {
        const nextState = { ...prevState };
        nextState[name] = nextRange;
        return nextState;
      });
    };

  const clearFacet = (name: string) => {
    setState((prevState) => {
      const nextState = { ...prevState };
      delete nextState[name];
      return nextState;
    });
  };

  return {
    changeFacetRange,
    clearFacet,
    state,
  };
};

export default useSelectedFacetRangeByNameState;
