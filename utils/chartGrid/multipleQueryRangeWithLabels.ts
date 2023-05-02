import { flatten } from 'lodash';
import { queryRange } from 'requests';
import { Chart, DateSelection, PrometheusMetricLabel } from 'types';
import { getRateIntervalAndStep, parsePromqlAndBuildQuery } from 'utils';
import formatPromDatasetWithLabels from '../formatPromDatasetWithLabels';

type Args = {
  chart: Chart;
  date: DateSelection;
  instant?: boolean;
  parsedPromql?: boolean;
  step?: string;
  width?: number;
};

type QueryArgs = {
  rateInterval: string;
  stepInMs: number;
};

const multipleQueryRangeWithLabels =
  (
    queries: (({ rateInterval, step }: QueryArgs) => string)[],
    labels: PrometheusMetricLabel[],
    fetchSequentially?: boolean,
  ) =>
  ({ chart, date, instant, width, parsedPromql }: Args) => {
    const { rateInterval, stepInMs } = getRateIntervalAndStep({ date, width });

    if (parsedPromql) {
      const promql = queries.map((query) => query({ rateInterval, stepInMs }));
      return Promise.resolve({
        ...parsePromqlAndBuildQuery(promql),
        stepInMs,
        labels: labels.map((label) => label({ span_name: null })),
      });
    }

    if (fetchSequentially) {
      return (async () => {
        const results = [];
        for (let i = 0; i < queries.length; i += 1) {
          const query = queries[i];

          const result = await queryRange({
            date,
            instant,
            query: query({ rateInterval, stepInMs }),
            step: `${stepInMs || 1}ms`,
          });
          results.push(result);
        }

        return formatPromDatasetWithLabels(labels)(flatten(results));
      })();
    }

    return Promise.all(
      queries.map((query) =>
        queryRange({
          date,
          instant,
          query: query({ rateInterval, stepInMs }),
          step: `${stepInMs || 1}ms`,
        }),
      ),
    )
      .then(flatten)
      .then(formatPromDatasetWithLabels(labels));
  };

export default multipleQueryRangeWithLabels;
