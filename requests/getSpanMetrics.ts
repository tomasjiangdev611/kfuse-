import { PercentileSummary, TraceView } from 'types';
import { onPromiseError } from 'utils';

import queryTraceService from './queryTraceService';

type Args = {
  latencyNs: number;
  serviceName: string;
  spanName: string;
};

type Result = {
  spanDurationPercentiles: PercentileSummary;
  spanDurationRank: number;
};

const getSpanMetrics = async ({
  latencyNs,
  serviceName,
  spanName,
}: Args): Promise<Result> => {
  return queryTraceService<Result, 'spanMetrics'>(`
    {
      spanMetrics(
        latencyNs: ${latencyNs}
        serviceName: "${serviceName}"
        spanName: "${spanName}"
      ) {
        spanDurationPercentiles {
          max
          p99
          p95
          p90
          p75
          p50
        }
        spanDurationRank
      }
    }
  `).then((data) => data.spanMetrics || null, onPromiseError);
};

export default getSpanMetrics;
