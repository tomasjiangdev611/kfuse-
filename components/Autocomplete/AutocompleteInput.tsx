import classnames from 'classnames';
import { useToggle } from 'hooks';
import React, { forwardRef, MutableRefObject, ReactElement } from 'react';
import { Input } from '../Input';

type Props = {
  onInputChange: (value: string) => void;
  openToggle: ReturnType<typeof useToggle>;
  placeholder?: string;
  typed: string;
  value: string;
};

const AutocompleteInput = (
  { onInputChange, openToggle, placeholder, typed, value }: Props,
  ref: MutableRefObject<HTMLInputElement>,
): ReactElement => {
  return (
    <Input
      className={classnames({
        autocomplete__input: true,
        'autocomplete__input--placeholder':
          !openToggle.value && !value && placeholder,
      })}
      onChange={onInputChange}
      ref={ref}
      type="text"
      value={openToggle.value ? typed : value || placeholder}
    />
  );
};

export default forwardRef(AutocompleteInput);
