import { useState } from 'react';

const useMap = (initialState = {}) => {
  const [state, setState] = useState<{ [key: string]: any }>(initialState);

  const add = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const remove = (key) => {
    setState((prevState) => {
      const nextState = {
        ...prevState,
      };

      delete nextState[key];

      return nextState;
    });
  };

  const bulkUpdate = (nextState) => {
    setState((prevState) => ({ ...prevState, ...nextState }));
  };

  const update = (key, updated) => {
    setState((prevState) => {
      const nextState = {
        ...prevState,
      };

      const prevMember = nextState[key] || {};
      const nextMember = {
        ...prevMember,
        ...updated,
      };

      nextState[key] = nextMember;

      return nextState;
    });
  };

  const reset = () => {
    setState({});
  };

  return {
    add,
    bulkUpdate,
    remove,
    reset,
    setState,
    state,
    update,
  };
};

export default useMap;
