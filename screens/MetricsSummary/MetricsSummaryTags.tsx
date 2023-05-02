import { Input } from 'components';
import React, { ReactElement, useMemo } from 'react';

import MetricsSummaryMetricDetailsTagValues from './MetricsSummaryTagsValues';
import useMetricsSummary from './useMetricsSummary';

const columns = [
  { label: 'Tag Key', key: 'tag' },
  { label: 'Count', key: 'count' },
  { label: 'Tag Values', key: 'values' },
];

const MetricsSummaryTags = ({
  metricSummaryState,
}: {
  metricSummaryState: ReturnType<typeof useMetricsSummary>;
}): ReactElement => {
  const { metricSeries, selectedMetric, setTagSearch, tagSearch } =
    metricSummaryState;

  const filteredTags = useMemo(() => {
    if (!metricSeries) return { data: {}, metricKeys: [] };
    const typedLowered = tagSearch.toLowerCase().trim();
    if (typedLowered) {
      const filteredKeys = metricSeries.metricKeys.filter(
        (key) => key.toLowerCase().indexOf(typedLowered) > -1,
      );
      return { metricKeys: filteredKeys, data: metricSeries.data };
    }

    return metricSeries;
  }, [tagSearch, metricSeries, selectedMetric]);

  return (
    <>
      <div className="metrics-summary__body__details__tags">
        <div className="metrics-summary__body__subtitle">Tags</div>
        <div>
          <Input
            placeholder="Search tags"
            onChange={(e) => setTagSearch(e)}
            value={tagSearch}
            type="text"
            className="metrics-summary__body__details__tags__search-bar"
          />
        </div>
        <div className="metrics-summary__body__details__tags__table">
          <div className="metrics-summary__body__details__tags__table__row">
            {columns.map((column) => (
              <div
                className="metrics-summary__body__details__tags__table__cell"
                key={column.key}
                style={column.key === 'count' ? { width: 50 } : {}}
              >
                {column.label}
              </div>
            ))}
          </div>
          {filteredTags &&
            filteredTags.metricKeys.map((key: string) => {
              return (
                <div
                  key={key}
                  className="metrics-summary__body__details__tags__table__row"
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="metrics-summary__body__details__tags__table__cell"
                    >
                      {column.key === 'tag' && key}
                      {column.key === 'count' && metricSeries.data[key].length}
                      {column.key === 'values' && (
                        <MetricsSummaryMetricDetailsTagValues
                          metricName={selectedMetric.name}
                          tagName={key}
                          values={metricSeries.data[key]}
                        />
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default MetricsSummaryTags;
