import dayjs from 'dayjs';
import { snakeCase } from 'snake-case';
import { LogEventList, FilterProps, DateSelection } from 'types';

import query from './query';
import { buildQuery } from './utils';

type Args = FilterProps & {
  cursor?: string;
  date: DateSelection;
  k8sFilters?: any[];
  filters?: any;
  filterByFacets?: [];
  filterOrExcludeByFingerprint: any;
  search?: string;
  sort?: { sortBy: string; sortOrder: string };
};

const formatSortBy = (s: string) => {
  const parts = s.split('.');
  const key = parts[parts.length - 1];

  if (key === 'timestamp') {
    return 'ts';
  }

  return snakeCase(key);
};

const getLogs = async ({
  cursor = null,
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  searchTerms,
  sort,
}: Args): Promise<LogEventList> => {
  const startTimeUnix = date.zoomedStartTimeUnix || date.startTimeUnix;
  const endTimeUnix = date.zoomedEndTimeUnix || date.endTimeUnix;

  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  const logQuery = buildQuery({
    selectedFacetValues,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    logLevel: null,
    searchTerms,
  });

  return query<LogEventList, 'getLogs'>(`
    {
      getLogs(
        cursor: ${cursor ? `"${cursor}"` : 'null'},
        ${logQuery !== '{}' ? `query: ${logQuery},` : ''}
        limit: 500,
        timestamp: "${endTime.format()}",
        durationSecs: ${durationSecs}
        ${
          sort?.sortBy && sort?.sortOrder
            ? `sortBy: "${formatSortBy(sort.sortBy)}"`
            : ''
        }
        ${sort?.sortBy && sort?.sortOrder ? `sortOrder: ${sort.sortOrder}` : ''}
      ) {
        cursor
        events {
          timestamp
          message
          fpHash
          fpPattern
          level
          labels
          facets
        }
      }
    }
  `).then(
    (data) => data.getLogs || { cursor: '', events: [] },
    () => ({ cursor: '', events: [] }),
  );
};

export default getLogs;
