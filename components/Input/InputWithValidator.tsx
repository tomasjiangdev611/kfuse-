import React, { useEffect, useState } from 'react';
import { Input } from './index';
import { InputWithValidatorProps } from './types';

const InputWithValidator = ({
  title,
  value,
  validator,
  ...rest
}: InputWithValidatorProps): React.ReactElement => {
  const [error, setError] = useState<string>(null);
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    setError(validator(value));
    setInputValue(value);
  }, [value]);

  return (
    <>
      <p className="text--size--medium text--weight-normal">{title}</p>
      <Input
        {...rest}
        className={error ? 'input--error' : ''}
        onChange={(val: string) => {
          const validation = validator(val);
          setError(validation);
          setInputValue(val);
        }}
        placeholder={title}
        value={inputValue}
      />
      {error ? <p className="text--red">{error}</p> : null}
    </>
  );
};

export default InputWithValidator;
