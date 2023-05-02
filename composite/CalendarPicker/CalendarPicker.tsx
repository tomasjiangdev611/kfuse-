import { PopoverPosition, PopoverTriggerV2, useThemeContext } from 'components';
import { CalendarPickerModal } from 'composite';
import { formatUnixTimestamp, getPeriodOptionLabel } from 'composite/utils';
import React, { ReactElement } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { DateSelection } from 'types';

const CalendarPicker = ({
  absoluteTimeRangeStorage,
  hasStartedLiveTail,
  onChange,
  startLiveTail,
  value,
}: {
  absoluteTimeRangeStorage?: Array<DateSelection>;
  hasStartedLiveTail: boolean;
  onChange: (value: DateSelection) => void;
  startLiveTail: () => void;
  value: DateSelection;
}): ReactElement => {
  const { utcTimeEnabled } = useThemeContext();
  const { startLabel, endLabel, startTimeUnix, endTimeUnix } = value;

  const getValue = () => {
    if (hasStartedLiveTail) {
      return 'Live Tail';
    } else if (startLabel || endLabel) {
      return getPeriodOptionLabel(value);
    } else {
      return `${formatUnixTimestamp(
        startTimeUnix,
        utcTimeEnabled,
      )} - ${formatUnixTimestamp(endTimeUnix, utcTimeEnabled)}`;
    }
  };
  return (
    <div className="calendar-picker">
      <PopoverTriggerV2
        className="calendar-picker__trigger"
        popoverPanelClassName="popover__panel--overflow"
        popover={({ close }) => (
          <CalendarPickerModal
            absoluteTimeRangeStorage={absoluteTimeRangeStorage}
            close={close}
            onChange={onChange}
            startLiveTail={startLiveTail}
            value={value}
          />
        )}
        position={PopoverPosition.BOTTOM_RIGHT}
        right
        width={480}
      >
        <div className="calendar-picker__trigger__value">{getValue()}</div>
        <ChevronUp
          className="calendar-picker__trigger__chevron calendar-picker__trigger__chevron--up"
          size={16}
        />
        <ChevronDown
          className="calendar-picker__trigger__chevron calendar-picker__trigger__chevron--down"
          size={16}
        />
      </PopoverTriggerV2>
    </div>
  );
};

export default CalendarPicker;
