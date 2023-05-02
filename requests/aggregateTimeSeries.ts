import dayjs from 'dayjs';
import {
  DateSelection,
  SelectedFacetRangeByName,
  SelectedFacetValuesByName,
  TimeSeries,
} from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';
import { buildTracesFilter } from './utils';

type Args = {
  aggregation: string;
  aggregationField: string;
  date: DateSelection;
  groupBys: string[];
  rollUpSeconds: number;
  selectedFacetRangeByName: SelectedFacetRangeByName;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const aggregateTimeSeries = async ({
  aggregation,
  aggregationField,
  date,
  groupBys,
  rollUpSeconds,
  selectedFacetRangeByName = {},
  selectedFacetValuesByName = {},
}: Args): Promise<TimeSeries[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const shouldUseCount = aggregation === 'distinctcount' && !aggregationField;

  return queryTraceService<TimeSeries[], 'aggregateTimeSeries'>(`
    {
      aggregateTimeSeries(
        aggregation: "${shouldUseCount ? 'count' : aggregation}"
        aggregationField: "${aggregationField ? aggregationField : '*'}"
        durationSecs: ${durationSecs}
        filter: ${buildTracesFilter({
          selectedFacetRangeByName,
          selectedFacetValuesByName,
        })}
        groupBy: [${groupBys.map((groupBy) => `"${groupBy}"`).join(',')}]
        rollUpSeconds: ${rollUpSeconds}
        timestamp: "${endTime.format()}"
      ) {
        BucketStart
        GroupVal
        Value
      }
    }
  `).then((data) => data.aggregateTimeSeries || [], onPromiseError);
};

export default aggregateTimeSeries;
