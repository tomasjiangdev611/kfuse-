import React from 'react';
import LogsSelectedLogTopologyFacetsItem from './LogsSelectedLogTopologyFacetsItem';

const getRows = (topoFacets, numberOfItemsPerRow) => {
  const sortByName = (a, b) => a.name.localeCompare(b.name);
  const sortedTopoFacets = topoFacets
    .filter((topoFacet) => topoFacet.value)
    .sort(sortByName);

  const result = [];
  for (let i = 0; i < sortedTopoFacets.length; i += numberOfItemsPerRow) {
    result.push([...sortedTopoFacets.slice(i, i + numberOfItemsPerRow)]);
  }

  return result;
};

const defaultProps = {
  numberOfItemsPerRow: 3,
};

const LogsSelectedLogTopologyFacets = ({ numberOfItemsPerRow, logsState, topoFacets }) => {
  const rows = getRows(topoFacets, numberOfItemsPerRow);

  return (
    <div className="logs__selected-log__topology-facets">
      {rows.length ? (
        rows.map((row) => (
          <div className="logs__selected-log__topology-facets__row">
            {new Array(numberOfItemsPerRow)
              .fill(null)
              .map((_, i) =>
                row[i] ? (
                  <LogsSelectedLogTopologyFacetsItem
                    index={i}
                    logsState={logsState}
                    topoFacet={row[i]}
                  />
                ) : null,
              )}
          </div>
        ))
      ) : (
        <div className="logs__selected-log__attributes__placeholder">
          No facets
        </div>
      )}
    </div>
  );
};

LogsSelectedLogTopologyFacets.defaultProps = defaultProps;

export default LogsSelectedLogTopologyFacets;
