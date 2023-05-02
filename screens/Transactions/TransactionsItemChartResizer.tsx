import React from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { useResizeDetector } from 'react-resize-detector';

const TransactionsItemChartResizer = ({ data }) => {
  const { width, height, ref } = useResizeDetector();
  return (
    <div className="transactions__item__chart__resizer" ref={ref}>
      {data.length ? (
        <LineChart width={width} height={height} data={data}>
          <XAxis
            dataKey={'timestamp'}
            domain={[
              data.length ? data[0].timestamp : 0,
              data.length ? data[data.length - 1].timestamp : 1,
            ]}
            hide
            scale="time"
            type="number"
          />
          <YAxis hide />
          <Line dot={false} type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      ) : (
        <div
          className="transactions__item__chart__resizer__placeholder"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          No data
        </div>
      )}
    </div>
  );
};

export default TransactionsItemChartResizer;
