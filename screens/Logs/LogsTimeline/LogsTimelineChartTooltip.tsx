import dayjs from 'dayjs';
import React from 'react';
import { formatNumber } from 'utils';

const LogsTimelineChartTooltip = ({
  active,
  payload,
  label,
  labels,
  utcTimeEnabled,
}: {
  active: boolean;
  payload: any[];
  label: number;
  labels: any[];
  utcTimeEnabled: boolean;
}) => {
  const timestampDayjs = utcTimeEnabled
    ? dayjs.unix(labels[label]).utc()
    : dayjs.unix(labels[label]);

  if (active && payload && payload.length) {
    return (
      <div className="logs__timeline__chart__tooltip">
        <div className="logs__timeline__chart__tooltip__inner">
          <div className="logs__timeline__chart__tooltip__label">
            {timestampDayjs.format('MMM D, H:mm:ss.SSS')}
          </div>
          <div className="logs__timeline__chart__tooltip__payload">
            {payload.map((row, index) => (
              <div
                key={index}
                className="logs__timeline__chart__tooltip__payload__row"
              >
                <div
                  className="logs__timeline__chart__tooltip__payload__row__fill"
                  style={{ backgroundColor: row.fill }}
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

export default LogsTimelineChartTooltip;
