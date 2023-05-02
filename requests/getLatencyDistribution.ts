import dayjs from 'dayjs';
import { DateSelection, LatencyDistribution } from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';

type Args = {
  date: DateSelection;
  serviceName: string;
  width: number;
};

const getLatencyDistribution = async ({
  date,
  serviceName,
  width,
}: Args): Promise<LatencyDistribution> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const numBuckets = Math.floor(width / 10);

  return queryTraceService<LatencyDistribution, 'latencyDistribution'>(`
    {
      latencyDistribution(
        durationSecs: ${durationSecs}
        serviceName: "${serviceName}"
        numBuckets: ${numBuckets}
        maxType: "max"
        timestamp: "${endTime.format()}"
      ) {
        buckets {
          bucketStart
          count
        }
        percentiles {
          max
          p50
          p90
          p99
        }
      }
    }
  `).then(
    (data) => ({
      ...(data.latencyDistribution || {
        buckets: [],
        percentiles: { max: 0, p99: 0, p95: 0, p90: 0, p75: 0, p50: 0 },
      }),
      durationSecs,
      numBuckets,
    }),
    onPromiseError,
  );
};

export default getLatencyDistribution;
