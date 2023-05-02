import { useDateState, useLocalStorageState, useRequest } from 'hooks';
import { getMetricsList, promqlMetadata, promqlSeries } from 'requests';
import { useEffect, useState } from 'react';
import { DateSelection } from 'types';

import { MetricSeriesProps, MertricsSummaryProps } from './types';
import { metricOriginOptions, parseMetricList } from './utils';
import { AutocompleteOption } from 'components/Autocomplete';

const useMetricsSummary = () => {
  const [date, setDate] = useDateState();
  const [absoluteTimeRangeStorage, setabsoluteTimeRangeStorage] =
    useLocalStorageState('AbsoluteTimeRange', []);

  const [metricsList, setMetricsList] = useState<MertricsSummaryProps[]>([]);
  const [metricSearch, setMetricSearch] = useState({
    search: '',
    type: [],
    origin: [],
  });
  const [tagSearch, setTagSearch] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<MertricsSummaryProps>();
  const [metricSeries, setMetricSeries] = useState<MetricSeriesProps>();
  const [filterOptions, setFilterOptions] = useState<{
    type: AutocompleteOption[];
    origin: AutocompleteOption[];
  }>({ type: [], origin: metricOriginOptions });

  const promqlMetadataRequest = useRequest(promqlMetadata);
  const getMetricsListRequest = useRequest(getMetricsList);
  const promqlSeriesRequest = useRequest(promqlSeries);

  const onDateChange = (nextDate: DateSelection) => {
    const { startTimeUnix, endTimeUnix, startLabel, endLabel } = nextDate;
    if (!startLabel && !endLabel) {
      setabsoluteTimeRangeStorage((preHistory) => {
        if (preHistory.length > 3) {
          preHistory.pop();
        }
        return [...[{ startTimeUnix, endTimeUnix }], ...preHistory];
      });
    }

    setDate(nextDate);
  };

  const getMetricMetadata = async () => {
    const metaDateset = await Promise.all([
      promqlMetadataRequest.call(''),
      getMetricsListRequest.call(date),
    ]);

    if (!metaDateset[0] || !metaDateset[1]) return;

    const [metadataResponse, metricsListResponse] = metaDateset;
    const newMetadataList: { [key: string]: MertricsSummaryProps[] } = {};
    const typeBitMap: { [key: string]: boolean } = {};
    metricsListResponse.forEach((metric: string) => {
      if (metadataResponse[metric]) {
        newMetadataList[metric] = metadataResponse[metric];
        const metricType = metadataResponse[metric][0].type;
        if (metricType && !typeBitMap[metricType]) {
          typeBitMap[metricType] = true;
        }
      }
    });
    const parsedMetricList = parseMetricList(newMetadataList);
    setMetricsList(parsedMetricList);
    setFilterOptions((prev) => {
      return {
        ...prev,
        type: Object.keys(typeBitMap).map((type) => ({
          label: type,
          value: type,
        })),
      };
    });
  };

  useEffect(() => {
    getMetricMetadata();
  }, [date]);

  return {
    absoluteTimeRangeStorage,
    date,
    filterOptions,
    metricsList,
    metricSearch,
    metricSeries,
    onDateChange,
    getMetricsListRequest,
    promqlMetadataRequest,
    promqlSeriesRequest,
    selectedMetric,
    setabsoluteTimeRangeStorage,
    setMetricSearch,
    setMetricSeries,
    setSelectedMetric,
    setTagSearch,
    tagSearch,
  };
};

export default useMetricsSummary;
