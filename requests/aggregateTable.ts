import dayjs from 'dayjs';
import {
  DateSelection,
  SelectedFacetValuesByName,
  SpanFilter,
  Trace,
} from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';
import { buildTracesFilter } from './utils';

type Args = {
  date: DateSelection;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  spanFilter?: SpanFilter;
  ParentSpanIdFilter?: string;
  traceIdSearch: string;
};

const aggregateTable = async ({
  date,
  selectedFacetValuesByName,
  ParentSpanIdFilter,
  spanFilter,
  traceIdSearch,
}: Args): Promise<Trace[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return queryTraceService<Trace[], 'aggregateTable'>(`
    {
      aggregateTable(
        aggregation: "max"
        aggregationField: "duration"
        durationSecs: ${durationSecs},
        filter: ${buildTracesFilter({
          selectedFacetValuesByName,
          parentSpanIdFilter: ParentSpanIdFilter,
          spanFilter,
          traceIdSearch,
        })}
        groupBy: "*"
        timestamp: "${endTime.format()}",
      ) {
        value
        groupVal
      }
    }
  `).then((data) => data.aggregateTable || [], onPromiseError);
};

export default aggregateTable;
