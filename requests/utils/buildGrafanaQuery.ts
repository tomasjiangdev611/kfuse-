/**
 * Build promql query for grafana
 * @param {string} queries
 * example: [{metric: 'node_cpu_seconds_total', label: ["cpu", "load"],
 *  aggregation: 'sum by', series: ["kube:random1", "kube:random2"]}] =>
 * sum by (cpu, load) (node_cpu_seconds_total{kube="random1", kube="random2"})
 * @returns string
 */
export const buildPromql = (queries: any): string => {
  const promqlQueries = queries.map((query) => {
    const { metric, aggregation, labels, series } = query;
    const labelsString = labels.join(', ');
    const seriesString = series.map((item) => {
      const [label, value] = item.split(':');
      return `${label}="${value}"`;
    });
    return `${aggregation} (${labelsString}) (${metric}{${seriesString}})`;
  });
  return promqlQueries.join(' + ');
};

/**
 * Build Grafa query for grafana
 */
export const buildGrafanaQuery = (queries: any): any => {
  const grafanaQuery = [];
  queries.forEach((query: any) => {
    const promql = buildPromql([query]);
    grafanaQuery.push({
      refId: query.queryKey,
      expr: promql,
      editorMode: 'code',
      range: true,
      instant: true,
      queryType: 'timeSeriesQuery',
      exemplar: false,
      datasourceId: 1,
      intervalMs: 15000,
      maxDataPoints: 1303,
    });
  });

  return grafanaQuery;
};
