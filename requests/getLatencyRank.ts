import dayjs from 'dayjs';
import { Span } from 'types';
import { onPromiseError } from 'utils';

import queryTraceService from './queryTraceService';

const getLatencyRank = async (span: Span): Promise<number> => {
  const { startTimeNs, endTimeNs, name: spanName, serviceName } = span;
  const inputDuration = endTimeNs - startTimeNs;
  const durationSecs = 60 * 60;
  const timestamp = dayjs(Math.floor(startTimeNs / 1000000));

  return queryTraceService<number, 'latencyRank'>(`
    {
      latencyRank(
        durationSecs: ${durationSecs}
        inputDuration: ${inputDuration}
        serviceName: "${serviceName}"
        spanName: "${spanName}"
        timestamp: "${timestamp.format()}"
      )
    }
  `).then((data) => data.latencyRank, onPromiseError);
};

export default getLatencyRank;
