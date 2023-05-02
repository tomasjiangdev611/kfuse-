import { ReactNode, useState } from 'react';

const useModals = () => {
  const [state, setState] = useState([]);

  const pop = () => {
    setState((prevState) => prevState.slice(0, prevState.length - 1));
  };

  const push = (component: ReactNode) => {
    setState((prevState) => [...prevState, component]);
  };

  return {
    pop,
    push,
    stack: state,
  };
};

export default useModals;
