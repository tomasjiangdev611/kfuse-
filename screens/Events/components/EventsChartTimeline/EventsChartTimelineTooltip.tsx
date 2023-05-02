import dayjs from 'dayjs';
import React from 'react';
import { formatNumber } from 'utils';

const EventsChartTimelineTooltip = ({
  active,
  payload,
  label,
  labels,
}: {
  active: boolean;
  payload: any[];
  label: number;
  labels: any[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="logs__timeline__chart__tooltip">
        <div className="logs__timeline__chart__tooltip__inner">
          <div className="logs__timeline__chart__tooltip__label">
            {dayjs.unix(labels[label]).utc().format('M/D H:mm:ss')}
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
                  &nbsp;{formatNumber(row.payload[row.dataKey])}
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

export default EventsChartTimelineTooltip;
