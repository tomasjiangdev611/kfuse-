import { Tab, Tabs, useTabs } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { buildPromqlQuery } from 'utils';
import MetricsPickerItemEditor from './MetricsPickerItemEditor';
import MetricsPickerItemForm from './MetricsPickerItemForm';

const MetricsPickerItem = ({
  entityTypeOptions,
  isLastMetric,
  index,
  metrics,
  onChange,
  removeMetric,
  value,
}): ReactElement => {
  const { promqlQuery, shouldUsePromqlQuery } = value;

  const onChangePromqlQuery = (nextPromqlQuery: number) => {
    onChange({ ...value, promqlQuery: nextPromqlQuery });
  };

  const tabs = useTabs(shouldUsePromqlQuery ? 1 : 0);
  const onTabChange = (nextActiveIndex: number) => {
    onChange({
      ...value,
      promqlQuery: nextActiveIndex === 1 ? buildPromqlQuery(value) : value.promqlQuery,
      shouldUsePromqlQuery: nextActiveIndex === 0 ? false : true,
    });
  };

  return (
    <div className="metrics-picker__item">
      <Tabs className="widget-modal__tabs" onChange={onTabChange} tabs={tabs}>
        <Tab label="Form">
          <MetricsPickerItemForm
            entityTypeOptions={entityTypeOptions}
            isLastMetric={isLastMetric}
            index={index}
            metrics={metrics}
            onChange={onChange}
            removeMetric={removeMetric}
            value={value}
          />
        </Tab>
        <Tab label="Editor">
          <MetricsPickerItemEditor
            metrics={metrics}
            onChange={onChangePromqlQuery}
            value={promqlQuery}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default MetricsPickerItem;
