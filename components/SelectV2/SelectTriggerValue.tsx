import classnames from 'classnames';
import React from 'react';
import { Input } from '../Input';

type Props = {
  isAutocompleteEnabled?: boolean;
  isOpen: boolean;
  labelsByValue: { [key: string]: string };
  onSearchChange?: (search: string) => void;
  placeholder: string;
  setSearch: (s: string) => void;
  search: string;
  value: any;
};

const SelectTriggerValue = ({
  isAutocompleteEnabled,
  isOpen,
  labelsByValue,
  onSearchChange,
  placeholder,
  search,
  setSearch,
  value,
}: Props) => {
  const onChange = (nextSearch: string) => {
    setSearch(nextSearch);
    if (onSearchChange) {
      onSearchChange(nextSearch);
    }
  };
  if (isAutocompleteEnabled && isOpen) {
    return (
      <div className="select__trigger__value">
        <Input
          autoFocus
          className="select__trigger__value__input"
          onChange={onChange}
          type="text"
          value={search}
        />
      </div>
    );
  }

  return (
    <div
      className={classnames({
        select__trigger__value: true,
        'select__trigger__value--placeholder':
          !labelsByValue[value] && !value && placeholder,
      })}
    >
      {labelsByValue[value] || value || placeholder}
    </div>
  );
};

export default SelectTriggerValue;
