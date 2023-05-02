import classnames from 'classnames';
import React, { ChangeEvent } from 'react';
import { RadioOption } from './types';

type Props = {
  className?: string;
  onChange: (nextValue: any) => void;
  options: RadioOption[];
  value: any;
};

const RadioGroup = ({ className, onChange, options, value }: Props) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value;
    onChange(nextValue);
  };

  return (
    <div
      className={classnames({ 'radio-group': true, [className]: className })}
    >
      {options.map((option: RadioOption) => (
        <div className="radio-group__option" key={option.value}>
          <input
            className="radio-group__option__input"
            checked={option.value === value}
            onChange={onChangeHandler}
            type="radio"
            value={option.value}
          />
          <span className="radio-group__option__label">{option.label}</span>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
