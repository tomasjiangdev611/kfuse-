import dayjs from 'dayjs';
import { DateSelection, Trace } from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';

type Args = {
  date: DateSelection;
  traceId: string;
};

const traces = async ({ date, traceId }: Args): Promise<Trace> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return queryTraceService<Trace[], 'traces'>(`
    {
      traces (
        durationSecs: ${durationSecs},
        filter: { traceIdFilter: { id: "${traceId}" } }
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
          latency
          name
          serviceName
          statusCode
          method
          endpoint
          rootSpan
        }
        traceMetrics {
          hostExecTime
          spanCount
          serviceExecTime
        }
      }
    }
  `).then(
    (data) => (data.traces && data.traces.length ? data.traces[0] : null),
    onPromiseError,
  );
};

export default traces;
