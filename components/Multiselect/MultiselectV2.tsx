import React, { ReactElement, useMemo } from 'react';
import Select, { Props as SelectProps } from 'react-select';
import { AutocompleteOption } from '../Autocomplete';

const MultiselectV2 = ({
  className,
  onChange,
  options,
  placeholder,
  value,
  ...rest
}: {
  className?: string;
  onChange: (value: string[]) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  value: string[];
} & SelectProps): ReactElement => {
  const labelsByValue: AutocompleteOption[] = useMemo(() => {
    return value.map((valueItem: string) => ({
      value: valueItem,
      label:
        options?.find((option) => option.value === valueItem)?.label ||
        valueItem,
    }));
  }, [value]);

  return (
    <div className={className}>
      <Select
        className="autocomplete-container"
        classNamePrefix="autocomplete-container"
        isMulti
        onChange={(e) => onChange(e.map((item) => item.value))}
        options={options}
        placeholder={placeholder}
        value={labelsByValue}
        {...rest}
      />
    </div>
  );
};

export default MultiselectV2;
