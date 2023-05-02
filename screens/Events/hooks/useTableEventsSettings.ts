import { useLocalStorageState } from 'hooks';

const useTableEventsSettings = () => {
  const [tableEventsSettings, setTableEventsSettings] = useLocalStorageState(
    'tableEventsSettings',
    { listDensity: 'Expanded' },
  );

  return { tableEventsSettings, setTableEventsSettings };
};

export default useTableEventsSettings;
