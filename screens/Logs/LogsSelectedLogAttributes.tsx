import { Input } from 'components';
import React, { ReactElement, useState } from 'react';

import { useLogsState } from './LogsState';
import LogsSelectedLogAttribute from './LogsSelectedLogAttribute';

const sortLogFacets = ({ logFacets, search }) => {
  const sortByName = (a, b) => a.name.localeCompare(b.name);

  const searchLowered = search.toLowerCase();
  if (searchLowered) {
    return logFacets
      .filter(
        (facet) =>
          `${facet.name}:${facet.value}`.toLowerCase().indexOf(searchLowered) >
          -1,
      )
      .sort(sortByName);
  }

  return logFacets.sort(sortByName);
};

type Props = {
  enableKeyExistsFilter?: boolean;
  fpHash?: string;
  logFacets: any;
  logsState: ReturnType<typeof useLogsState>;
  searchPlaceholder: string;
  source: string;
};

const LogsSelectedLogAttributes = ({
  enableKeyExistsFilter = false,
  fpHash,
  logFacets,
  logsState,
  searchPlaceholder,
  source,
}: Props): ReactElement => {
  const [search, setSearch] = useState('');
  const sortedLogFacets = sortLogFacets({
    logFacets,
    search,
  });

  return (
    <div className="logs__selected-log__attributes">
      <div className="logs__selected-log__attributes__toolbar">
        <Input
          className="logs__selected-log__attributes__toolbar__input"
          onChange={setSearch}
          placeholder={searchPlaceholder}
          type="text"
          value={search}
        />
      </div>
      {sortedLogFacets.length ? (
        sortedLogFacets.map((logFacet, i) => (
          <LogsSelectedLogAttribute
            key={i}
            enableKeyExistsFilter={enableKeyExistsFilter}
            fpHash={fpHash}
            index={i}
            logFacet={logFacet}
            logsState={logsState}
            source={source}
          />
        ))
      ) : (
        <div className="logs__selected-log__attributes__placeholder">
          No facets
        </div>
      )}
    </div>
  );
};

export default LogsSelectedLogAttributes;
