import { useUrlState } from 'hooks';
import { getIsDeselecting } from 'utils';

const toggleFacetHelper = ({ isSelecting, prevState = {}, value }) => {
  const isDeselecting =
    typeof isSelecting === 'boolean' ? false : getIsDeselecting(prevState);
  const nextState = { ...prevState };

  if (value in prevState) {
    delete nextState[value];
    return nextState;
  }

  nextState[value] = isDeselecting ? 0 : 1;
  return nextState;
};

const useSelectedFacetValuesByNameState = () => {
  const [state, setState] = useUrlState('selectedFacetValuesByName', {});

  const clearFacet = (name) => {
    setState((prevState) => {
      const nextState = { ...prevState };
      delete nextState[name];
      return nextState;
    });
  };

  const excludeFacetValue = ({ name, value }) => {
    setState((prevState) => ({
      ...prevState,
      [name]: {
        [value]: 0,
      },
    }));
  };

  const selectOnlyFacetValue = ({ name, value }) => {
    setState((prevState) => ({
      ...prevState,
      [name]: {
        [value]: 1,
      },
    }));
  };

  const toggleFacetValue = ({ isSelecting = false, name, value }) => {
    setState((prevState) => ({
      ...prevState,
      [name]: toggleFacetHelper({
        isSelecting,
        prevState: prevState[name],
        value,
      }),
    }));
  };

  return {
    clearFacet,
    excludeFacetValue,
    selectOnlyFacetValue,
    state,
    toggleFacetValue,
  };
};

export default useSelectedFacetValuesByNameState;
