import { useToastmasterContext } from 'components';
import { useState } from 'react';
import { RequestState, RequestResult } from 'types';
import { parseError } from 'utils';

const useRequest = (callback: any): RequestResult => {
  const { addToast } = useToastmasterContext();
  const [state, setState] = useState<RequestState>({
    calledAtLeastOnce: false,
    error: null,
    isLoading: false,
    result: null,
  });

  return {
    ...state,
    call: (...args: any[]) => {
      setState((prevState) => ({
        ...prevState,
        error: null,
        calledAtLeastOnce: true,
        isLoading: true,
      }));

      const onSuccess = (result: any) => {
        setState((prevState) => ({ ...prevState, result, isLoading: false }));
        return result;
      };

      const onError = (error: Error) => {
        setState((prevState) => ({ ...prevState, error, isLoading: false }));
        if (error.message === 'Unauthorized') {
          return Promise.reject(error);
        }

        if (error.message === 'empty ResultTable') {
          return Promise.resolve([]);
        }

        const errorMessage = parseError(error);
        if (errorMessage) {
          addToast({
            status: 'error',
            text: errorMessage,
            timeout: 4000,
          });
        }
        return Promise.reject(error);
      };

      return callback(...args).then(onSuccess, onError);
    },

    clear: () => {
      setState({
        calledAtLeastOnce: false,
        error: null,
        isLoading: false,
        result: null,
      });
    },

    clearError: () => {
      setState((prevState) => ({
        ...prevState,
        error: null,
      }));
    },
  };
};

export default useRequest;
