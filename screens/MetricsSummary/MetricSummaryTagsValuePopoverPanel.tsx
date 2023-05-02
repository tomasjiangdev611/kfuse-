import { useToastmasterContext } from 'components';
import React, { ReactElement } from 'react';
import { getMetricsExplorerUrl } from 'utils/MetricsQueryBuilder';

const MetricSummaryTagsValuePopoverPanel = ({
  metricName,
  tagValue,
}: {
  metricName: string;
  tagValue: string;
}): ReactElement => {
  const { addToast } = useToastmasterContext();
  const onOpenInExplorer = () => {
    if (metricName) {
      const queryUrl = getMetricsExplorerUrl(metricName, tagValue);
      window.open(queryUrl, '_blank');
    }
  };

  return (
    <div className="metrics-summary__attribute__panel">
      <div
        className="metrics-summary__attribute__panel__item"
        onClick={onOpenInExplorer}
      >
        Open in Metrics Explorer
      </div>
      <div
        className="metrics-summary__attribute__panel__item"
        onClick={() => {
          addToast({ status: 'success', text: 'Copied to clipboard' });
          navigator.clipboard.writeText(tagValue.split(':')[1]);
        }}
      >
        Copy value to Clipboard
      </div>
    </div>
  );
};

export default MetricSummaryTagsValuePopoverPanel;
