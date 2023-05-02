import { PopoverTriggerV2, PopoverPosition } from 'components';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatLogMessage } from 'utils';
import { useLogsState } from './hooks';
import LogsFingerprintsListItemPanel from './LogsFingerprintsListItemPanel';

const LogsFingerprintsListItemMain = ({
  fingerprint,
  logsState,
  message,
  pattern,
}: {
  fingerprint: any;
  logsState: ReturnType<typeof useLogsState>;
  message: string;
  pattern: string;
}): ReactElement => {
  const navigate = useNavigate();
  const onExclude = () => {
    const search = window.location.href.split('?')[1] || '';
    const nextUrlSearchParams = new URLSearchParams(`?${search}`);
    navigate(`/logs?${nextUrlSearchParams.toString()}`);
  };

  const onFilter = () => {
    const search = window.location.href.split('?')[1] || '';
    const nextUrlSearchParams = new URLSearchParams(`?${search}`);
    navigate(`/logs?${nextUrlSearchParams.toString()}`);
  };

  const { hash } = fingerprint;
  return (
    <div className="logs__fingerprints-list__item__main">
      <PopoverTriggerV2
        className="logs__fingerprints-list__item__pattern link"
        popover={({ close }) => (
          <LogsFingerprintsListItemPanel
            close={close}
            fingerprint={fingerprint}
            hash={hash}
            logsState={logsState}
            onExclude={onExclude}
            onFilter={onFilter}
          />
        )}
        position={PopoverPosition.BOTTOM_LEFT}
      >
        {pattern}
      </PopoverTriggerV2>
      {message ? (
        <div className="logs__fingerprints-list__item__message text--prewrap">
          {formatLogMessage(message)}
        </div>
      ) : null}
    </div>
  );
};

export default LogsFingerprintsListItemMain;
