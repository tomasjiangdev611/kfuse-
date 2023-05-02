export const operator: { [key: string]: string } = {
  '!=': 'neq',
  '>=': 'gte',
  '>': 'gt',
  '<=': 'lte',
  '<': 'lt',
  '=~': 'regex',
  '=': 'eq',
};

export const getOperatorInQuery = (query: string): string => {
  const result = Object.keys(operator).find((key) => query.includes(key));
  return result || '';
};

export const getOperatorSign = (op: string): string => {
  const invertedOperator: { [key: string]: string } = Object.keys(
    operator,
  ).reduce((acc, key) => {
    acc[operator[key]] = key;
    return acc;
  }, {});
  return invertedOperator[op] || '';
};

export const eventQueryOperator: { [key: string]: string } = {
  '!=': 'neq',
  '=~': 'regex',
  '=': 'eq',
};

export const getEventOperatorInQuery = (query: string): string => {
  const result = Object.keys(eventQueryOperator).find((key) =>
    query.includes(key),
  );
  return result || '';
};

export const logsQueryOperator: { [key: string]: string } = {
  '!=': 'neq',
  '!~': 'notregex',
  '=~': 'regex',
  '=': 'eq',
};

export const getLogsOperatorInQuery = (query: string): string => {
  const result = Object.keys(logsQueryOperator).find((key) =>
    query.includes(key),
  );
  return result || '';
};
