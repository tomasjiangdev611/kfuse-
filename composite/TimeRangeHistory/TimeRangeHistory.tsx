import { formatDate } from 'composite/utils';
import React, { ReactElement } from 'react';
import { DateSelection } from 'types';

const TimeRangeHistory = ({
  history,
  onApplyUsedFilterRange,
}: {
  history: DateSelection[];
  onApplyUsedFilterRange: (value: DateSelection) => void;
}): ReactElement => {
  return (
    <div className="time-range-history">
      <div className="calendar-picker__modal__absolute__header">
        <p className="calendar-picker__modal__absolute__header__title">
          Recently used absolute ranges
        </p>
      </div>
      {history.length > 0 &&
        history.map((range, index) => {
          return (
            <p
              key={index}
              className="time-range-history__item"
              onClick={() => onApplyUsedFilterRange(range)}
            >
              {formatDate(new Date(range.startTimeUnix * 1000))} {' to '}
              {formatDate(new Date(range.endTimeUnix * 1000))}
            </p>
          );
        })}
    </div>
  );
};

export default TimeRangeHistory;
