import { useNavigate } from 'react-router-dom';
import useForm, { UseFormOptions } from './useForm';

const useQueryParamsForm = <T,>(
  initialValues: T,
  options: UseFormOptions<T>,
): ReturnType<typeof useForm> => {
  const navigate = useNavigate();

  const initialValuesReadFromParams = (initialValues: T) => {
    const result = {};

    const nextParams = new URLSearchParams(window.location.search);
    Object.keys(initialValues).forEach((key) => {
      const value = nextParams.get(key) || initialValues[key];
      nextParams.set(key, value);
      result[key] = value;
    });

    navigate.replace({ search: nextParams.toString() });

    return result;
  };

  const form = useForm(initialValuesReadFromParams(initialValues), {
    onChange: ({ key, value, values }) => {
      const nextParams = new URLSearchParams(location.search);
      nextParams.set(String(key), String(value));

      navigate.replace({ search: nextParams.toString() });

      if (options?.onChange) {
        options.onChange({ key, value, values });
      }
    },
    preChange: options?.preChange,
  });

  return form;
};

export default useQueryParamsForm;
