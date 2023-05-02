import { Input, Select } from 'components';
import React from 'react';

const operatorOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' },
];

const reducerOptions = [
  { label: 'avg()', value: 'avg' },
  { label: 'min()', value: 'min' },
  { label: 'max()', value: 'max' },
  { label: 'sum()', value: 'sum' },
  { label: 'count()', value: 'count' },
  { label: 'last()', value: 'last' },
  { label: 'median()', value: 'median' },
  { label: 'diff()', value: 'diff' },
  { label: 'diff_abs()', value: 'diff_abs' },
  { label: 'percent_diff()', value: 'percent_diff' },
  { label: 'percent_diff_abs()', value: 'percent_diff_abs' },
  { label: 'count_non_null()', value: 'count_non_null' },
];

const metricIndexOptions = (metricsCount: number) => {
  const result = [];
  for (let i = 0; i < metricsCount; i += 1) {
    result.push({ label: String.fromCharCode(65 + i), value: i });
  }

  return result;
};

const evaluatorOptions = [
  { label: 'IS ABOVE', value: 'gt' },
  { label: 'IS BELOW', value: 'lt' },
  { label: 'IS OUTSIDE RANGE', value: 'outside_range' },
  { label: 'IS WITHIN RANGE', value: 'within_range' },
  { label: 'HAS NO VALUE', value: 'no_value' },
];

const AlertsNewRuleCondition = ({ index, metricsCount, propsByKey }) => {
  return (
    <div className="alerts-new-rule__condition">
      <div className="alert-new-rule__condition__input">
        <Select options={operatorOptions} {...propsByKey('operator')} />
      </div>
      <div className="alert-new-rule__condition__input">
        <Select options={reducerOptions} {...propsByKey('reducer')} />
      </div>
      <div className="alert-new-rule__condition__input">
        <Select
          options={metricIndexOptions(metricsCount)}
          {...propsByKey('metricIndex')}
        />
      </div>
      <div className="alert-new-rule__condition__input">
        <Select options={evaluatorOptions} {...propsByKey('evaluator')} />
      </div>
      <div className="alert-new-rule__condition__input">
        <Input type="text" {...propsByKey('value')} />
      </div>
    </div>
  );
};

export default AlertsNewRuleCondition;
