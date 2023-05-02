import classnames from 'classnames';
import { colorsByLogLevel } from 'constants';
import React from 'react';

type Props = {
  className?: string;
  level: string;
};

const LogLevel = ({ className, level }: Props) => {
  return (
    <div
      className={classnames({ 'log-level': true, [className]: className })}
      style={{ backgroundColor: colorsByLogLevel[level] }}
    >
      {level}
    </div>
  );
};

export default LogLevel;
