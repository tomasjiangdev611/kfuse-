import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  MutableRefObject,
} from 'react';

type HTMLInputTypeAttribute =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'month'
  | 'week'
  | 'color'
  | 'file'
  | 'range'
  | 'datetime'
  | 'hidden'
  | 'image'
  | 'button'
  | 'reset'
  | 'submit';

export type InputProps = {
  className?: string;
  onChange?: (value: string) => void;
  onBackspace?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onEnter?: () => void;
  onKeyPress?: () => void;
  placeholder?: string;
  name?: string;
  ref?: MutableRefObject<HTMLInputElement>;
  type: HTMLInputTypeAttribute;
  value?: string;
};

export type InputWithValidatorProps = InputProps & {
  title: string;
  value: string;
  validator: (value: string) => string;
};

export type InputWithValidatorV2Props = {
  className?: string;
  errorText?: string;
  id?: string;
  label?: string;
  labelClassName?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  value?: string | number;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange'
>;
