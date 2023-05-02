import React from 'react';
import MetricsTabsChart from './MetricsTabsChart';
import { Tabs, Tab } from 'components';
import MetricsTabsLabel from './MetricsTabsLabel';

const MetricsTabs = ({
  metricsRequests,
  metricsTabs,
  removeMetricTab,
  secondsFromNow,
  tabs,
}) => {
  if (metricsTabs.length === 0) {
    return null;
  }

  return (
    <div className="metrics__tabs">
      <Tabs tabs={tabs}>
        {metricsTabs.map((metricTab, i) => (
          <Tab
            key={i}
            label={
              <MetricsTabsLabel
                index={i}
                metricTab={metricTab}
                removeMetricTab={removeMetricTab}
              />
            }
          >
            <MetricsTabsChart
              entityType={metricTab.entityType}
              metric={metricTab.metric}
              metricsRequests={metricsRequests}
              secondsFromNow={secondsFromNow}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default MetricsTabs;
