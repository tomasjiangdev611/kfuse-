import classnames from 'classnames';
import { CalendarPicker } from 'composite';
import React, { ReactElement } from 'react';
import { DateSelection } from 'types';

type Props = {
  absoluteTimeRangeStorage?: Array<DateSelection>;
  className?: string;
  hasStartedLiveTail?: boolean;
  onChange: (value: DateSelection) => void;
  startLiveTail?: () => void;
  value: DateSelection;
};

const Datepicker = ({
  absoluteTimeRangeStorage,
  className,
  hasStartedLiveTail,
  onChange,
  startLiveTail,
  value,
}: Props): ReactElement => {
  return (
    <div
      className={classnames({
        datepicker: true,
        'field-group': true,
        [className]: className,
      })}
    >
      <div className="field-group__item">
        <CalendarPicker
          absoluteTimeRangeStorage={absoluteTimeRangeStorage}
          hasStartedLiveTail={hasStartedLiveTail}
          onChange={onChange}
          startLiveTail={startLiveTail}
          value={value}
        />
      </div>
    </div>
  );
};

export default Datepicker;
