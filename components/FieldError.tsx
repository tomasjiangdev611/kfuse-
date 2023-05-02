import classnames from 'classnames';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  error?: string;
};

const FieldError = ({ children, className, error }: Props) => {
  return (
    <div
      className={classnames({ 'field-error': true, [className]: className })}
    >
      {children}
      {error ? <div className="field-error__error">{error}</div> : null}
    </div>
  );
};

export default FieldError;
