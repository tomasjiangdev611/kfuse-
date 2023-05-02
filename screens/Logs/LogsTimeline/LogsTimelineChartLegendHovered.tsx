import { ChipWithLabel } from 'components';
import { colorsByLogLevel } from 'constants';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { convertNumberToReadableUnit } from 'utils';

const getCountsByLogLevel = (startIndex, endIndex, bars) => {
  const countsByLogLevel: { [key: string]: number } = {};
  let total = 0;

  bars.slice(startIndex, endIndex).forEach((bar) => {
    Object.keys(bar)
      .filter((logLevel) => logLevel !== 'compare')
      .forEach((logLevel) => {
        if (!countsByLogLevel[logLevel]) {
          countsByLogLevel[logLevel] = 0;
        }

        countsByLogLevel[logLevel] += bar[logLevel];
        total += bar[logLevel];
      });
  });

  return {
    countsByLogLevel,
    total,
  };
};

type Props = {
  bars: { [key: string]: number }[];
  hoveredIndex?: number;
  labels: number[];
};

const LogsTimelineChartLegendHovered = ({
  bars,
  hoveredIndex,
  labels,
}: Props) => {
  const { countsByLogLevel, total } = useMemo(() => {
    const startIndex = hoveredIndex;
    const endIndex = hoveredIndex + 1;

    return getCountsByLogLevel(startIndex, endIndex, bars);
  }, [bars, hoveredIndex, labels]);

  return (
    <div className="logs__timeline__chart__legend">
      <div className="logs__timeline__chart__legend__item">
        <span>
          {`Total: `}
          <span className="text--weight-medium">
            {convertNumberToReadableUnit(total)}
          </span>
        </span>
      </div>
      {Object.keys(countsByLogLevel)
        .sort()
        .map((logLevel) => (
          <div className="logs__timeline__chart__legend__item" key={logLevel}>
            <ChipWithLabel
              color={colorsByLogLevel[logLevel]}
              label={
                <span>
                  {logLevel}
                  {': '}
                  <span className="text--weight-medium">
                    {convertNumberToReadableUnit(countsByLogLevel[logLevel])}
                  </span>
                </span>
              }
            />
          </div>
        ))}
      <div className="logs__timeline__chart__legend__item">
        <span>
          {`Date: `}
          <span className="text--weight-medium">
            {dayjs.unix(labels[hoveredIndex]).utc().format('M/D H:mm:ss')}
          </span>
        </span>
      </div>
    </div>
  );
};

export default LogsTimelineChartLegendHovered;
