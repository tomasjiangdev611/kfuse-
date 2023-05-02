import dayjs from 'dayjs';
import {
  DateSelection,
  SelectedFacetRangeByName,
  SelectedFacetValuesByName,
  SpanFilter,
  Trace,
} from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';
import { buildTracesFilter } from './utils';

type Args = {
  date: DateSelection;
  pageNum?: number;
  selectedFacetRangeByName: SelectedFacetRangeByName;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  spanFilter?: SpanFilter;
  ParentSpanIdFilter?: string;
  traceIdSearch: string;
};

const traces = async ({
  date,
  pageNum = 1,
  selectedFacetRangeByName,
  selectedFacetValuesByName,
  ParentSpanIdFilter,
  spanFilter,
  traceIdSearch,
}: Args): Promise<Trace[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return queryTraceService<Trace[], 'traces'>(`
    {
      traces (
        durationSecs: ${durationSecs},
        filter: ${buildTracesFilter({
          selectedFacetRangeByName,
          selectedFacetValuesByName,
          parentSpanIdFilter: ParentSpanIdFilter,
          spanFilter,
          traceIdSearch,
        })}
        limit: 100
        pageNum: ${pageNum}
        timestamp: "${endTime.format()}",
      ) {
        traceId
        span {
          spanId
          parentSpanId
          startTimeNs
          endTimeNs
          attributes
          latency
          name
          serviceName
          statusCode
          method
          endpoint
          rootSpan
        }
        traceMetrics {
          spanCount
          serviceExecTime
        }
      }
    }
  `).then((data) => data.traces || [], onPromiseError);
};

export default traces;
