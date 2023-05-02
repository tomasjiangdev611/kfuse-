import React, { ReactElement } from 'react';
import { Search, XCircle } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useLogsState } from './hooks';
import { readUrlSearchParams } from 'utils';

type Props = {
  close: () => void;
  hash: string;
  logsState: ReturnType<typeof useLogsState>;
  onExclude: () => void;
  onFilter: () => void;
};

const LogsFingerprintsListItemPanel = ({
  close,
  hash,
  logsState,
}: Props): ReactElement => {
  const { excludeFingerprint, filterFingerpint } = logsState;
  const navigate = useNavigate();

  const onExcludeFacetValue = () => {
    const urlSearchParams = readUrlSearchParams();
    close();
    excludeFingerprint(hash);
    navigate(`/logs?${urlSearchParams.toString()}`);
  };

  const onSelectOnlyFacetValue = () => {
    const urlSearchParams = readUrlSearchParams();
    close();
    filterFingerpint(hash);
    navigate(`/logs?${urlSearchParams.toString()}`);
  };

  return (
    <div className="logs__selected-log__attribute__panel">
      <button
        className="logs__selected-log__attribute__panel__item"
        onClick={onSelectOnlyFacetValue}
      >
        <Search
          className="logs__selected-log__attribute__panel__item__icon"
          size={14}
        />
        <span className="logs__selected-log__attribute__panel__item__label">
          Filter By
        </span>
        <span className="logs__selected-log__attribute__panel__item__value">
          Pattern
        </span>
      </button>
      <button
        className="logs__selected-log__attribute__panel__item"
        onClick={onExcludeFacetValue}
      >
        <XCircle
          className="logs__selected-log__attribute__panel__item__icon"
          size={14}
        />
        <span className="logs__selected-log__attribute__panel__item__label">
          Exclude
        </span>
        <span className="logs__selected-log__attribute__panel__item__value">
          Pattern
        </span>
      </button>
    </div>
  );
};

export default LogsFingerprintsListItemPanel;
