import classnames from 'classnames';
import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  color: string;
  label: ReactNode;
};

const ChipWithLabel = ({ className, color, label }: Props) => {
  return (
    <div
      className={classnames({
        'chip-with-label': true,
        [className]: className,
      })}
      style={{ borderColor: `${color}` }}
    >
      {label}
    </div>
  );
};

export default ChipWithLabel;
