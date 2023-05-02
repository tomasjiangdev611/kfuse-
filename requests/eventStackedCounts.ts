import { eventsFacets } from 'constants';
import dayjs from 'dayjs';
import { DateSelection, FilterProps, SelectedFacetValuesByName } from 'types';
import { getRollupToSecond, queryRangeTimeDurationV2 } from 'utils';

import queryEventService from './queryEventService';
import {
  buildEventsFilter,
  formatEventsChartInTimeseries,
  formatEventsInTable,
} from './utils';

type Args = FilterProps & {
  countUnique?: string;
  date: DateSelection;
  groupBys?: string[];
  filterByFacets?: any;
  returnFormat?: 'timeseries' | 'table' | 'top-list';
  rollUp?: string;
  searchTerms: string[];
  selectedFacetValuesByName: SelectedFacetValuesByName;
  TopOrBottomK?: { type: 'Top' | 'Bottom'; k: number };
};

const eventStackedCounts = async ({
  countUnique,
  date,
  groupBys,
  filterByFacets = {},
  returnFormat = 'timeseries',
  rollUp,
  searchTerms = [],
  selectedFacetValuesByName,
  TopOrBottomK,
}: Args): Promise<any> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const filterQuery = buildEventsFilter(
    filterByFacets,
    searchTerms,
    selectedFacetValuesByName,
  );

  const groupBysArray = groupBys.map((groupBy) => {
    return eventsFacets.includes(groupBy) ? `@${groupBy}` : groupBy;
  });

  const stepSecond = queryRangeTimeDurationV2(startTimeUnix, endTimeUnix);
  const roundSecs = rollUp ? getRollupToSecond(rollUp) : stepSecond;
  const eventLevelCounts = await queryEventService<Array<any>, 'eventCounts'>(`
    {
    eventCounts(
        durationSecs: ${durationSecs},
        filter: ${filterQuery},
        ${rollUp ? `roundSecs: ${roundSecs}` : ''},
        ${
          groupBys.length > 0
            ? `groupBys: ["${groupBysArray.join('","')}"]`
            : ''
        }
        ${
          countUnique
            ? `countUnique: "${
                eventsFacets.includes(countUnique) ? '@' : ''
              }${countUnique}"`
            : ''
        },
        timestamp: "${endTime.format()}",
        ${
          TopOrBottomK
            ? `topOrBottomK: { type: ${TopOrBottomK.type}, k: ${TopOrBottomK.k}}`
            : ''
        }
        limit: 9999
      ) {
        timestamp
        count
        values
      }
    }
  `)
    .then((data) => data.eventCounts || [])
    .then((res) => {
      if (returnFormat === 'table' || returnFormat === 'top-list') {
        return formatEventsInTable(res, groupBys);
      }

      return formatEventsChartInTimeseries(res, roundSecs, date, groupBys);
    });

  return eventLevelCounts;
};

export default eventStackedCounts;
