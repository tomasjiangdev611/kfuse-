import classnames from 'classnames';
import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  icon: ReactNode;
  label: ReactNode;
};

const IconWithLabel = ({ className, icon, label }: Props) => {
  return (
    <div
      className={classnames({
        'icon-with-label': true,
        [className]: className,
      })}
    >
      <div className="icon-with-label__icon">{icon ? icon : null}</div>
      <div className="icon-with-label__label">{label}</div>
    </div>
  );
};

export default IconWithLabel;
