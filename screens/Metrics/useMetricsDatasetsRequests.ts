import { useReducer } from 'react';
import { getMetricDatasets } from 'requests';

enum ActionTypes {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
}

const initialState = {
  isLoading: false,
  result: null,
};

const metricDatasetsRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_START:
      return {
        ...state,
        isLoading: true,
      };

    case ActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        result: action.result,
      };
    default:
      return state;
  }
};

const metricsDatasetsRequestsReducer = (state, action) => {
  return {
    ...state,
    [action.metricName]: metricDatasetsRequestReducer(
      state[action.metricName],
      action,
    ),
  };
};

const useMetricsDatasetsRequests = () => {
  const [state, dispatch] = useReducer(metricsDatasetsRequestsReducer, {});

  const query = (metricName: string, secondsFromNow: number) => {
    if (metricName && secondsFromNow) {
      const onSuccess = (result) => {
        dispatch({ metricName, result, type: ActionTypes.FETCH_SUCCESS });
      };

      dispatch({ metricName, type: ActionTypes.FETCH_START });
      getMetricDatasets(metricName, secondsFromNow).then(onSuccess);
    }
  };

  return {
    query,
    requests: state,
  };
};

export default useMetricsDatasetsRequests;
