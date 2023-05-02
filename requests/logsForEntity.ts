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
  if (s === 'timestamp') {
    return 'ts';
  }

  return snakeCase(s);
};

const logsForEntity = async ({
  cursor = null,
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  searchTerms,
  sort,
}: Args): Promise<LogEventList> => {
  const { startTimeUnix, endTimeUnix } = date;
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

  return query<LogEventList, 'logsForEntity'>(`
    {
      logsForEntity(
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
          eventId
          timestamp
          message
          fpHash
          level
          source
          host
          podName
          kubeContainerName,
          kubeNamespace
          kubeService
        }
      }
    }
  `).then(
    (data) => data.logsForEntity || { cursor: '', events: [] },
    () => ({ cursor: '', events: [] }),
  );
};

export default logsForEntity;
