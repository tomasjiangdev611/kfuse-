import { InputWithValidator } from 'components';
import { validateDateField } from 'composite/utils';
import { useToggle } from 'hooks';
import React from 'react';
import { Calendar } from 'react-feather';

const CalendarPickerInput = ({
  openToggle,
  name,
  title,
  value,
  ...rest
}: {
  openToggle: ReturnType<typeof useToggle>;
  name: string;
  title: string;
  value: string;
}): JSX.Element => {
  return (
    <div className="calendar-picker__input">
      <div className="calendar-picker__input__field">
        <InputWithValidator
          {...rest}
          title={title}
          name={name}
          type="text"
          value={value}
          validator={validateDateField}
          onFocus={openToggle.off}
        />
      </div>
      <div
        className="icon icon--medium icon--space--top"
        onClick={openToggle.on}
      >
        <Calendar fontSize="medium" />
      </div>
    </div>
  );
};

export default CalendarPickerInput;
