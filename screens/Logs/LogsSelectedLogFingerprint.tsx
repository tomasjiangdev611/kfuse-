import { PopoverTrigger } from 'components';
import React from 'react';
import LogsFingerprintsListItemPanel from './LogsFingerprintsListItemPanel';

const LogsSelectedLogFingerprint = ({ fpHash, fpPattern, logsState }) => {
  return (
    <div className="logs__selected-log__fingerprint">
      <PopoverTrigger
        className="logs__selected-log__fingerprint__trigger"
        component={LogsFingerprintsListItemPanel}
        props={{ hash: fpHash, logsState }}
        width={240}
      >
        {fpPattern}
      </PopoverTrigger>
    </div>
  );
};

export default LogsSelectedLogFingerprint;
