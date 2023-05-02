import React from 'react';
import { formatNs, getUnit } from 'utils';

export const getTicks = (
  niceUpperBound: number,
  tickSpacing: number,
): number[] => {
  const result = [];

  for (let i = 0; i < niceUpperBound / tickSpacing; i += 1) {
    result.push(i * tickSpacing);
  }

  return result;
};

type Props = {
  minStartTimeNs: number;
  maxEndTimeNs: number;
  niceUpperBound: number;
  tickSpacing: number;
  width: number;
};

const FlamegraphTicks = ({
  minStartTimeNs,
  maxEndTimeNs,
  niceUpperBound,
  tickSpacing,
  width,
}: Props) => {
  const diffInNs = maxEndTimeNs - minStartTimeNs;
  const unit = getUnit(diffInNs);
  const min = 0;

  const numTicks = isNaN(niceUpperBound) ? 0 : niceUpperBound / tickSpacing;

  return (
    <div className="flamegraph__ticks">
      {numTicks ? (
        new Array(numTicks).fill(null).map((_, i) => (
          <div className="flamegraph__ticks__item" key={i}>
            <div className="flamegraph__ticks__item__label">
              <div className="flamegraph__ticks__item__label__text">
                {`${formatNs(min + i * tickSpacing, unit)}${unit}`}
              </div>
            </div>
            {i === numTicks - 1 ? (
              <div className="flamegraph__ticks__item__label flamegraph__ticks__item__label--right">
                <div className="flamegraph__ticks__item__label__text">
                  {`${formatNs(niceUpperBound, unit)}${unit}`}
                </div>
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <div className="flamegraph__ticks__item">
          <div className="flamegraph__ticks__item__label">
            <div className="flamegraph__ticks__item__label__text">{'0ns'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlamegraphTicks;
