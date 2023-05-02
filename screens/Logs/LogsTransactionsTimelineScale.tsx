import React from 'react';
import { getTicks, niceScale } from './utils';

const LogsTransactionsTimelineScale = ({
  niceUpperBound,
  tickSpacing,
  totalDuration,
}) => {
  const ticks = getTicks(niceUpperBound, tickSpacing);

  return (
    <div className="logs__transactions__timeline__scale">
      <div className="logs__transactions__timeline__scale__left" />
      <div className="logs__transactions__timeline__scale__right">
        <div className="logs__transactions__timeline__scale__ticks">
          {ticks.map((tick) => (
            <div
              className="logs__transactions__timeline__scale__tick"
              key={tick}
            >
              <div className="logs__transactions__timeline__scale__tick__label">
                <div className="logs__transactions__timeline__scale__tick__label__text">
                  {tick < 1 ? tick.toFixed(2) : tick}
                </div>
              </div>
              <div className="logs__transactions__timeline__scale__tick__line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsTransactionsTimelineScale;
