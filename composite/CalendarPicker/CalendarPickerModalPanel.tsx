import { convertTimeStringToUnix } from 'composite/utils';
import { useToggle } from 'hooks';
import React from 'react';
import Calendar from 'react-calendar';
import { X } from 'react-feather';

const CalendarPickerPanel = ({
  openToggle,
  range,
  setRange,
}: {
  openToggle: ReturnType<typeof useToggle>;
  range: Date[] | string[];
  setRange: (range: Date[]) => void;
}): React.ReactElement => {
  const from =
    typeof range[0] === 'string'
      ? new Date(convertTimeStringToUnix(range[0]) * 1000)
      : range[0];
  const to =
    typeof range[1] === 'string'
      ? new Date(convertTimeStringToUnix(range[1]) * 1000)
      : range[1];

  return (
    <div className="calendar-picker__panel">
      <div className="calendar-picker__panel__header">
        <div className="calendar-picker__panel__header__title">
          Select a time range
        </div>
        <div className="icon icon--medium " onClick={openToggle.off}>
          <X fontSize="medium" />
        </div>
      </div>
      <Calendar
        allowPartialRange
        onChange={setRange}
        selectRange
        next2Label={null}
        prev2Label={null}
        value={[from, to]}
      />
    </div>
  );
};

export default CalendarPickerPanel;
