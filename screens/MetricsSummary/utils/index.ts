import {
  MetricSeriesProps,
  MertricsSummaryProps,
  SearchFilterProps,
} from '../types';
/**
 * Transform for metric list
 * @returns
 * example: {name: {}, value: {}} => [name, value]
 */
export const parseMetricList = (grafanaMetadata: {
  [key: string]: MertricsSummaryProps[];
}): MertricsSummaryProps[] => {
  return Object.keys(grafanaMetadata).map((key) => {
    return { ...grafanaMetadata[key][0], name: key };
  });
};

/**
 * Group by property key
 * @param grafanaSeries
 */
export const groupMetricSeries = (grafanaSeries: any): MetricSeriesProps => {
  const metricSeries: { [key: string]: Array<string> } = {};
  const metricKeys: string[] = [];
  grafanaSeries.map((series: any) => {
    const seriesKeys = Object.keys(series);
    seriesKeys.forEach((key) => {
      if (key === '__name__') {
        return;
      }
      if (!metricSeries[key]) {
        metricSeries[key] = [];
        metricKeys.push(key);
      }
      metricSeries[key].push(series[key]);
    });
  });

  metricKeys.sort((a, b) => (a > b ? 1 : -1));

  metricKeys.forEach((key) => {
    metricSeries[key] = metricSeries[key].filter(
      (value: string, index: number, self: any) => {
        return self.indexOf(value) === index;
      },
    );
  });
  return { data: metricSeries, metricKeys };
};

/**
 * Filter by metric origin
 * @param name
 * @param origin
 * example -> name: 'span_latency_ms_count', origin: ['apm'] => true
 * example -> name: 'logs_latency_ms_count', origin: ['log'] => true
 * example -> name: 'span_latency_ms_count', origin: ['log'] => false
 * example -> name: 'span_latency_ms_count', origin: ['apm', 'log'] => true
 * example -> name: 'counter_span_accepted', origin: ['apm', 'log', 'trace'] => false
 * name starts with span_ are from apm
 * name starts with logs_ are from log
 */
const filterByMetricOrigin = (name: string, origin: string[]): boolean => {
  if (origin.length === 0) {
    return true;
  }
  const apmPrefix = ['span_', 'spans_', 'trace_'];
  const isAPM =
    apmPrefix.filter((prefix) => name.startsWith(prefix)).length > 0;
  const isLog = name.startsWith('logs_');
  if (isAPM && origin.includes('apm')) {
    return true;
  }
  if (isLog && origin.includes('log')) {
    return true;
  }
  return false;
};

export const filterMetricSummaryList = (
  metric: MertricsSummaryProps,
  filter: SearchFilterProps,
): boolean => {
  const { search, type, origin } = filter;
  const searchLowered = search.toLowerCase().trim();
  const isSearchMatch = metric.name.toLowerCase().indexOf(searchLowered) > -1;
  const isTypeMatch = type.length === 0 || type.includes(metric.type);
  const isOriginMatch = filterByMetricOrigin(metric.name, origin);

  return isSearchMatch && isTypeMatch && isOriginMatch;
};

export const metricOriginOptions = [
  { label: 'APM', value: 'apm' },
  { label: 'Log', value: 'log' },
];
