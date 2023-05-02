import classnames from 'classnames';
import React, {
  forwardRef,
  HTMLProps,
  MutableRefObject,
  ReactElement,
} from 'react';

type Props = {
  className?: string;
  errorText?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onEnter?: () => void;
  placeholder?: string;
  ref: MutableRefObject<HTMLTextAreaElement>;
  type: 'text';
  value?: string;
};

const defaultProps = {
  className: '',
  onBlur: () => {},
  onFocus: () => {},
  placeholder: '',
  value: '',
};

const Textarea = (
  {
    className,
    errorText,
    onChange,
    onBlur,
    onFocus,
    onEnter,
    placeholder,
    value,
    ...rest
  }: Props & Omit<HTMLProps<HTMLTextAreaElement>, 'onChange'>,
  ref: MutableRefObject<HTMLTextAreaElement>,
): ReactElement => {
  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (onKeyUp) {
        onEnter();
      }
    }
  };

  return (
    <>
      <textarea
        {...rest}
        className={classnames({ input: true, [className]: className })}
        onBlur={onBlur}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        ref={ref}
        value={value}
      />
      {errorText && <span className="text--red">{errorText}</span>}
    </>
  );
};

const ForwaredRefTextarea = forwardRef(Textarea);
ForwaredRefTextarea.defaultProps = defaultProps;

export default ForwaredRefTextarea;
