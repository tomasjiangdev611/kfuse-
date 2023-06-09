import { useModalsContext } from 'components';
import React, { ReactElement } from 'react';
import { Search, XCircle } from 'react-feather';
import { MdEdit } from 'react-icons/md';

import { HIDE_AUTOGENERATED_PREFIXS } from './constants';
import { useLogsState } from './hooks';
import LogsFacetRenameModal from './LogsFacetRenameModal';

type Props = {
  close: () => void;
  enableKeyExistsFilter: boolean;
  fpHash?: string;
  logFacet: any;
  logsState: ReturnType<typeof useLogsState>;
  source: string;
};

const LogsSelectedLogAttributePanel = ({
  close,
  enableKeyExistsFilter,
  fpHash,
  logFacet,
  logsState,
  source,
}: Props): ReactElement => {
  const modal = useModalsContext();
  const { name, value } = logFacet;
  const { filterOnlyFacetValueFromLogEventDetail, toggleKeyExists } = logsState;

  const onExcludeFacetValue = () => {
    filterOnlyFacetValueFromLogEventDetail({
      exclude: true,
      name,
      source,
      value,
    });
    close();
  };

  const onSelectOnlyFacetValue = () => {
    filterOnlyFacetValueFromLogEventDetail({ name, source, value });
    close();
  };

  const onShowWhereKeyExists = () => {
    toggleKeyExists({ component: source, name, type: 'string' });
    close();
  };

  const onRenameFacet = () => {
    close();
    modal.push(
      <LogsFacetRenameModal
        closeModal={() => modal.pop()}
        fpHash={fpHash}
        internalFacet={name}
        source={source}
      />,
    );
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
          {`${logFacet.name}:${logFacet.value}`}
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
          {`${logFacet.name}:${logFacet.value}`}
        </span>
      </button>
      {HIDE_AUTOGENERATED_PREFIXS.some((prefix) => name.startsWith(prefix)) ? (
        <button
          className="logs__selected-log__attribute__panel__item"
          onClick={onRenameFacet}
        >
          <MdEdit
            className="logs__selected-log__attribute__panel__item__icon"
            size={14}
          />
          <span className="logs__selected-log__attribute__panel__item__label">
            Rename <b>{logFacet.name}</b> facet
          </span>
        </button>
      ) : null}
      {enableKeyExistsFilter ? (
        <button
          className="logs__selected-log__attribute__panel__item"
          onClick={onShowWhereKeyExists}
        >
          <span>Show where</span>
          <span className="text--weight-bold">{` ${logFacet.name} `}</span>
          <span>exists</span>
        </button>
      ) : null}
    </div>
  );
};

export default LogsSelectedLogAttributePanel;
