import classnames from 'classnames';
import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  color: string;
  label: ReactNode;
  onClick?: () => void;
};

const SquareWithLabel = ({ className, color, label, onClick }: Props) => {
  return (
    <div
      className={classnames({
        'square-with-label': true,
        'square-with-label--clickable': onClick,
        [className]: className,
      })}
      onClick={onClick}
      style={{ borderColor: `${color}` }}
    >
      <div
        className="square-with-label__square"
        style={{ backgroundColor: color }}
      />
      <div className="square-with-label__label" title={label}>
        {label}
      </div>
    </div>
  );
};

export default SquareWithLabel;
