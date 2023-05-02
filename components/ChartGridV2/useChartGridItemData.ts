import { chartingPaletteAlt01 } from 'constants';
import dayjs from 'dayjs';
import { useForm, useMap, useRequest } from 'hooks';
import { useEffect, useMemo } from 'react';
import tinycolor from 'tinycolor2';
import { Chart, ChartJsData, DateSelection } from 'types';
import { getRateIntervalAndStep } from 'utils';
import { Compare } from './types';
import { getAggregationsByKey, getCompareKey, getCompareLabel } from './utils';

const getChartedData = (
  data: ChartJsData[],
  compareData: ChartJsData[],
  isLogScaleEnabled: boolean,
) => {
  const mergedData = data.map((datum, i) => {
    return {
      ...datum,
      ...(compareData[i]
        ? Object.keys(compareData[i]).reduce(
            (obj, key) => ({
              ...obj,
              [getCompareKey(key)]: compareData[i][key],
            }),
            {},
          )
        : {}),
    };
  });

  if (isLogScaleEnabled) {
    return mergedData.map((datum) =>
      Object.keys(datum).reduce(
        (obj, key) => ({
          ...obj,
          [key]: datum[key] === 0 ? null : datum[key],
        }),
        {},
      ),
    );
  }

  return mergedData;
};

const getCompareDate = ({ compare, date }) => {
  const { startTimeUnix, endTimeUnix } = date;
  return {
    ...date,
    startTimeUnix: dayjs.unix(startTimeUnix).subtract(1, compare).unix(),
    endTimeUnix: dayjs.unix(endTimeUnix).subtract(1, compare).unix(),
  };
};

const getBaseColorMap = (
  keys: string[],
  colorMap: { [key: string]: string } = {},
) => {
  return keys.reduce(
    (obj, key, i) => ({
      ...obj,
      [key]:
        colorMap[key] || chartingPaletteAlt01[i % chartingPaletteAlt01.length],
    }),
    {},
  );
};

const getRows = (keys: string[], data: ChartJsData[]) =>
  keys.map((key) => ({ key, ...getAggregationsByKey(key, data) }));

type Args = {
  chart: Chart;
  date: DateSelection;
  form: ReturnType<typeof useForm>;
  width: number;
};

const useChartGridItemData = ({ chart, date, form, width }: Args) => {
  const { colorMap, instant, query, step } = chart;
  const { compare, isLogScaleEnabled } = form.values;
  const deselectedKeysMap = useMap();

  const queryRangeData = async (args) =>
    query({ chart, date: args.date, instant: args.instant, step, width });

  const compareQueryRangeData = async (args) =>
    query({
      chart,
      date: getCompareDate({ compare, date }),
      instant: args.instant,
      step,
      width,
    });

  const queryRangeRequest = useRequest(queryRangeData);
  const compareQueryRangeRequest = useRequest(compareQueryRangeData);

  const fetchCompare = () => {
    if (compare) {
      compareQueryRangeRequest.call({ date, instant });
    }
  };

  const fetch = () => {
    queryRangeRequest.call({ date, instant });
    fetchCompare();
  };

  const data = useMemo(
    () => queryRangeRequest.result?.data || [],
    [queryRangeRequest.result],
  );

  const keys = useMemo(
    () => queryRangeRequest.result?.keys || [],
    [queryRangeRequest.result],
  );

  const legendRows = useMemo(() => {
    const baseRows = getRows(keys, data);
    const rows = form.values.shouldShowTop5
      ? baseRows.sort((a, b) => b.avg - a.avg).slice(0, 5)
      : baseRows;

    if (compare) {
      const compareRows = getRows(
        compareQueryRangeRequest.result?.keys || [],
        compareQueryRangeRequest.result?.data || [],
      );

      const compareRowsByKey = compareRows.reduce(
        (obj, compareRow) => ({
          ...obj,
          [compareRow.key]: {
            ...compareRow,
            key: getCompareKey(compareRow.key),
            label: `${compareRow.key} ${getCompareLabel(compare)}`,
          },
        }),
        {},
      );

      return rows.reduce(
        (arr, row) => [
          ...arr,
          row,
          ...(compareRowsByKey[row.key] ? [compareRowsByKey[row.key]] : []),
        ],
        [],
      );
    }

    return rows;
  }, [
    data,
    keys,
    form.values.shouldShowTop5,
    form.values.compare,
    compareQueryRangeRequest.result,
  ]);

  const renderedKeys = useMemo(() => {
    return (
      form.values.shouldShowTop5 ? legendRows.map((row) => row.key) : keys
    ).filter((key) => !(key in deselectedKeysMap.state));
  }, [keys, deselectedKeysMap.state, form.values, legendRows]);

  const referenceLines = queryRangeRequest.result?.referenceLines || [];
  const renderTooltipTimestamp =
    queryRangeRequest.result?.renderTooltipTimestamp || null;
  const timestamps = queryRangeRequest.result?.timestamps || [];

  const chartedData = useMemo(
    () =>
      getChartedData(
        data,
        compare && compareQueryRangeRequest.result?.data
          ? compareQueryRangeRequest.result?.data
          : [],
        isLogScaleEnabled,
      ),
    [
      compareQueryRangeRequest.result,
      queryRangeRequest.result,
      isLogScaleEnabled,
      form.values.compare,
    ],
  );

  const { stepInMs } = useMemo(
    () => getRateIntervalAndStep({ date, width }),
    [date, width],
  );

  const mergedColorMap = useMemo(() => {
    if (queryRangeRequest.result) {
      const baseColorMap = getBaseColorMap(keys, colorMap);

      return Object.keys(baseColorMap).reduce(
        (obj, key) => ({
          ...obj,
          [key]: baseColorMap[key],
          [`${getCompareKey(key)}`]: tinycolor(baseColorMap[key]).isDark()
            ? tinycolor(baseColorMap[key]).lighten(15).toString()
            : tinycolor(baseColorMap[key]).darken(15).toString(),
        }),
        {},
      );
    }

    return {};
  }, [queryRangeRequest.result, form.values.compare]);

  useEffect(() => {
    deselectedKeysMap.reset();
  }, [queryRangeRequest.result]);

  useEffect(() => {
    fetchCompare();
  }, [compare]);

  return {
    chartedData,
    colorMap: mergedColorMap,
    data,
    deselectedKeysMap,
    error: queryRangeRequest.error,
    fetch,
    keys,
    isLoading: queryRangeRequest.isLoading,
    legendRows,
    referenceLines,
    renderedKeys,
    renderTooltipTimestamp,
    stepInMs,
    timestamps,
  };
};

export default useChartGridItemData;
