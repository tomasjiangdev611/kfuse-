import { useCallback, useState } from 'react';

const useForceUpdate = () => {
  const [, forceUpdate] = useState(false);

  return useCallback(() => {
    forceUpdate((s) => !s);
  }, []);
};

export default useForceUpdate;
