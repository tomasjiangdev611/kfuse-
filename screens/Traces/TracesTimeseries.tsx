import { ChartGridV2, useModalsContext } from 'components';
import { useRequest, useSearch } from 'hooks';
import React, { useMemo } from 'react';
import { AiOutlineSave } from 'react-icons/ai';
import { aggregateTimeSeries, getSavedTraceMetrics } from 'requests';
import {
  ChartJsData,
  ChartGridItem,
  DateSelection,
  SelectedFacetRangeByName,
  SelectedFacetValuesByName,
  SpanFilter,
  TimeSeries,
} from 'types';
import { calcAutoRollUpInSeconds } from 'utils';
import TracesSaveMetricsModal from './TracesSaveMetricsModal';
import TracesTimeseriesSavedMetrics from './TracesTimeseriesSavedMetrics';

const formatData = (points: TimeSeries[]): ChartGridItem => {
  const keysBitmap: { [key: string]: number } = {};
  const valuesByBucketStart: { [key: string]: ChartJsData } = {};

  points.forEach((point) => {
    const { BucketStart, GroupVal, Value } = point;
    const keys = Object.keys(GroupVal);

    const key =
      keys.length === 0
        ? 'count'
        : keys
            .sort()
            .map((key) => `${key}=${GroupVal[key]}`)
            .join('-');

    if (!keysBitmap[key]) {
      keysBitmap[key] = 1;
    }

    if (!valuesByBucketStart[BucketStart]) {
      valuesByBucketStart[BucketStart] = {};
    }

    valuesByBucketStart[BucketStart][key] = Value;
  });

  const timestamps = Object.keys(valuesByBucketStart).sort();

  return {
    data: timestamps.map((timestamp) => valuesByBucketStart[timestamp]),
    keys: Object.keys(keysBitmap),
    timestamps: timestamps.map((timestamp) =>
      Math.floor(Number(timestamp) / 1000),
    ),
  };
};

const getRows = (
  openSaveMetricModal: VoidFunction,
  selectedFacetRangeByName: SelectedFacetRangeByName,
  selectedFacetValuesByName: SelectedFacetValuesByName,
  state: ReturnType<typeof useSearch>['state'],
) => {
  const { groupBys, measure, operation, rollUpInSeconds } = state;

  return [
    [
      {
        charts: [
          {
            key: 'requestsPerSecond',
            additionalButtons: [
              {
                icon: <AiOutlineSave size={20} />,
                onClick: openSaveMetricModal,
                tooltip: 'Save trace metric',
              },
            ],
            chartType: 'bar',
            disableExplore: true,
            label: state.measure ? state.measure : 'Spans',
            marginLeft: 20,
            query: ({ date, width }) =>
              aggregateTimeSeries({
                aggregation: operation,
                aggregationField: measure,
                date,
                groupBys,
                rollUpSeconds: rollUpInSeconds || calcAutoRollUpInSeconds(date),
                selectedFacetRangeByName,
                selectedFacetValuesByName,
              }).then(formatData),
          },
        ],
      },
    ],
  ];
};

type Props = {
  date: DateSelection;
  search: ReturnType<typeof useSearch>;
  selectedFacetRangeByName: SelectedFacetRangeByName;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  spanFilter: SpanFilter;
  traceIdSearch: string;
};

const TracesTimeseries = ({
  date,
  search,
  selectedFacetRangeByName,
  selectedFacetValuesByName,
  spanFilter,
  traceIdSearch,
}: Props) => {
  const getSavedTraceMetricsRequest = useRequest(getSavedTraceMetrics);
  const modals = useModalsContext();
  const { state } = search;

  const openSaveMetricModal = () => {
    modals.push(
      <TracesSaveMetricsModal
        getSavedTraceMetricsRequest={getSavedTraceMetricsRequest}
        selectedFacetRangeByName={selectedFacetRangeByName}
        selectedFacetValuesByName={selectedFacetValuesByName}
        spanFilter={spanFilter}
        search={search}
        traceIdSearch={traceIdSearch}
      />,
    );
  };

  const rows = useMemo(
    () =>
      getRows(
        openSaveMetricModal,
        selectedFacetRangeByName,
        selectedFacetValuesByName,
        state,
      ),
    [date, selectedFacetRangeByName, selectedFacetValuesByName, state],
  );

  return (
    <div className="traces__timeseries">
      <ChartGridV2.ChartGrid date={date} rows={rows} />
      <TracesTimeseriesSavedMetrics
        getSavedTraceMetricsRequest={getSavedTraceMetricsRequest}
        search={search}
        selectedFacetRangeByName={selectedFacetRangeByName}
        selectedFacetValuesByName={selectedFacetValuesByName}
        spanFilter={spanFilter}
        traceIdSearch={traceIdSearch}
      />
    </div>
  );
};

export default TracesTimeseries;
