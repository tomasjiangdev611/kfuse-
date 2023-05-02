import { useLocalStorageState } from 'hooks';

const useTableOptions = () => {
  const [state, setState] = useLocalStorageState('logs-table-options', {
    linesToShow: 1,
  });

  const setLinesToShow = (nextLinesToShow: number) => {
    setState((prevState) => ({
      ...prevState,
      linesToShow: nextLinesToShow,
    }));
  };

  return {
    setLinesToShow,
    state,
  };
};

export default useTableOptions;
