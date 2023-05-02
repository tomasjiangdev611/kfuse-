import classnames from 'classnames';
import React from 'react';
import Checkbox from './Checkbox';

type Props = {
  className?: string;
  label: string;
  onChange: (checked: boolean) => void;
  value: boolean;
};

const CheckboxWithLabel = ({ className, label, onChange, value }: Props) => {
  return (
    <div
      className={classnames({
        'checkbox-with-label': true,
        [className]: className,
      })}
    >
      <Checkbox onChange={onChange} value={value} />
      <div className="checkbox-with-label__label">{label}</div>
    </div>
  );
};

export default CheckboxWithLabel;
