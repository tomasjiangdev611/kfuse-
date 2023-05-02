import React, { ReactNode, useMemo } from 'react';
import { SelectOption } from './types';

const getRenderedOptions = ({ isAutocompleteEnabled, options, search }) => {
  if (isAutocompleteEnabled && search) {
    const searchLoweredParts = search.toLowerCase().split(' ');
    return options.filter((option) => {
      const { label } = option;
      return label
        .split(' ')
        .some((labelPart) =>
          searchLoweredParts.some(
            (searchLoweredPart) =>
              labelPart.toLowerCase().indexOf(searchLoweredPart) > -1,
          ),
        );
    });
  }
  return options;
};

type Props = {
  isAutocompleteEnabled?: boolean;
  close: VoidFunction;
  onChange: (value: any) => void;
  options: SelectOption[];
  search: string;
};

const SelectPanel = ({
  close,
  isAutocompleteEnabled,
  onChange,
  options,
  search,
}: Props): ReactNode => {
  const onClickHandler = (nextValue: any) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(nextValue);
    close();
  };

  const renderedOptions = getRenderedOptions({
    isAutocompleteEnabled,
    options,
    search,
  });

  return renderedOptions.length ? (
    renderedOptions.map((option, i) => (
      <button
        className="select__panel__option"
        key={i}
        onMouseDown={onClickHandler(option.value)}
      >
        <div className="select__panel__option__label">{option.label}</div>
      </button>
    ))
  ) : (
    <div className="select__panel__option select__panel__option--placeholder">
      <div className="select__panel__option__label">No options available</div>
    </div>
  );
};

export default SelectPanel;
