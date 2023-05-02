import dayjs from 'dayjs';
import { AggregateTypes, DimensionFilter, Metric } from 'types';
import query from './query';

const mocked = (secondsFromNow: number) => {
  const minutes = Math.round(secondsFromNow / 60);
  const points = [];

  for (let i = 0; i < minutes; i += 1) {
    const time = dayjs().subtract(minutes - i, 'minute');
    points.push({
      ts: time.format(),
      tsEpoch: time.unix(),
      value: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
    });
  }

  return {
    metric: {
      all: [
        {
          series: points,
          tags: {
            host: 'gke-staging-pool-1-19e04a07-zpqr.us-west1-a.c.mvp-demo-301906.internal',
            kf_kube_cluster: 'gke_mvp-demo-301906_us-west1-a_staging',
            kube_namespace: 'target',
            name: 'kafka.replication.under_replicated_partitions',
            pod_name: 'kafka-1',
          },
        },
      ],
    },
  };
};

const formatDatasets = (datasets) => {
  return {
    datasets: datasets.map((dataset, i) => {
      return {
        data: dataset.series,
        label: dataset.tags.pod_name,
      };
    }),
  };
};

const formatFilterDimension = (dimensionFilter: DimensionFilter) => {
  const { dimensionName, isEqual, dimensionValue } = dimensionFilter;

  return `{
    ${isEqual ? 'eq' : 'neq'}: { ${dimensionName}: "${dimensionValue}" }
  }`;
};

const getAggregationQuery = (
  aggregateOn: string[],
  aggregateType: AggregateTypes,
) => {
  if (aggregateOn && aggregateType) {
    return `${aggregateType}(by: [${aggregateOn
      .map((dimensionName) => `"${dimensionName}"`)
      .join(',')}])`;
  }

  return '';
};

const getDimensionFiltersQuery = (
  dimensionFilters: DimensionFilter[],
): string => {
  const filteredDimensionFilters = dimensionFilters.filter(
    (dimensionFilter: DimensionFilter) =>
      dimensionFilter.dimensionName && dimensionFilter.dimensionValue,
  );

  if (filteredDimensionFilters.length) {
    if (filteredDimensionFilters.length === 1) {
      return formatFilterDimension(filteredDimensionFilters[0]);
    }

    const andDimensionFilters = filteredDimensionFilters.filter(
      (dimensionFilter) => !dimensionFilter.isOr,
    );

    const orDimensionFilters = filteredDimensionFilters.filter(
      (dimensionFilters) => dimensionFilters.isOr,
    );

    return `{
      ${
        andDimensionFilters.length
          ? `and: [${andDimensionFilters
              .map(formatFilterDimension)
              .join('\n')}]`
          : ''
      }
      ${
        orDimensionFilters.length
          ? `or: [${orDimensionFilters.map(formatFilterDimension).join('\n')}]`
          : ''
      }
    }`;
  }

  return '';
};

const getMetricDatasets = async (
  metric: Metric,
  secondsFromNow: number,
): Promise<any> => {
  const { aggregateOn, aggregateType, dimensionFilters, metricName } = metric;
  const aggreagationQuery = getAggregationQuery(aggregateOn, aggregateType);
  const dimensionFiltersQuery = getDimensionFiltersQuery(dimensionFilters);

  return query(`
    {
      metric(
        name: "${metricName}"
        durationSecs: ${secondsFromNow}
        ${
          dimensionFiltersQuery
            ? `dimensionFilter: ${dimensionFiltersQuery}`
            : ''
        }
      ) {
        ${aggreagationQuery ? aggreagationQuery : 'all'} {
          series {
            ts
            tsEpoch
            value
          }
          tags
        }
      }
    }
`)
    .then(
      (data) =>
        (aggregateType ? data?.metric[aggregateType] : data?.metric?.all) || [],
    )
    .then(formatDatasets);
};

export default getMetricDatasets;
