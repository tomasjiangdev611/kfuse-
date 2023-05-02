import dayjs from 'dayjs';
import { DateSelection, Span } from 'types';
import { onPromiseError } from 'utils';

import queryTraceService from './queryTraceService';

type Args = {
  date: DateSelection;
  traceId: string;
};

const spans = async ({ date, traceId }: Args): Promise<Span[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  return queryTraceService<Span[], 'spans'>(`
    {
      spans(
        durationSecs: ${durationSecs},
        filter: {
          traceIdFilter: { id: "${traceId}" }
        }
        limit: 2000
        timestamp: "${endTime.format()}",
      ) {
        attributes
        endpoint
        endTimeNs
        latency
        method
        name
        parentSpanId
        rootSpan
        serviceName
        spanId
        startTimeNs
        statusCode
      }
    }
  `).then((data) => data.spans || [], onPromiseError);
};

export default spans;
