import React from 'react';
import AlertsNewRuleCondition from './AlertsNewRuleCondition';
import { defaultCondition } from './constants';

const AlertsNewRuleConditions = ({ metricsCount, onChange, value }) => {
  const addCondition = () => {
    const nextValue = [...value, defaultCondition];
    onChange(nextValue);
  };

  const propsByKeyHandler = (i) => (key: string) => ({
    onChange: (nextPropValue: any) => {
      const nextValue = [...value];
      nextValue[i] = { ...value[i], [key]: nextPropValue };
      onChange(nextValue);
    },
    value: value[i][key],
  });

  return (
    <div className="alerts-new-rule__conditions">
      {value.map((condition, i) => (
        <AlertsNewRuleCondition
          key={i}
          metricsCount={metricsCount}
          propsByKey={propsByKeyHandler(i)}
        />
      ))}
      <button
        className="alerts-new-rule__conditions__button button"
        onClick={addCondition}
      >
        Add Condition
      </button>
    </div>
  );
};

export default AlertsNewRuleConditions;
