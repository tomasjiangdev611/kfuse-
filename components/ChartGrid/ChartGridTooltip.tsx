import dayjs from 'dayjs';
import React from 'react';
import { formatNumber } from 'utils';

const ChartGridTooltip = ({ active, payload, label, timestamps }) => {
  if (active && payload && payload.length) {
    return (
      <div className="logs__timeline__chart__tooltip">
        <div className="logs__timeline__chart__tooltip__inner">
          <div className="logs__timeline__chart__tooltip__label">
            {timestamps[label] ? dayjs.unix(timestamps[label]).format('MM/DD/YYYY H:mm') : ''}
          </div>
          <div className="logs__timeline__chart__tooltip__payload">
            {payload.map((row) => (
              <div className="logs__timeline__chart__tooltip__payload__row">
                <div
                  className="logs__timeline__chart__tooltip__payload__row__fill"
                  style={{ backgroundColor:  row.stroke || row.fill }}
                />
                <div className="logs__timeline__chart__tooltip__payload__row__label">
                  {row.dataKey}
                </div>
                <div className="logs__timeline__chart__tooltip__payload__row__count">
                  {formatNumber(row.payload[row.dataKey])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChartGridTooltip;
