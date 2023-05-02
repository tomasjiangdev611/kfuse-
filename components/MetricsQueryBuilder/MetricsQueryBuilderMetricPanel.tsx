import { AutocompleteOption, Loader } from 'components';
import React, { ReactElement, useMemo, useState } from 'react';

const MetricsQueryBuilderMetricPanel = ({
  isLoading,
  labelValueList,
  metricsList,
  onClick,
  onHover,
  onTagClick,
  seriesList,
}: {
  isLoading: boolean;
  labelValueList: { [key: string]: { [key: string]: AutocompleteOption[] } };
  metricsList: AutocompleteOption[];
  onClick: (metricName: string) => void;
  onHover: (metricName: string) => void;
  onTagClick: (metricName: string, tagName: string) => void;
  seriesList: { [key: string]: AutocompleteOption[] };
}): ReactElement => {
  const [activeMetric, setActiveMetric] = useState('');

  const onHoverMetric = (metricName: string) => {
    setActiveMetric(metricName);
    onHover(metricName);
  };

  const metricSummary = useMemo(() => {
    if (activeMetric && labelValueList[activeMetric]) {
      const labelValues = labelValueList[activeMetric];
      return Object.keys(labelValues).map((key: string) => {
        return { key, count: labelValues[key].length };
      });
    }
    return [];
  }, [activeMetric, labelValueList]);

  return (
    <Loader isLoading={isLoading}>
      <div className="metrics__query-builder__metric__panel">
        <div className="metrics__query-builder__metric__panel__list overflow-y-scroll">
          {metricsList.map((metric) => {
            return (
              <div
                className="metrics__query-builder__metric__panel__list__item"
                key={metric.value}
                style={{ paddingTop: 8, paddingBottom: 8 }}
                onMouseDown={() => onClick(metric.value)}
                onMouseEnter={() => onHoverMetric(metric.value)}
              >
                {metric.label}
              </div>
            );
          })}
        </div>
        <div className="metrics__query-builder__metric__panel__tags overflow-y-scroll">
          {activeMetric && (
            <Loader isLoading={seriesList[activeMetric] === undefined}>
              {metricSummary.map(({ key, count }) => {
                return (
                  <div
                    className="chip metrics__query-builder__metric__panel__tags__item"
                    key={key}
                    onMouseDown={() => onTagClick(activeMetric, key)}
                  >
                    {key} ({count})
                  </div>
                );
              })}
            </Loader>
          )}
        </div>
      </div>
    </Loader>
  );
};

export default MetricsQueryBuilderMetricPanel;
