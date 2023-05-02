import classnames from 'classnames';
import React, {
  forwardRef,
  KeyboardEventHandler,
  HTMLProps,
  MutableRefObject,
  ReactElement,
} from 'react';
import { InputProps } from './types';

const defaultProps = {
  className: '',
  onBlur: () => {},
  onFocus: () => {},
  placeholder: '',
  value: '',
};

const Input = (
  {
    className,
    onChange,
    onBackspace,
    onBlur,
    onFocus,
    onEnter,
    placeholder,
    name,
    type,
    value,
    ...rest
  }: InputProps & Omit<HTMLProps<HTMLInputElement>, 'onChange'>,
  ref: MutableRefObject<HTMLInputElement>,
): ReactElement => {
  const onKeyUp: KeyboardEventHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (onKeyUp) {
        onEnter();
      }
    }

    if (e.keyCode === 8) {
      if (onBackspace) {
        onBackspace();
      }
    }
  };

  return (
    <input
      {...rest}
      className={classnames({ input: true, [className]: className })}
      onBlur={onBlur}
      onChange={(e) => {
        onChange(e.currentTarget.value);
      }}
      onFocus={onFocus}
      onKeyUp={onKeyUp}
      placeholder={placeholder}
      name={name}
      ref={ref}
      type={type}
      value={value}
    />
  );
};

const ForwaredRefInput = forwardRef(Input);
ForwaredRefInput.defaultProps = defaultProps;

export default ForwaredRefInput;
