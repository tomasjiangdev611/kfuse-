import 'chartjs-adapter-dayjs';
import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useRequest } from 'hooks';
import { series } from 'requests';

const options = {
  animation: false,
  maintainAspectRatio: false,
  parsing: {
    xAxisKey: 'ts',
    yAxisKey: 'value',
  },
  responsive: true,
  scales: {
    xAxis: {
      type: 'time',
    },
    yAxis: {
      min: 0,
    },
  },
};

type Props = {
  entityType: string;
  metric: string;
  secondsFromNow: number;
};

const MetricsTabsChart = ({
  entityType,
  metric,
  metricsRequests,
  secondsFromNow,
}: Props) => {
  const data = metricsRequests.requests[metric]?.result;

  useEffect(() => {
    metricsRequests.query(metric, secondsFromNow);
  }, [metric, secondsFromNow]);

  return (
    <div
      className="metrics__tabs__chart"
      style={{ width: '100%', height: '400px' }}
    >
      {data && <Line data={data} options={options} />}
    </div>
  );
};

export default MetricsTabsChart;
