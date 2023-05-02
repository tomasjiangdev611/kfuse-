import { delimiter } from 'constants';
import dayjs from 'dayjs';
import {
  DateSelection,
  FilterProps,
  NormalizeFunction,
  RangeAggregatesWithoutGrouping,
  RangeAggregatesWithParams,
  TimeSeries,
  VectorAggregatesWithParams,
} from 'types';

import { onPromiseError, queryRangeTimeDurationV2 } from 'utils';
import query from './query';
import { buildQuery } from './utils';

const formatFacetNames = (exclude: boolean, facetKeys: string[]) => {
  const facetsStrings = facetKeys
    .map((facetKey) => {
      const [_, name] = facetKey.split(delimiter);
      return `"${name}"`;
    })
    .join(',');

  return `{ without: ${exclude}, groups: [${facetsStrings}] }`;
};

type Args = FilterProps & {
  date: DateSelection;
  name: string;
  normalizeFunction: NormalizeFunction;
  source?: string;
  rangeAggregate: string;
  rangeAggregateExclude: boolean;
  rangeAggregateGrouping: string[];
  rangeAggregateParam: string;
  vectorAggregate: string;
  vectorAggregateExclude: boolean;
  vectorAggregateGrouping: string[];
  vectorAggregateParam: number;
  width: number;
};

const getLogMetricsTimeSeries = async ({
  date,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  name,
  normalizeFunction,
  rangeAggregate,
  rangeAggregateExclude,
  rangeAggregateGrouping,
  rangeAggregateParam,
  searchTerms,
  selectedFacetValues,
  source,
  vectorAggregate,
  vectorAggregateExclude,
  vectorAggregateGrouping,
  vectorAggregateParam,
  width,
}: Args): Promise<any> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const durationMs = durationSecs * 1000;
  const stepMs = queryRangeTimeDurationV2(startTimeUnix, endTimeUnix) * 1000;
  const logQuery = buildQuery({
    selectedFacetValues,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    source,
  });

  return query<TimeSeries[], 'getLogMetricsTimeSeries'>(`
    {
      getLogMetricsTimeSeries(
        durationMs: ${durationMs},
        ${name ? `facetName: "${name}",` : ''}
        ${
          normalizeFunction
            ? `facetNormalizeFunction: ${normalizeFunction}`
            : ''
        }
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        lookBackMs: ${stepMs}
        rangeAggregate: "${rangeAggregate}"
        ${
          !RangeAggregatesWithoutGrouping[rangeAggregate]
            ? rangeAggregateGrouping.length
              ? `rangeAggregateGrouping: ${formatFacetNames(
                  rangeAggregateExclude,
                  rangeAggregateGrouping,
                )}`
              : 'rangeAggregateGrouping: { everything: true }'
            : ''
        }
        ${
          RangeAggregatesWithParams[rangeAggregate]
            ? `rangeAggregateParam: ${rangeAggregateParam}`
            : ''
        }
        ${vectorAggregate ? `vectorAggregate: "${vectorAggregate}"` : ''}
        ${
          vectorAggregateGrouping.length
            ? `vectorAggregateGrouping: ${formatFacetNames(
                vectorAggregateExclude,
                vectorAggregateGrouping,
              )}`
            : ''
        }
        ${
          VectorAggregatesWithParams[vectorAggregate]
            ? `vectorAggregateParam: ${vectorAggregateParam}`
            : ''
        }
        stepMs: ${stepMs}
        timestamp: "${endTime.format()}"
      ) {
        points {
          ts
          value
        }
        tags
      }
    }
  `).then((data) => data.getLogMetricsTimeSeries || [], onPromiseError);
};

export default getLogMetricsTimeSeries;
