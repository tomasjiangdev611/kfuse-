import React, { useEffect, useState } from 'react';
import { useTabs } from 'components';
import { useForm, useRequest } from 'hooks';
import { searchMetrics } from 'requests';
import MetricsHeader from './MetricsHeader';
import MetricsTabs from './MetricsTabs';
import useMetricsDatasetsRequests from './useMetricsDatasetsRequests';

const Metrics = () => {
  const metricsRequests = useMetricsDatasetsRequests();
  const searchMetricsRequest = useRequest(searchMetrics);
  const tabs = useTabs();

  const form = useForm(
    {
      entityType: 'KafkaBroker',
      metric: '',
      secondsFromNow: 60 * 5,
    },
    {
      onChange: ({ key, value }) => {
        if (key === 'entityType') {
          searchMetricsRequest.call(value);
        }
      },
      preChange: ({ key, values }) => {
        if (key === 'entityType') {
          return { ...values, metric: '' };
        }

        return values;
      },
    },
  );
  const [metricsTabs, setMetricsTabs] = useState([]);

  const addMetricTab = ({ entityType, metric }) => {
    setMetricsTabs((prevMetricsTab) => {
      const metricTab = {
        entityType,
        metric,
      };

      const nextMetricsTabs = [...prevMetricsTab, metricTab];
      form.onChange('metric', '');
      tabs.setActiveIndex(nextMetricsTabs.length - 1);
      return nextMetricsTabs;
    });
  };

  const removeMetricTab = (index) => {
    setMetricsTabs((prevMetricsTab) => {
      const nextMetricsTabs = [...prevMetricsTab];
      nextMetricsTabs.splice(index, 1);
      tabs.setActiveIndex(nextMetricsTabs.length - 1);
      return nextMetricsTabs;
    });
  };

  useEffect(() => {
    searchMetricsRequest.call(form.values.entityType);
  }, []);

  return (
    <div className="metrics">
      <MetricsHeader
        addMetricTab={addMetricTab}
        form={form}
        searchMetricsRequest={searchMetricsRequest}
      />
      <MetricsTabs
        metricsTabs={metricsTabs}
        metricsRequests={metricsRequests}
        removeMetricTab={removeMetricTab}
        secondsFromNow={form.values.secondsFromNow}
        tabs={tabs}
      />
    </div>
  );
};

export default Metrics;
