import dayjs from 'dayjs';
import queryTraceService from './queryTraceService';
import { DateSelection, SelectedFacetValuesByName, Trace } from 'types';
import { onPromiseError } from 'utils';
import { buildTracesFilter } from './utils';

type Args = {
  date: DateSelection;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  ParentSpanIdFilter: string;
};

const cicdTraces = async ({
  date,
  selectedFacetValuesByName,
  ParentSpanIdFilter,
}: Args): Promise<Trace[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return queryTraceService<Trace[], 'traces'>(`
    {
      traces (
        durationSecs: ${durationSecs},
               filter: ${buildTracesFilter({
                 selectedFacetValuesByName,
                 onlyRootSpans: false,
                 parentSpanIdFilter: ParentSpanIdFilter,
                 traceIdSearch: null,
               })}
        limit: 100
        timestamp: "${endTime.format()}",
      ) {
        traceId
        span {
          spanId
          parentSpanId
          startTimeNs
          endTimeNs
          attributes
          name
          serviceName
          statusCode
          method
          endpoint
          spanDurationPercentiles {
            max
            p99
            p95
            p90
            p75
            p50
          }
        }
        traceMetrics {
          spanCount
          serviceExecTime
        }
      }
    }
  `).then((data) => data.traces || [], onPromiseError);
};

export default cicdTraces;
