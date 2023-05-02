import { useToastmasterContext } from 'components/Toasts';
import React, { ReactElement } from 'react';
import { Clipboard } from 'react-feather';
import { getMetricsExplorerUrl } from 'utils';

import useMetricsSummary from './useMetricsSummary';

const MetricsSummaryMetadata = ({
  metricSummaryState,
}: {
  metricSummaryState: ReturnType<typeof useMetricsSummary>;
}): ReactElement => {
  const { addToast } = useToastmasterContext();
  const { selectedMetric, metricSeries } = metricSummaryState;

  const onOpenInExplorer = () => {
    if (selectedMetric) {
      const queryUrl = getMetricsExplorerUrl(selectedMetric.name, '');
      window.open(queryUrl, '_blank');
    }
  };

  const hostCount = metricSeries?.data['host']?.length || 0;
  const tagValuesCount = metricSeries?.metricKeys
    .map((key) => metricSeries.data[key].length)
    .reduce((a, b) => a + b, 0);

  const { help, name, unit, type } = selectedMetric || {};
  return (
    <div className="metrics-summary__body__details__metadata">
      {selectedMetric && (
        <>
          <div className="metrics-summary__body__details__metadata__explorer">
            <div className="metrics-summary__body__subtitle">
              {name}{' '}
              <Clipboard
                className="metrics-summary__body__details__metadata__explorer__copy-icon "
                onClick={() => {
                  addToast({ status: 'success', text: 'Copied to clipboard' });
                  navigator.clipboard.writeText(name);
                }}
                size={16}
              />
            </div>
            <button className="button button--blue" onClick={onOpenInExplorer}>
              Open in Metrics Explorer
            </button>
          </div>
          <div className="metrics-summary__body__details__metadata__tags">
            <div className="metrics-summary__body__details__metadata__tags__item">
              <div>HOST</div>
              <div>{hostCount}</div>
            </div>
            <div className="metrics-summary__body__details__metadata__tags__item">
              <div>TAG VALUES</div>
              <div>{tagValuesCount || 0}</div>
            </div>
          </div>
          <div className="metrics-summary__body__details__metadata__metadata">
            <div className="metrics-summary__body__subtitle">Metadata</div>
            {type && (
              <div>
                Metric Type: <span className="chip">{type}</span>
              </div>
            )}
            {unit && (
              <div>
                Unit: <span className="chip">{unit}</span>
              </div>
            )}
            {help && <div>Description: {help}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default MetricsSummaryMetadata;
