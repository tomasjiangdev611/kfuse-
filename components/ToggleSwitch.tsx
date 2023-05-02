import classnames from 'classnames';
import React from 'react';

type Props = {
  className?: string;
  value: boolean;
};

const ToggleSwitch = ({ className, value }: Props) => {
  return (
    <label
      className={classnames({ 'toggle-switch': true, [className]: className })}
    >
      <input
        className="toggle-switch__checkbox"
        checked={value}
        type="checkbox"
      />
      <span className="toggle-switch__slider" />
    </label>
  );
};

export default ToggleSwitch;
