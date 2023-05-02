import classnames from 'classnames';
import React, { ReactNode } from 'react';

type Option = {
  label: ReactNode;
  value: any;
};

type Props = {
  className?: string;
  onChange: (value: any) => void;
  options: Option[];
  value?: any;
};

const Picker = ({ className, onChange, options, value }: Props) => {
  const onClickHandler = (nextValue: string) => () => {
    onChange(nextValue);
  };

  return (
    <div className={classnames({ picker: true, [className]: className })}>
      {options.map((option) => (
        <button
          className={classnames({
            picker__item: true,
            'picker__item--active': value === option.value,
          })}
          key={option.value}
          onClick={onClickHandler(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Picker;
