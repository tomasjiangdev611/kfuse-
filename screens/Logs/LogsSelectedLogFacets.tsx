import React from 'react';

const LogsSelectedLogFacets = ({ logFacets }) => {
  return (
    <div className="logs__selected-log__facets">
      {logFacets.map((logFacet) => (
        <div className="logs__selected-log__facet">
          <span className="logs__selected-log__facet__name">
            {`${logFacet.name}:`}
          </span>
          <span className="logs__selected-log__facet__value">
            {` ${logFacet.value}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LogsSelectedLogFacets;
