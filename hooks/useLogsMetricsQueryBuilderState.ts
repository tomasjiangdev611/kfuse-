import { useRequest, useUrlState } from 'hooks';
import { useEffect, useMemo } from 'react';
import { getFacetNames } from 'requests';
import { DateSelection, LogsMetricQueryProps } from 'types';
import { getFacetNamesOptionsForAlert } from 'utils';

const defaultQuery: LogsMetricQueryProps = {
  metric: '*',
  normalizeFunction: 'number',
  queryKey: 'a',
  rangeAggregate: 'rate',
  rangeAggregateGrouping: [],
  rangeAggregateExclude: false,
  vectorAggregate: 'none',
  vectorAggregateGrouping: [],
  vectorAggregateExclude: false,
};

const useLogsMetricsQueryBuilderState = (
  date: DateSelection,
  initialState?: LogsMetricQueryProps[],
) => {
  const [queries, setQueries] = useUrlState(
    'LogsMetricsQueries',
    initialState ? initialState : [defaultQuery],
  );
  const facetNamesRequest = useRequest(getFacetNames);

  const addQuery = () => {
    setQueries((prevState: LogsMetricQueryProps[]) => [
      ...prevState,
      ...[
        {
          ...defaultQuery,
          queryKey: String.fromCharCode(prevState.length + 97),
        },
      ],
    ]);
  };

  const removeQuery = (index: number) => {
    setQueries((prevState: LogsMetricQueryProps[]) =>
      prevState.filter((_, i) => i !== index),
    );
  };

  const updateQuery = (queryIndex: number, propertyKey: string, value: any) => {
    setQueries((prevState: LogsMetricQueryProps[]) => {
      const newState = [...prevState];
      const newQuery = { ...newState[queryIndex] };
      newQuery[propertyKey] = value;
      newState[queryIndex] = newQuery;
      return newState;
    });
  };

  const facetNamesOptions = useMemo(
    () => getFacetNamesOptionsForAlert(facetNamesRequest.result || []),
    [facetNamesRequest.result],
  );

  return {
    addQuery,
    facetNamesOptions,
    facetNamesRequest,
    queries,
    removeQuery,
    updateQuery,
  };
};

export default useLogsMetricsQueryBuilderState;
