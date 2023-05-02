import { TableColumnType } from 'components';
import { serviceTableKpis, ServiceTableKpiKeys } from 'constants';
import { useToggle } from 'hooks';
import { useState } from 'react';
import { queryRange } from 'requests';
import { DateSelection, SelectedFacetValuesByName, SpanFilter } from 'types';
import { getInstantRateIntervalAndStep } from 'utils';
import { formatDataset, formatKpiAsEmpty } from './utils';

const serviceTableKpiByKey = serviceTableKpis.reduce(
  (obj, kpi) => ({ ...obj, [kpi.key]: kpi }),
  {},
);

const getQueries = (
  columns: TableColumnType[],
  date: DateSelection,
  selectedFacetValuesByName: SelectedFacetValuesByName,
) => {
  const { rateInterval, stepInMs } = getInstantRateIntervalAndStep({ date });
  return columns
    .map((column) => serviceTableKpiByKey[column.key])
    .map((kpi) =>
      kpi.servicesQuery({ rateInterval, selectedFacetValuesByName, stepInMs }),
    );
};

const useKpisByServiceNameRequest = () => {
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number>();
  const [state, setState] = useState({});
  const isLoadingToggle = useToggle();

  const onDone = () => {
    setLastRefreshedAt(new Date().valueOf());
    isLoadingToggle.off();
  };

  const call = async ({
    columns,
    date,
    selectedFacetValuesByName,
    selectedColumns,
  }) => {
    setState({});
    const columnsByKey = columns.reduce(
      (obj, column) => ({ ...obj, [column.key]: column }),
      {},
    );

    setState({});
    isLoadingToggle.on();

    const filteredColumns = [
      ServiceTableKpiKeys.requests,
      ServiceTableKpiKeys.requestsPerSecond,
      ServiceTableKpiKeys.apdex,
      ServiceTableKpiKeys.errorRate,
      ServiceTableKpiKeys.maxLatency,
      ServiceTableKpiKeys.p50latency,
      ServiceTableKpiKeys.p75latency,
      ServiceTableKpiKeys.p90latency,
      ServiceTableKpiKeys.p95latency,
      ServiceTableKpiKeys.p99latency,
    ]
      .filter((key) => selectedColumns[key] && serviceTableKpiByKey[key])
      .map((key) => columnsByKey[key]);

    const concurrentColumnKeys = {
      [ServiceTableKpiKeys.requests]: 1,
      [ServiceTableKpiKeys.requestsPerSecond]: 1,
      [ServiceTableKpiKeys.apdex]: 1,
      [ServiceTableKpiKeys.errorRate]: 1,
      [ServiceTableKpiKeys.maxLatency]: 1,
    };

    const concurrentFilteredColumns = filteredColumns.filter(
      (column) => concurrentColumnKeys[column.key],
    );

    const sequentialFilteredColumns = filteredColumns.filter(
      (column) => !concurrentColumnKeys[column.key],
    );

    const concurrentQueries = getQueries(
      concurrentFilteredColumns,
      date,
      selectedFacetValuesByName,
    );

    const sequentialQueries = getQueries(
      sequentialFilteredColumns,
      date,
      selectedFacetValuesByName,
    );

    await Promise.all(
      concurrentQueries.map((query, i) =>
        queryRange({ date, instant: true, query }).then(
          formatDataset(setState, concurrentFilteredColumns[i].key),
          formatKpiAsEmpty(setState, concurrentFilteredColumns[i].key),
        ),
      ),
    );

    for (let i = 0; i < sequentialQueries.length; i += 1) {
      const query = sequentialQueries[i];
      try {
        const dataset = await queryRange({ date, instant: true, query });
        formatDataset(setState, sequentialFilteredColumns[i].key)(dataset);
      } catch (e) {
        formatKpiAsEmpty(setState, sequentialQueries[i].key)();
      }
    }

    onDone();
  };

  const fetchSingleColumn = ({ date, key, selectedFacetValuesByName }) => {
    const kpi = serviceTableKpis.find((kpi) => kpi.key === key);
    if (kpi) {
      const { rateInterval, stepInMs } = getInstantRateIntervalAndStep({
        date,
      });
      const query = kpi.servicesQuery({
        rateInterval,
        selectedFacetValuesByName,
        stepInMs,
      });
      queryRange({ date, instant: true, query }).then(
        formatDataset(state, setState, kpi.key),
        formatKpiAsEmpty(setState, kpi.key),
      );
    }
  };

  return {
    call,
    fetchSingleColumn,
    isLoading: isLoadingToggle.value,
    lastRefreshedAt,
    result: state,
  };
};

export default useKpisByServiceNameRequest;
