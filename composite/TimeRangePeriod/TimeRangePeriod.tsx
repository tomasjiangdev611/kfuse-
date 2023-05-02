import { periodOptions } from 'composite/utils';
import React, { useMemo } from 'react';
import { DateSelection } from 'types';
import { convertTimeStringToUnix } from 'utils/timeCodeToUnix';

const TimeRangePeriod = ({
  close,
  onChange,
  periodType = 'Last',
  startLiveTail,
}: {
  close: () => void;
  onChange: (value: DateSelection) => void;
  periodType?: 'Last' | 'Next';
  startLiveTail: () => void;
}): JSX.Element => {
  const onItemClick = (from: string, to: string) => () => {
    if (!from && !to) {
      startLiveTail();
      close();
    } else {
      const endTimeUnix = convertTimeStringToUnix(to);
      const startTimeUnix = convertTimeStringToUnix(from);
      onChange({ endTimeUnix, startTimeUnix, startLabel: from, endLabel: to });
      close();
    }
  };

  const periodOptionsFiltered = useMemo(
    () =>
      periodOptions.filter((option) => {
        if (!startLiveTail && option.label === 'Live Tail') {
          return null;
        }
        return option;
      }),
    [startLiveTail],
  );

  return (
    <div className="time-range-period">
      <p className="time-range-period__header">Quick Ranges</p>
      <div className="time-range-period__scroll">
        {periodOptionsFiltered.map(({ from, to, label }) => {
          return (
            <button
              key={label}
              className="select__panel__option"
              onMouseDown={onItemClick(from, to)}
            >
              <div className="select__panel__option__label">
                {periodType === 'Last' ? label : label.replace('Last', 'Next')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeRangePeriod;
