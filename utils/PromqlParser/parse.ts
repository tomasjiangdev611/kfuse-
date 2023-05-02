import { parser } from '@prometheus-io/lezer-promql';
import {
  ExplorerQueryProps,
  FormulaProps,
  FunctionProps,
  FunctionNamesProps,
} from 'types/MetricsQueryBuilder';
import {
  AGGREGATE_FUNCTIONS,
  DURATION_PARAM_FUNCTIONS,
  getFunctionNameByShortName,
  getFunctionParams,
} from 'utils/MetricsQueryBuilder';
import { getRollupToMinute } from 'utils';

import { handleExpression } from './expression';
import { isEmptyQuery } from './common-utils';
import { PromqlFunctionType } from './promql-operation';
import { traverseAndBuildFormula } from './traverse-node';
import {
  VisualizeContext,
  VisualizeQuery,
  VisualizeQueryLabel,
  VisualizeQueryOperation,
} from './types';

const getAggregationList = () => {
  const list: string[] = [];
  AGGREGATE_FUNCTIONS.forEach((item) => {
    list.push(item.replace('_by', '')); // avg, sum, min, max
    list.push('__' + item);
  });

  return list;
};

export const parsePromql = (
  promql: string,
): {
  context: VisualizeContext;
  formula: string;
} => {
  const tree = parser.parse(promql);
  const node = tree.topNode;

  const query: VisualizeQuery = { metric: '', labels: [], operations: [] };
  const context: VisualizeContext = { query: query, errors: [] };

  const formula = traverseAndBuildFormula(node, promql);
  try {
    handleExpression(promql, node, context);
  } catch (err) {
    if (err instanceof Error) {
      context.errors.push({ text: err.message });
    }
  }

  // If we have empty query, we want to reset errors
  if (isEmptyQuery(context.query)) {
    context.errors = [];
  }

  return { context, formula };
};

export const parsePromqlAndBuildQuery = (
  promqlQueries: string[],
): { formulas: FormulaProps[]; queries: ExplorerQueryProps[] } => {
  const queries: ExplorerQueryProps[] = [];
  const formulas: FormulaProps[] = [];

  promqlQueries.forEach((promql) => {
    const { context, formula } = parsePromql(promql);
    if (checkError(context)) {
      return;
    }

    convertToQuery(context.query, queries);
    if (formula) {
      formulas.push({ expression: formula, isActive: true, isValid: true });
    }
  });

  return { queries, formulas };
};

const nextLetter = (letter: string): string => {
  return String.fromCharCode(letter.charCodeAt(0) + 1);
};

const convertToQuery = (
  query: VisualizeQuery,
  queries: ExplorerQueryProps[],
): string => {
  const { labels, metric, operations } = query;

  const nextQueryKey =
    queries.length === 0 ? 'a' : nextLetter(queries.slice(-1)[0].queryKey);
  if (metric) {
    queries.push({
      functions: getFunctions(operations),
      isActive: true,
      labels: [],
      metric: metric,
      queryKey: nextQueryKey,
      series: getSeries(labels),
      steps: null,
    });
  }

  if (query.binaryQueries) {
    query.binaryQueries.forEach((binaryQuery) => {
      convertToQuery(binaryQuery.query, queries);
    });
  }

  return nextQueryKey;
};

const getSeries = (series: VisualizeQueryLabel[]): string[] => {
  return series.map((s) => {
    let labelName = s.label;
    if (labelName === 'cluster_name' || labelName === 'cluster') {
      labelName = 'kube_cluster_name';
    }

    return `${labelName}${s.op}"${s.value}"`;
  });
};

const getAggregationAndLabel = (
  funcMeta: FunctionNamesProps,
  funcParams: FunctionProps['params'],
  operations: VisualizeQueryOperation[],
): FunctionProps => {
  const aggregate = operations.find((op) =>
    getAggregationList().includes(op.id),
  );
  const { params } = aggregate;
  funcParams[0].value = funcMeta.shortName.replace('_by', '');

  // remove ( and ) from the first and last character and split by ,
  const label: string[] = [];
  if (params && params[0] && typeof params[0] === 'string') {
    params[0]
      .substring(1, params[0].length - 1)
      .split(',')
      .map((l) => {
        const newLabel = l.trim();
        if (newLabel === '') {
          return false;
        }
        label.push(newLabel);
      });
  }

  if (label.length > 0) {
    funcParams[1].value = label;
  }

  return {
    name: funcMeta.shortName,
    params: funcParams,
    vectorType: funcMeta?.vectorType || 'instant',
  };
};

const getFunctions = (
  operations: VisualizeQueryOperation[],
): ExplorerQueryProps['functions'] => {
  const functions: ExplorerQueryProps['functions'] = [];

  operations.forEach((op) => {
    const { id } = op;
    const { isAggregate, funcMeta, funcParams } =
      mapWithFunctionNameAndParams(id);
    if (isAggregate) {
      const aggregateFunc = getAggregationAndLabel(
        funcMeta,
        funcParams,
        operations,
      );
      aggregateFunc && functions.push(aggregateFunc);
      return;
    }

    if (
      !id.startsWith('__') &&
      Object.values(PromqlFunctionType).includes(id)
    ) {
      const vectorType = funcMeta?.vectorType || 'instant';
      if (!funcParams) {
        functions.push({ name: id, params: null, vectorType });
      } else {
        const func = getFunctionsWithParams(funcMeta, funcParams, op);
        functions.push(func);
      }
    }
  });

  return functions;
};

const getFunctionsWithParams = (
  funcMeta: FunctionNamesProps,
  funcParams: FunctionProps['params'],
  operation: VisualizeQueryOperation,
) => {
  const { id, params } = operation;
  const funcName = funcNamingFormat[id] || id;

  params.forEach((param, idx: number) => {
    if (DURATION_PARAM_FUNCTIONS.includes(funcName) && idx === 0) {
      const duration = param.toString().replace(':', '');
      if (id !== 'delta' && id !== 'idelta') {
        funcParams[idx].value = getRollupToMinute(duration as string);
        return;
      }
      funcParams[idx].value = duration;
      return;
    }
    funcParams[idx].value = param;
  });

  return {
    name: funcName,
    params: funcParams,
    vectorType: funcMeta.vectorType,
  };
};

const funcNamingFormat: { [key: string]: string } = {
  rate: 'rate_per_second',
  delta: 'diff',
  idelta: 'monotonic_diff',
};

const mapWithFunctionNameAndParams = (
  id: string,
): {
  isAggregate: boolean;
  funcMeta: FunctionNamesProps;
  funcParams: FunctionProps['params'];
} => {
  const funcName = funcNamingFormat[id] || id;
  let params = getFunctionParams(funcName);
  let funcMeta = getFunctionNameByShortName(funcName);

  const isAggregate = getAggregationList().includes(id);
  if (isAggregate) {
    // remove first chart only if it is __
    const aggregateName = id.includes('__') ? id.substring(2) : `${id}_by`;
    funcMeta = getFunctionNameByShortName(aggregateName);
    params = getFunctionParams(aggregateName);
  }

  return { isAggregate, funcMeta, funcParams: params };
};

const checkError = (context: VisualizeContext) => {
  let hasError = false;
  context.errors.forEach((err) => {
    if (
      err.text &&
      err.text.charAt(0) === '(' &&
      err.text.charAt(err.text.length - 1) === ')'
    ) {
      return;
    } else {
      hasError = true;
    }
  });

  return hasError;
};
