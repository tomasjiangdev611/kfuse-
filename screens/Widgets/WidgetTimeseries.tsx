import 'chartjs-adapter-dayjs';
import { Paired12 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer';
import { dateTimeFormatChart } from 'constants';
import dayjs from 'dayjs';
import { Loader, useThemeContext } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { promqlFormulaRange, promqlQueryRange } from 'requests';
import { Metric } from 'types';

const yAxisFormatter = (number: number) => {
  if (number > 1000000000) {
    return (number / 1000000000).toString() + 'B';
  } else if (number > 1000000) {
    return (number / 1000000).toString() + 'M';
  } else if (number > 1000) {
    return (number / 1000).toString() + 'K';
  } else {
    return number.toString();
  }
};

const tooltipLabelFormatter = (number: number, utcTimeEnabled: boolean) => {
  const date = new Date(number * 1000);
  if (utcTimeEnabled) {
    return dayjs(date).utc().format(dateTimeFormatChart);
  }
  return dayjs(date).format(dateTimeFormatChart);
};

const xAxisFormatter =
  (secondsFromNow: number, utcTimeEnabled: boolean) => (number: number) => {
    const date = new Date(number * 1000);
    let unixDayJs = dayjs(date);
    if (utcTimeEnabled) {
      unixDayJs = unixDayJs.utc();
    }

    if (secondsFromNow > 60 * 60 * 24 * 7) {
      return unixDayJs.format('M/D');
    }

    if (secondsFromNow > 60 * 60 * 24) {
      return unixDayJs.format('M/D h:mm A');
    }

    if (secondsFromNow > 60 * 60) {
      return unixDayJs.format('h:mm A');
    }

    if (secondsFromNow > 60 * 5) {
      return unixDayJs.format('h:mm A');
    }

    return unixDayJs.format('h:mm:ss A');
  };

const getAllMetricDatasets = async (widget: any) => {
  const { formula, metrics, secondsFromNow } = widget;

  const filteredMetrics = metrics.filter(
    (metric: Metric) =>
      metric.metricName || (metric.shouldUsePromqlQuery && metric.promqlQuery),
  );

  const coallesceResults = (results) => {
    return results.reduce((arr, result) => [...arr, ...result], []);
  };

  const colorDatasets = (datasets) => {
    return {
      datasets: datasets.map((dataset, i) => {
        const color = Paired12[i % Paired12.length];
        return {
          ...dataset,
          backgroundColor: color,
          borderColor: color,
          color,
        };
      }),
    };
  };

  return Promise.all(
    formula
      ? [promqlFormulaRange({ widget })]
      : filteredMetrics.map((metric) =>
          promqlQueryRange({ metric, secondsFromNow }),
        ),
  )
    .then(coallesceResults)
    .then(colorDatasets);
};

type Props = {
  widget: any;
};

const WidgetTimeseries = ({ widget }: Props): ReactElement => {
  const { utcTimeEnabled } = useThemeContext();
  const metricDatasetsRequest = useRequest(getAllMetricDatasets);
  const series = metricDatasetsRequest.result?.datasets || [];

  useEffect(() => {
    metricDatasetsRequest.call(widget);
  }, [widget]);

  return metricDatasetsRequest.result ? (
    <Loader
      isLoading={metricDatasetsRequest.isLoading}
      style={{ width: '100%', height: '100%' }}
    >
      <ResponsiveContainer>
        <LineChart
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            allowDuplicatedCategory={false}
            dataKey="ts"
            scale="time"
            tickFormatter={xAxisFormatter(
              widget.secondsFromNow,
              utcTimeEnabled,
            )}
          />
          <YAxis tickFormatter={yAxisFormatter} />
          <Tooltip
            formatter={(value) => new Intl.NumberFormat('en').format(value)}
            labelFormatter={(value) =>
              tooltipLabelFormatter(value, utcTimeEnabled)
            }
          />
          {series.map((s) => (
            <Line
              dataKey="value"
              data={s.data}
              dot={false}
              key={s.label}
              name={s.label}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Loader>
  ) : null;
};

export default WidgetTimeseries;
