import dayjs from 'dayjs';
import React, { ReactNode } from 'react';
import { ChartJsData } from 'types';
import { formatDurationNs, formatNumber } from 'utils';
import { Compare } from './types';
import { getCompareLabel, isCompareKey, removeCompareFromKey } from './utils';

type Row = {
  dataKey: string;
  fill?: string;
  payload: ChartJsData;
  stroke?: string;
};

type Props = {
  active: boolean;
  compare: Compare;
  payload: Row[];
  label: number;
  renderTooltipTimestamp?: (args: Args) => ReactNode;
  stepInMs?: number;
  timestamps: number[];
};

type Args = {
  index: number;
  timestamp: number;
  stepInMs: number;
};

const defaultRenderTooltipTimestamp = ({ timestamp, stepInMs }: Args) => {
  return (
    <div className="logs__timeline__chart__tooltip__label">
      {timestamp ? dayjs.unix(timestamp).format('MM/DD/YYYY H:mm:ss') : ''}
      {stepInMs ? ` (${formatDurationNs(stepInMs * 1000000)})` : ''}
    </div>
  );
};

const ChartGridTooltip = ({
  active,
  compare,
  payload,
  label,
  renderTooltipTimestamp,
  stepInMs,
  timestamps,
}: Props) => {
  if (active && payload && payload.length) {
    const payloadByKey = payload.reduce(
      (obj, p) => ({
        ...obj,
        [p.dataKey]: p,
      }),
      {},
    );

    const rows: Row[] = Object.values(payloadByKey).sort((a, b) =>
      a.dataKey.localeCompare(b.dataKey),
    );

    const timestamp = timestamps[label];
    return (
      <div className="logs__timeline__chart__tooltip">
        <div className="logs__timeline__chart__tooltip__inner">
          {renderTooltipTimestamp
            ? renderTooltipTimestamp({ index: label, timestamp, stepInMs })
            : defaultRenderTooltipTimestamp({
                index: label,
                timestamp,
                stepInMs,
              })}
          <div className="logs__timeline__chart__tooltip__payload">
            {rows.map((row, i) => (
              <div
                className="logs__timeline__chart__tooltip__payload__row"
                key={i}
              >
                <div
                  className="logs__timeline__chart__tooltip__payload__row__fill"
                  style={{ backgroundColor: row.stroke || row.fill }}
                />
                <div className="logs__timeline__chart__tooltip__payload__row__label">
                  {isCompareKey(row.dataKey)
                    ? `${removeCompareFromKey(row.dataKey)} ${getCompareLabel(
                        compare,
                      )}`
                    : row.dataKey}
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
