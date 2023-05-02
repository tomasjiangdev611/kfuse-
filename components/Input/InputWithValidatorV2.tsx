import classNames from 'classnames';
import React, { FC, ForwardedRef, forwardRef } from 'react';

import { InputWithValidatorV2Props } from './types';

const InputWithValidatorV2: FC<InputWithValidatorV2Props> = forwardRef<
  HTMLInputElement,
  InputWithValidatorV2Props
>(
  (
    {
      className,
      errorText,
      id,
      label,
      labelClassName,
      onChange,
      type,
      value,
      ...rest
    }: InputWithValidatorV2Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div>
        {label && (
          <label
            className={classNames({ [`${labelClassName}`]: labelClassName })}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          className={classNames({
            input: true,
            'input--error': Boolean(errorText),
            [`${className}`]: className,
          })}
          id={id}
          onChange={onChange}
          ref={ref}
          type={type}
          value={value}
          {...rest}
        />
        {errorText && <span className="text--red">{errorText}</span>}
      </div>
    );
  },
);

export default InputWithValidatorV2;
