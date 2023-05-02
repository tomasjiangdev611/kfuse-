import classnames from 'classnames';
import React, { ReactElement } from 'react';

type Props = {
  className?: string;
  onChange: (checked: boolean) => void;
  value: boolean;
};

const Checkbox = ({ className, onChange, value }: Props): ReactElement => {
  const inputOnChange = (e: React.SyntheticEvent) => {
    onChange(e.currentTarget.checked);
  };

  const onClick = (e) => {
    e.stopPropagation();
  };

  return (
    <input
      checked={value}
      className={classnames({ [className]: className })}
      onChange={inputOnChange}
      onClick={onClick}
      type="checkbox"
    />
  );
};

export default Checkbox;
