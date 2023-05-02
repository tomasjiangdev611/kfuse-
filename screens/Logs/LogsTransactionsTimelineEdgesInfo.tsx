import React from 'react';

const LogsTransactionsTimelineEdgesInfo = ({ hash, onClick }) => {
  return (
    <div className="logs__transactions__timeline__edge__source">
      <button
        className="logs__transactions__timeline__edge__source__link link"
        onClick={onClick}
      >
        {hash}
      </button>
    </div>
  );
};
export default LogsTransactionsTimelineEdgesInfo;
