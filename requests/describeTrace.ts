import dayjs from 'dayjs';
import { TraceView } from 'types';
import { onPromiseError } from 'utils';

import queryTraceService from './queryTraceService';

type Args = {
  startTimeNs: number;
  traceId: string;
};

const describeTrace = async ({
  startTimeNs,
  traceId,
}: Args): Promise<TraceView> => {
  const timestamp = dayjs(Math.round(startTimeNs / 1000000));
  return queryTraceService<TraceView, 'describeTrace'>(`
    {
      describeTrace(
        traceId: "${traceId}"
        timestamp: "${timestamp.format()}"
      ) {
        spans {
          attributes
          endpoint
          endTimeNs
          method
          name
          latency
          parentSpanId
          rootSpan
          serviceName
          spanId
          startTimeNs
          statusCode
        }
        traceMetrics {
          hostExecTime
          spanCount
          serviceExecTime
        }
      }
    }
  `).then((data) => data.describeTrace || null, onPromiseError);
};

export default describeTrace;
