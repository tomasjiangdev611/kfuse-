import { ChipWithLabel } from 'components';
import { colorsByLogLevel } from 'constants';
import { useRefAreaState } from 'hooks';
import React, { useMemo } from 'react';
import { convertNumberToReadableUnit } from 'utils';

const getCountsByLogLevel = (startIndex, endIndex, bars) => {
  const countsByLogLevel: { [key: string]: number } = {};
  let total = 0;

  bars.slice(startIndex, endIndex + 1).forEach((bar) => {
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
  refAreaState: ReturnType<typeof useRefAreaState>;
};

const LogsTimelineChartLegendRange = ({ bars, refAreaState }: Props) => {
  const { refAreaLeft, refAreaRight } = refAreaState.state;

  const { countsByLogLevel, total } = useMemo(() => {
    const startIndex = Math.max(refAreaLeft || 0, 0);
    const endIndex = Math.min(refAreaRight || bars.length - 1, bars.length - 1);

    return getCountsByLogLevel(startIndex, endIndex, bars);
  }, [bars, refAreaLeft, refAreaRight]);

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
    </div>
  );
};

export default LogsTimelineChartLegendRange;
