import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useUrlSearchParams = () => {
  const [state, setState] = useState<URLSearchParams>(new URLSearchParams());
  const location = useLocation();

  useEffect(() => {
    if (state.toString() !== location.search) {

      setState(new URLSearchParams(location.search));
    }
  }, [location]);

  return state;
};

export default useUrlSearchParams;
