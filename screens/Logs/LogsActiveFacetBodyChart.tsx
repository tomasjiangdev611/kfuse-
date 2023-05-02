import { Paired12 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer';
import { dateTimeFormatChart } from 'constants';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WidgetTypes } from 'types';
import { convertNumberToReadableUnit } from 'utils';

const formatter = (utcTimeEnabled: boolean) => (ts: string) => {
  const date = new Date(ts);
  if (utcTimeEnabled) {
    return dayjs(date).utc().format(dateTimeFormatChart);
  }
  return dayjs(date).format(dateTimeFormatChart);
};

const LogsActiveFacetBodyChart = ({
  chartType,
  data,
  labels,
  width,
  utcTimeEnabled,
}: {
  chartType: WidgetTypes;
  data: Array<any>;
  labels: Array<string>;
  width: number;
  utcTimeEnabled: boolean;
}): ReactElement => {
  const max = Math.max(
    ...data.reduce(
      (arr, datum) => [
        ...arr,
        ...Object.keys(datum)
          .filter((key) => key !== 'ts')
          .map((key) => Math.round(datum[key])),
      ],
      [],
    ),
  );

  const yAxisWidth = ((max + '').replace('.', '').length + 2) * 14;

  if (!data.length) {
    return (
      <div className="logs__active-facet__body">
        <div className="logs__active-facet__body__placeholder">No Data</div>
      </div>
    );
  }

  if (chartType === WidgetTypes.Timeseries) {
    return (
      <LineChart width={width - 24} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ts" tickFormatter={formatter(utcTimeEnabled)} />
        <YAxis tickFormatter={convertNumberToReadableUnit} width={yAxisWidth} />
        <Tooltip labelFormatter={formatter(utcTimeEnabled)} />
        {labels.map((label, i) => {
          const color = Paired12[i % Paired12.length];
          return (
            <Line key={label} type="monotone" dataKey={label} stroke={color} />
          );
        })}
      </LineChart>
    );
  }

  return (
    <BarChart data={data} width={width - 24} height={250}>
      <Tooltip labelFormatter={formatter(utcTimeEnabled)} />
      {labels.map((label, i) => {
        const color = Paired12[i % Paired12.length];
        return (
          <Bar
            dataKey={label}
            fill={color}
            key={label}
            stackId={label}
            stroke={color}
          />
        );
      })}
      <XAxis dataKey="ts" tickFormatter={formatter(utcTimeEnabled)} />
      <YAxis tickFormatter={convertNumberToReadableUnit} width={yAxisWidth} />
    </BarChart>
  );
};

export default LogsActiveFacetBodyChart;
