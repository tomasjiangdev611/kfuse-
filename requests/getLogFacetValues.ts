import dayjs from 'dayjs';
import { FacetValue } from 'types';
import { onPromiseError } from 'utils';
import query from './query';
import { formatFacetName } from './utils';

type Result = {
  count: number;
  key: string;
};

const formatLogFacetValues = (logCounts: FacetValue[]): Result[] => {
  const countsByFacetValues: { [key: string]: number } = {};

  logCounts.forEach((logCount) => {
    const { count, facetValue } = logCount;
    if (!countsByFacetValues[facetValue]) {
      countsByFacetValues[facetValue] = 0;
    }

    countsByFacetValues[facetValue] += count;
  });

  return Object.keys(countsByFacetValues)
    .sort((a, b) => countsByFacetValues[b] - countsByFacetValues[a])
    .map((key) => ({
      count: countsByFacetValues[key],
      key,
    }));
};

type Args = {
  component: string;
  date: any;
  facetName: string;
  type: string;
};

const getLogFacetValues = async ({
  component,
  date,
  facetName,
  type,
}: Args): Promise<Result[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return query<FacetValue[], 'getLogCounts'>(`
    {
      getLogCounts(
        bucketSecs: ${durationSecs}
        durationSecs: ${durationSecs}
        facetName: "${formatFacetName(component, facetName, type)}"
        limit: 500,
        logQuery: {},
        timestamp: "${endTime.format()}",
      ) {
        bucketStart
        count
        facetValue
      }
    }
  `)
    .then((data) => data.getLogCounts || [], onPromiseError)
    .then(formatLogFacetValues);
};

export default getLogFacetValues;
