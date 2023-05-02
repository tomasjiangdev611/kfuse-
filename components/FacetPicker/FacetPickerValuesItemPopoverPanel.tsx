import React, { ReactElement } from 'react';
import { Search, XCircle } from 'react-feather';

type Props = {
  close: () => void;
  excludeFacetValue: (value: string) => void;
  selectOnlyFacetValue: (value: string) => void;
  value: string;
};

const LogsSelectedLogAttributePanel = ({
  close,
  excludeFacetValue,
  selectOnlyFacetValue,
  value,
}: Props): ReactElement => {
  const excludeFacetValueHandler = () => {
    excludeFacetValue(value);
    close();
  };

  const selectOnlyFacetValueHandler = () => {
    selectOnlyFacetValue(value);
    close();
  };

  return (
    <div className="logs__selected-log__attribute__panel">
      <button
        className="logs__selected-log__attribute__panel__item"
        onClick={selectOnlyFacetValueHandler}
      >
        <Search
          className="logs__selected-log__attribute__panel__item__icon"
          size={14}
        />
        <span className="logs__selected-log__attribute__panel__item__label">
          Filter By
        </span>
        <span className="logs__selected-log__attribute__panel__item__value">
          {value}
        </span>
      </button>
      <button
        className="logs__selected-log__attribute__panel__item"
        onClick={excludeFacetValueHandler}
      >
        <XCircle
          className="logs__selected-log__attribute__panel__item__icon"
          size={14}
        />
        <span className="logs__selected-log__attribute__panel__item__label">
          Exclude
        </span>
        <span className="logs__selected-log__attribute__panel__item__value">
          {value}
        </span>
      </button>
    </div>
  );
};

export default LogsSelectedLogAttributePanel;
