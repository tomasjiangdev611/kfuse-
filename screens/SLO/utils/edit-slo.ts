import { ExplorerQueryProps, FormulaProps } from 'types/MetricsQueryBuilder';
import {
  decodePromqlToReadable,
  parsePromqlAndBuildQuery,
  transformSLOPromql,
} from 'utils';
import { buildSLOPromql } from './create-slo';

export const parseSLOPromql = (
  promql: string,
): {
  formulas: FormulaProps[];
  metricName: string;
  queries: ExplorerQueryProps[];
  leValue?: string;
} => {
  const sloPromql = transformSLOPromql(promql);

  const readablePromql = decodePromqlToReadable(sloPromql);
  const { formulas, queries } = parsePromqlAndBuildQuery([readablePromql]);
  if (sloPromql.includes('span_latency_ms_bucket')) {
    const newQueries = [...queries];
    newQueries[0].functions.shift(); // remove rate
    newQueries[0].functions.shift(); // remove sum

    const leRegex = /le="(\d+\.?\d*)"/;
    const leRegexValue = leRegex.exec(sloPromql);
    const leValue = leRegexValue ? leRegexValue[1] : '';

    if (newQueries.length > 1) {
      return {
        formulas: [],
        metricName: newQueries[0].metric,
        queries: [newQueries[0]],
        leValue,
      };
    }

    return {
      formulas,
      metricName: newQueries[0].metric,
      queries: newQueries,
      leValue,
    };
  } else {
    const newQueries = [...queries];
    queries[0].functions.shift(); // remove rate
    queries[0].functions.shift(); // remove sum

    return { formulas, metricName: newQueries[0].metric, queries: newQueries };
  }
};

export const getSLOHistoricalPromql = (
  errorExpr: string,
  totalExpr: string,
): [string, string] => {
  const errorPromql = parseSLOPromql(errorExpr);
  const totalPromql = parseSLOPromql(totalExpr);

  const { badEventsPromql, goodEventsPromql } = buildSLOPromql({
    denoQueryState: {
      queries: totalPromql.queries,
      formulas: totalPromql.formulas,
    },
    numeQueryState: {
      queries: errorPromql.queries,
      formulas: errorPromql.formulas,
    },
    options: {
      nume: { threshold: errorPromql.leValue || '' },
      deno: { threshold: totalPromql.leValue || '' },
    },
    useType: 'load',
  });

  return [badEventsPromql, goodEventsPromql];
};
export const getSLOHistoricalPromqlQueries = (
  errorExpr: string,
  totalExpr: string,
): {
  formulas: FormulaProps[];
  queries: ExplorerQueryProps[];
} => {
  const promqls = getSLOHistoricalPromql(errorExpr, totalExpr);
  const { queries, formulas } = parsePromqlAndBuildQuery(promqls);
  queries.forEach((query) => {
    const newFunctions = [...query.functions];
    newFunctions[0].params[0].value = '1d';

    const newSeries = [...query.series];
    newSeries.forEach((series, index) => {
      if (series.includes('le=')) {
        newSeries[index] = series.replace('le=', 'le=~');
      }
    });
  });

  return { queries, formulas };
};
