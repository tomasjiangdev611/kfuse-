import { AutocompleteOption } from 'components';
import dayjs from 'dayjs';
import { DateSelection, ExplorerQueryProps, FormulaProps } from 'types';

import {
  buildFormulaQuery,
  buildPromqlWithFunctions,
  convertTimeStringToUnix,
  getRollupToSecond,
  queryRangeTimeDurationV2,
} from 'utils';
import { AlertsEvaluateProps, ConditionProps } from '../types';

export const conditionForReducerLabel: AutocompleteOption[] = [
  { label: 'Mean', value: 'mean' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Sum', value: 'sum' },
  { label: 'Count', value: 'count' },
  { label: 'Last', value: 'last' },
];

export const conditionByLabel: AutocompleteOption[] = [
  { label: 'is above', value: 'gt' },
  { label: 'is below', value: 'lt' },
  { label: 'is equal to', value: 'eq' },
  { label: 'is not equal to', value: 'neq' },
];

export const aggregateType: AutocompleteOption[] = [
  { label: 'Average', value: 'avg' },
  { label: 'Maximum', value: 'max' },
  { label: 'Minimum', value: 'min' },
  { label: 'Sum', value: 'sum' },
];

export const getQueryAndFormulaKeysLabel = (
  queries: ExplorerQueryProps[],
  formulas: FormulaProps[],
): AutocompleteOption[] => {
  const queryAndFormulaLabels: AutocompleteOption[] = [];
  queries.forEach((query) => {
    queryAndFormulaLabels.push({
      label: `Query (${query.queryKey})`,
      value: `Query (${query.queryKey})`,
    });
  });
  formulas.forEach((formula, index) => {
    queryAndFormulaLabels.push({
      label: `Formula (${index + 1})`,
      value: `Formula (${index + 1})`,
    });
  });
  return queryAndFormulaLabels;
};

export const getFolderOptions = (folders: string[]): AutocompleteOption[] => {
  const folderOptions: AutocompleteOption[] = [];
  folders.forEach((folder) => {
    folderOptions.push({
      label: folder,
      value: folder,
    });
  });
  return folderOptions;
};

export const getFromAndToInSecond = (
  date: DateSelection,
): { from: number; to: number } => {
  const today = dayjs().unix();
  if (!date.endLabel) {
    const from = today - date.startTimeUnix;
    const to = today - date.endTimeUnix;
    return { from, to };
  }

  const from = convertTimeStringToUnix(date.startLabel);
  const to = convertTimeStringToUnix(date.endLabel);
  return { from: today - from, to: today - to };
};

export const getPromQlQuery = (
  formulas: FormulaProps[],
  queryKey: string,
  queries: ExplorerQueryProps[],
): { promql: string; metric: string } => {
  if (queryKey.includes('Query')) {
    const queryKeyParsed = queryKey.split('(')[1].split(')')[0];
    const query = queries.find((q) => q.queryKey === queryKeyParsed);
    if (query) {
      return { promql: buildPromqlWithFunctions(query), metric: query.metric };
    }
  }
  if (queryKey.includes('Formula')) {
    const formulaIndex = Number(queryKey.split('(')[1].split(')')[0]) - 1;
    const formula = formulas[formulaIndex];

    const promqlQueries: string[] = [];
    queries.forEach((query) => {
      promqlQueries.push(buildPromqlWithFunctions(query));
    });

    const queryKeys: string[] = queries.map((query) => query.queryKey);
    const formulaQuery = buildFormulaQuery(promqlQueries, queryKeys, [formula]);

    return { promql: formulaQuery[0], metric: queries[0].metric };
  }
  return { promql: '', metric: '' };
};

export const getContactPointsForCreateAlert = (
  contactPoints: string[],
): {
  [key: string]: string;
} => {
  const contactPointsObject: { [key: string]: string } = {};
  contactPoints.forEach((contactPoint) => {
    contactPointsObject[contactPoint] = 'true';
  });
  return contactPointsObject;
};

export const getGroupListByFolder = (
  data: any,
  folderName: string,
  selectedGroup: string,
): AutocompleteOption[] => {
  const folder = data[folderName];
  const groupList: AutocompleteOption[] = [];

  const isSelectGroupExist = folder?.find(
    (group: any) => group.name === selectedGroup,
  );
  if (!isSelectGroupExist && selectedGroup) {
    groupList.push({ label: selectedGroup, value: selectedGroup });
  }
  if (folder) {
    folder.forEach((group: any) => {
      groupList.push({ label: group.name, value: group.name });
    });
  }
  return groupList;
};

const getConditionToOperator = (of: ConditionProps['of']): string => {
  switch (of) {
    case 'gt':
      return '>';
    case 'lt':
      return '<';
    case 'eq':
      return '=';
    case 'neq':
      return '!=';
    default:
      return '=';
  }
};

const getAlertInterval = (
  date: DateSelection,
  evaluate: AlertsEvaluateProps,
  when: string,
): string => {
  if (when === 'last') {
    const step = getRollupToSecond(evaluate.every);
    return `${step}s`;
  }

  const { startTimeUnix, endTimeUnix } = date;
  const step = queryRangeTimeDurationV2(startTimeUnix, endTimeUnix);
  return `${step}s`;
};

export const getCreateAlertQueries = (
  condition: ConditionProps,
  date: DateSelection,
  promqlQuery: string,
  datasourceUid: string,
  evaluate: AlertsEvaluateProps,
): any => {
  const queryCondition = [
    {
      type: 'query',
      reducer: { params: [], type: condition.when },
      operator: { type: 'and' },
      query: { params: [] },
      evaluator: { params: [condition.value], type: condition.of },
    },
  ];
  const queryDatasource = {
    type: '__expr__',
    uid: '__expr__',
    name: 'Expression',
  };

  const queryA = {
    refId: 'A',
    queryType: '',
    datasourceUid: datasourceUid,
    relativeTimeRange: getFromAndToInSecond(date),
    model: {
      refId: 'A',
      hide: false,
      expr: promqlQuery,
      interval: getAlertInterval(date, evaluate, condition.when),
    },
  };

  const queryB = {
    datasourceUid: '-100',
    model: {
      refId: 'B',
      type: 'reduce',
      datasource: queryDatasource,
      conditions: queryCondition,
      hide: false,
      reducer: condition.when,
      expression: 'A',
    },
    refId: 'B',
    queryType: '',
  };

  const queryC = {
    datasourceUid: '-100',
    model: {
      refId: 'C',
      type: 'math',
      datasource: queryDatasource,
      conditions: queryCondition,
      hide: false,
      expression: `$B ${getConditionToOperator(condition.of)} ${
        condition.value
      }`,
    },
    refId: 'C',
    queryType: '',
  };

  return [queryA, queryB, queryC];
};
