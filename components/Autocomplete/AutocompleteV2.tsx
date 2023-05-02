import React, { ReactElement, useMemo } from 'react';
import Select, { Props as SelectProps } from 'react-select';
import { AutocompleteOption } from './types';

const AutocompleteV2 = ({
  className,
  onChange,
  options,
  placeholder,
  value,
  ...rest
}: {
  className?: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  value: string;
} & SelectProps): ReactElement => {
  const foundLabel = useMemo(() => {
    if (value) {
      const foundOption = options.find((option) => option.value === value);
      if (foundOption) {
        return foundOption;
      }
      return null;
    }
  }, [options, value]);

  return (
    <div className={className}>
      <Select
        className="autocomplete-container"
        classNamePrefix="autocomplete-container"
        onChange={(e) => onChange(e.value)}
        options={options}
        placeholder={placeholder}
        value={foundLabel}
        {...rest}
      />
    </div>
  );
};

export default AutocompleteV2;
