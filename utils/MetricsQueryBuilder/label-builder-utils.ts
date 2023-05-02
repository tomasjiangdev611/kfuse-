const MetricLabelOperator = ['=~', '!~', '!=', '='];
export const MetricLabelOperatorOptions = MetricLabelOperator.map((item) => ({
  value: item,
  label: item,
}));

/**
 * Parse label query
 * @param query
 * @returns { label: string, operator: string, value: string | string[] }
 * @example 'label1="value1"' => { label: 'label1', operator: '=', value: 'value1' }
 * @example 'label1!="value1"' => { label: 'label1', operator: '!=', value: 'value1' }
 * @example 'label1=~"value1|value2|value3"' => { label: 'label1', operator: '=~', value: ["value1", "value2", "value3"] }
 * @opetaor = LabelSelectOperator
 */
export const parseMetricLabelQuery = (
  query: string,
): {
  label: string;
  operator: string;
  value: string | string[];
} => {
  const operator = MetricLabelOperator.find((item) => query.includes(item));
  if (!operator) {
    return null;
  }
  const [label, value] = query.split(operator);
  let labelValues: string | string[] = value.trim().replace(/"/g, '');
  if (operator === '=~' || operator === '!~') {
    labelValues = [labelValues];
  }
  return {
    label: label.trim(),
    operator,
    value: labelValues,
  };
};
