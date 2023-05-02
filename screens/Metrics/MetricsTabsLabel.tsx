import React from 'react';
import { X } from 'react-feather';

type Props = {
  index: number;
  metricTab: {
    entityType: string;
    metric: string;
  };
  removeMetricTab: (index: number) => void;
};

const MetricsTabsLabel = ({ index, metricTab, removeMetricTab }: Props) => {
  const { entityType, metric } = metricTab;
  const label = metric.split('.').slice(1).join(' ').replace(/_/g, ' ');

  const onClick = (e) => {
    e.stopPropagation();
    removeMetricTab(index);
  };

  return (
    <div className="metrics__tabs__label">
      <div className="metrics__tabs__label__circle" />
      <div className="metrics__tabs__label__text">
        <div className="metrics__tabs__label__entity-type">{entityType}</div>
        <div className="metrics__tabs__label__metric">{label}</div>
      </div>
      <button className="metrics__tabs__label__close" onClick={onClick}>
        <X className="metrics__tabs__label__close__x" size={12} />
      </button>
    </div>
  );
};

export default MetricsTabsLabel;
