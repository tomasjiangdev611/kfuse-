import { useLeftSidebarState } from 'components';
import { useState } from 'react';

const useQueryScheduler = (
  leftSidebarState: ReturnType<typeof useLeftSidebarState>,
) => {
  const [state, setState] = useState({
    firstQueryCompletedAt: null,
    secondQueryCompletedAt: null,
    tab: null,
    zoomHasBeenUpdated: false,
  });

  const setFirstQueryCompletedAt =
    ({ tab, zoomHasBeenUpdated }) =>
    () => {
      setState((prevState) => {
        if (
          tab &&
          prevState.tab &&
          prevState.tab !== tab &&
          prevState.tab === !('fingerprint' && tab === 'logs')
        ) {
          return { ...prevState, tab };
        }

        const completedAt = new Date().valueOf();
        return {
          ...prevState,
          firstQueryCompletedAt: completedAt,
          secondQueryCompletedAt:
            leftSidebarState.width === 0
              ? completedAt
              : prevState.secondQueryCompletedAt,
          tab: tab || prevState.tab,
          zoomHasBeenUpdated,
        };
      });
    };

  const setSecondQueryCompletedAt = () => {
    setState((prevState) => ({
      ...prevState,
      secondQueryCompletedAt: new Date().valueOf(),
    }));
  };

  return {
    ...state,
    setFirstQueryCompletedAt,
    setSecondQueryCompletedAt,
  };
};

export default useQueryScheduler;
