import useMergeState from './useMergeState';

interface State<T> {
  values: T;
}

export type UseFormOptions<T> = {
  onChange?: ({
    key,
    value,
    values,
  }: {
    key: keyof T;
    value: any;
    values: T;
  }) => void;
  preChange?: ({
    key,
    value,
    values,
  }: {
    key: keyof T;
    value: any;
    values: T;
  }) => T;
};

const useForm = <T>(initialValues: T, options?: UseFormOptions<T>) => {
  const [state, setState] = useMergeState<State<T>>({
    values: initialValues,
  });

  const onChange = (key: keyof T, value: any) => {
    setState((prevState: T) => {
      const nextValues = {
        ...prevState.values,
        [key]: value,
      };

      if (options?.onChange) {
        options.onChange({ key, value, values: nextValues });
      }

      return {
        values: options?.preChange
          ? options.preChange({ key, value, values: nextValues })
          : nextValues,
      };
    });
  };

  const propsByKey = (key: keyof T) => ({
    onChange: (value: any) => {
      onChange(key, value);
    },
    value: state.values[key],
  });

  const addArrayItemByKey = (key: keyof T, nextItem: any) => {
    const nextValue = [...state.values[key], nextItem];
    onChange(key, nextValue);
  };

  const arrayItemPropsByKey =
    (key: keyof T, index: number) => (innerKey: string) => ({
      onChange: (value: any) => {
        const nextValue = [...state.values[key]];
        nextValue[index] = { ...state.values[key][index], [innerKey]: value };
        onChange(key, nextValue);
      },
      value: state.values[key][index][innerKey],
    });

  const clear = () => {
    setState((prevState) => ({ ...prevState, values: initialValues }));
  };

  const setValue = (key, nextValue) => {
    setState((prevState) => ({
      ...prevState,
      values: {
        ...prevState.values,
        [key]: nextValue,
      },
    }));
  };

  const toggleMapItem = (key, item) => {
    setState((prevState) => {
      const nextMap = prevState.values[key] || {};
      nextMap[item] = nextMap[item] ? 0 : 1;

      const nextValues = { ...prevState.values };
      nextValues[key] = nextMap;

      return {
        ...prevState,
        values: nextValues,
      };
    });
  };

  return {
    addArrayItemByKey,
    arrayItemPropsByKey,
    clear,
    onChange,
    propsByKey,
    setValue,
    toggleMapItem,
    values: state.values,
  };
};

export default useForm;
