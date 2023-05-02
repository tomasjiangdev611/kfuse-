import React, { ReactElement, useMemo } from 'react';
import { MultiselectOption } from './types';

const getSelectedByValue = (value: string[]) =>
  value.reduce((obj, valueItem) => ({ ...obj, [valueItem]: 1 }), {});

type Props = {
  close: () => void;
  options: MultiselectOption[];
  onClickHandler: (value: any) => () => void;
  typed: string;
  value: string[];
};

const MultiselectPanel = ({
  close,
  onClickHandler,
  options,
  typed,
  value,
}: Props): ReactElement => {
  const selectedByValue = useMemo(() => getSelectedByValue(value), [value]);
  const filteredOptions = useMemo(
    () =>
      options.filter(
        (option) =>
          option.value.toLowerCase().indexOf(typed) > -1 &&
          !selectedByValue[option.value],
      ),
    [options, selectedByValue, typed],
  );

  return (
    <div className="multiselect__panel">
      {filteredOptions.length ? (
        filteredOptions.map((option, index) => (
          <button
            key={index}
            className="multiselect__panel__option"
            onMouseDown={onClickHandler(close, option.value)}
          >
            <div className="multiselect__panel__option__label">
              {option.label}
            </div>
          </button>
        ))
      ) : (
        <div className="multiselect__panel__option __panel__option--placeholder">
          <div className="multiselect__panel__option__label">
            No options available
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiselectPanel;
