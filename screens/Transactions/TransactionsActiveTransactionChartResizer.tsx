import dayjs from 'dayjs';
import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useResizeDetector } from 'react-resize-detector';

const dateFormatter = date =>
  dayjs.unix(date).format('M/D/YY HH:mm');

const TransactionsActiveTransactionChartResizer = ({ data }) => {
  const { width, height, ref } = useResizeDetector();

  const max = data.reduce(
    (max, datum) => (datum.value > max ? data.value : max),
    0,
  );

  return (
    <div className="transactions__active-transaction__chart__resizer" ref={ref}>
      {data.length ? (
        <LineChart width={width} height={200} data={data}>
          <CartesianGrid strokeDasharray="3" />
          <XAxis
            dataKey={'timestamp'}
            domain={[
              data.length ? data[0].timestamp : 0,
              data.length ? data[data.length - 1].timestamp : 1,
            ]}
            scale="time"
            tickFormatter={dateFormatter}
            type="number"
          />
          <YAxis width={String(max).length * 4} />
          <Line dot={false} type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      ) : (
        <div
          className="transactions__active-transaction__chart__resizer__placeholder"
          style={{ height: '200px' }}
        >
          No data
        </div>
      )}
    </div>
  );
};

export default TransactionsActiveTransactionChartResizer;
