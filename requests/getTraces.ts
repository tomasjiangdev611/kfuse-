import dayjs from 'dayjs';
import {
  SelectedFacetRangeByName,
  SelectedFacetValuesByName,
  SpanFilter,
  Trace,
} from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';
import { buildTracesFilter } from './utils';

type Args = {
  endTimeMs: number;
  startTimeMs: number;
  limit: number;
  pageNum?: number;
  selectedFacetRangeByName: SelectedFacetRangeByName;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  spanFilter?: SpanFilter;
  ParentSpanIdFilter?: string;
  traceIdSearch: string;
};

const traces = async ({
  endTimeMs,
  startTimeMs,
  pageNum = 1,
  limit,
  selectedFacetRangeByName,
  selectedFacetValuesByName,
  ParentSpanIdFilter,
  spanFilter,
  traceIdSearch,
}: Args): Promise<Trace[]> => {
  const endTime = dayjs(endTimeMs);
  const durationSecs = Math.round((endTimeMs - startTimeMs) / 1000);

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
        limit: ${limit}
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
