import React, { ReactElement } from 'react';

const SelectPanel = ({ close, onChange, options }): ReactElement => {
  const onClickHandler = (nextValue) => () => {
    onChange(nextValue);
    close();
  };

  return options.length ? (
    options.map((option) => (
      <button
        className="select__panel__option"
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
