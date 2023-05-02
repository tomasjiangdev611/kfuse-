import { useThemeContext } from 'components/Theme';
import {
  CalendarPickerInput,
  CalendarPickerPanel,
  TimeRangeHistory,
  TimeRangePeriod,
} from 'composite';
import {
  convertDateToUnix,
  convertTimeStringToUnix,
  formatDate,
  validateDateField,
  getValueFromHtmlForm,
} from 'composite/utils';
import { useToggle } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { DateSelection } from 'types';

const CalendarPickerModal = ({
  absoluteTimeRangeStorage = [],
  close,
  onChange,
  startLiveTail,
  value,
}: {
  absoluteTimeRangeStorage?: Array<DateSelection>;
  close: () => void;
  onChange: (value: DateSelection) => void;
  startLiveTail: () => void;
  value: DateSelection;
}): ReactElement => {
  const { startLabel, endLabel, startTimeUnix, endTimeUnix } = value;
  const openToggle = useToggle();
  const [range, setRange] = useState<Date[] | string[]>(
    startLabel && endLabel
      ? [startLabel, endLabel]
      : [new Date(startTimeUnix * 1000), new Date(endTimeUnix * 1000)],
  );
  const [validationError, setValidationError] = useState<string>(null);
  const { utcTimeEnabled } = useThemeContext();

  const onSetRange = (ranges: Date[]) => {
    if (ranges.length > 1) {
      setRange(ranges);
    }
  };

  const onApplyUsedFilterRange = (range: DateSelection) => {
    onChange({ ...range, startLabel: null, endLabel: null });
    close();
  };

  const onApplyFilterRange = (event: React.FormEvent) => {
    event.preventDefault();
    const data: { from: string; to: string } = getValueFromHtmlForm(event, [
      'from',
      'to',
    ]);

    const fromCodified = convertTimeStringToUnix(data.from, utcTimeEnabled);
    const toCodified = convertTimeStringToUnix(data.to, utcTimeEnabled);
    if (fromCodified && toCodified) {
      if (new Date(fromCodified * 1000) > new Date(toCodified * 1000)) {
        setValidationError('From date must be before To date');
        return;
      }

      setValidationError(null);
      onChange({
        startLabel: data.from,
        endLabel: data.to,
        startTimeUnix: fromCodified,
        endTimeUnix: toCodified,
      });
      close();
      return;
    }

    if (validateDateField(data.from) || validateDateField(data.to)) {
      return;
    }

    if (new Date(data.from) > new Date(data.to)) {
      setValidationError('From date must be less than To date');
      return;
    }

    const newDates = {
      startTimeUnix: convertDateToUnix(data.from, utcTimeEnabled),
      endTimeUnix: convertDateToUnix(data.to, utcTimeEnabled),
    };
    onChange({ ...newDates, startLabel: null, endLabel: null });
    close();
  };

  return (
    <div className="calendar-picker__modal">
      <div className="calendar-picker__modal__main ">
        <form
          onSubmit={onApplyFilterRange}
          className="calendar-picker__modal__absolute"
        >
          <div className="calendar-picker__modal__absolute__header">
            <p className="calendar-picker__modal__absolute__header__title">
              Absolute time range
            </p>
          </div>
          <CalendarPickerInput
            name="from"
            openToggle={openToggle}
            title="From"
            value={
              typeof range[0] === 'string'
                ? range[0]
                : formatDate(range[0], utcTimeEnabled)
            }
          />
          <CalendarPickerInput
            openToggle={openToggle}
            name="to"
            title="To"
            value={
              typeof range[1] === 'string'
                ? range[1]
                : formatDate(range[1], utcTimeEnabled)
            }
          />
          {validationError && (
            <div className="calendar-picker__modal__absolute__validation">
              <p className="text--red">{validationError}</p>
            </div>
          )}
          <button type="submit" className="button button--blue">
            Apply Time Range
          </button>
          {absoluteTimeRangeStorage && (
            <TimeRangeHistory
              history={absoluteTimeRangeStorage}
              onApplyUsedFilterRange={onApplyUsedFilterRange}
            />
          )}
          {openToggle.value && (
            <CalendarPickerPanel
              openToggle={openToggle}
              range={range}
              setRange={onSetRange}
            />
          )}
        </form>
        <TimeRangePeriod
          onChange={onChange}
          close={close}
          startLiveTail={startLiveTail}
        />
      </div>
      <div className="calendar-picker__modal__timezone">
        <p className="calendar-picker__modal__timezone__text ">
          {utcTimeEnabled ? 'UTC time' : `Local browser time`}
        </p>
      </div>
    </div>
  );
};

export default CalendarPickerModal;
