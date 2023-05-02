import { useDateState, useRequest } from 'hooks';
import { useEffect, useState } from 'react';
import { promqlQueryRange } from 'requests';
import { DateSelection } from 'types';

import {
  MetricsChartsQueryItemProps,
  MetricsMultiDatePromqlProps,
} from '../types';
import {
  compareToPreviousList,
  getPreviousTimeRangeWithPromql,
  getPromqlQueryByIndex,
  predefinedFunctions,
  transformMetricsExplorerData,
} from '../utils';

const useMetricsChartsModal = (
  prevDate: DateSelection,
  queryItem: MetricsChartsQueryItemProps,
) => {
  const [date, setDate] = useDateState(prevDate);
  const [compareToPrev, setCompareToPrev] = useState(compareToPreviousList);
  const [functionList, setFunctionList] = useState(predefinedFunctions);
  const promqlQueryRangeRequest = useRequest(promqlQueryRange);
  const [chartData, setChartData] = useState(null);
  const [seriesBitmap, setSeriesBitmap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const callPromqlQueryRange = async () => {
    const promqlQueries = buildPromqlForCompareAndFunctions();

    setIsLoading(true);
    const datasets = await Promise.all(
      promqlQueries.map((promqlQuery) => {
        if (!promqlQuery.promql) return { data: [], series: [] };
        return promqlQueryRangeRequest
          .call({
            date: promqlQuery.date,
            promqlQueries: [promqlQuery.promql],
            metricNames: [''],
            type: 'timeseries',
          })
          .catch(() => ({ data: [], series: [] }));
      }),
    );

    const transformedData = transformMetricsExplorerData(
      datasets,
      promqlQueries,
      seriesBitmap,
    );
    setChartData(transformedData);
    setIsLoading(false);
  };

  const buildPromqlForCompareAndFunctions = () => {
    const { type } = queryItem;
    const activeFunction = functionList.find((item) => item.isActive);

    const promqlQueries: MetricsMultiDatePromqlProps[] = [];
    if (type === 'query') {
      const promqlQuery = getPromqlQueryByIndex(queryItem, activeFunction);
      promqlQueries.push({ promql: promqlQuery, date });

      const compareToPrevQueries = getPreviousTimeRangeWithPromql(
        compareToPrev,
        date,
        promqlQuery,
      );

      if (compareToPrevQueries.length > 0) {
        promqlQueries.push(...compareToPrevQueries);
      }
    }

    if (type === 'formula') {
      const promqlFormula = getPromqlQueryByIndex(queryItem, activeFunction);
      promqlQueries.push({ promql: promqlFormula, date });
      const compareToPrevQueries = getPreviousTimeRangeWithPromql(
        compareToPrev,
        date,
        promqlFormula,
      );

      if (compareToPrevQueries.length > 0) {
        promqlQueries.push(...compareToPrevQueries);
      }
    }

    return promqlQueries;
  };

  useEffect(() => {
    callPromqlQueryRange();
  }, [date]);

  return {
    callPromqlQueryRange,
    chartData,
    compareToPrev,
    date,
    isLoading,
    functionList,
    promqlQueryRangeRequest,
    setChartData,
    setCompareToPrev,
    setDate,
    setFunctionList,
    setSeriesBitmap,
  };
};

export default useMetricsChartsModal;
