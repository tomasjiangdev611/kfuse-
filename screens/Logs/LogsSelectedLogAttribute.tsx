import React from 'react';
import { PopoverTriggerV2, PopoverPosition } from 'components';
import LogsSelectedLogAttributePanel from './LogsSelectedLogAttributePanel';
import { useLogsState } from './hooks';

type Props = {
  enableKeyExistsFilter?: boolean;
  fpHash?: string;
  logFacet: any;
  index: number;
  logsState: ReturnType<typeof useLogsState>;
  source: string;
};

const LogsSelectedLogAttribute = ({
  enableKeyExistsFilter,
  fpHash,
  index,
  logFacet,
  logsState,
  source,
}: Props) => {
  return (
    <PopoverTriggerV2
      className="logs__selected-log__attribute"
      popover={(props) => (
        <LogsSelectedLogAttributePanel
          enableKeyExistsFilter={enableKeyExistsFilter}
          fpHash={fpHash}
          logFacet={logFacet}
          logsState={logsState}
          source={source}
          {...props}
        />
      )}
      position={PopoverPosition.BOTTOM_RIGHT}
    >
      <span className="logs__selected-log__attribute__label">
        {`${logFacet.name}: `}
      </span>
      <span className="logs__selected-log__attribute__value">
        {logFacet.value}
      </span>
    </PopoverTriggerV2>
  );
};

export default LogsSelectedLogAttribute;
