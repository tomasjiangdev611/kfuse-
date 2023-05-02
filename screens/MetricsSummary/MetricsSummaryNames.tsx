import classNames from 'classnames';
import { Input, MultiselectV2 } from 'components';
import React, { ReactElement, useMemo } from 'react';

import useMetricsSummary from './useMetricsSummary';
import { filterMetricSummaryList } from './utils';

const MetricsSummaryNames = ({
  metricSummaryState,
}: {
  metricSummaryState: ReturnType<typeof useMetricsSummary>;
}): ReactElement => {
  const {
    filterOptions,
    metricSearch,
    metricsList,
    selectedMetric,
    setMetricSearch,
    setSelectedMetric,
  } = metricSummaryState;
  const filteredMetrics = useMemo(() => {
    const { search, origin, type } = metricSearch;
    if (search || origin.length || type.length) {
      return metricsList.filter((metric) =>
        filterMetricSummaryList(metric, metricSearch),
      );
    }
    return metricsList;
  }, [metricsList, metricSearch]);

  return (
    <div className="metrics-summary__body__metrics-names">
      <div className="metrics-summary__body__title">METRICS NAME</div>
      <div className="metrics-summary__body__metrics-names__filter">
        <MultiselectV2
          onChange={(vals: string[]) =>
            setMetricSearch((prev) => ({ ...prev, type: vals }))
          }
          options={filterOptions.type}
          placeholder="Select metric type"
          value={metricSearch.type}
        />
        <MultiselectV2
          onChange={(vals: string[]) =>
            setMetricSearch((prev) => ({ ...prev, origin: vals }))
          }
          options={filterOptions.origin}
          placeholder="Select origin"
          value={metricSearch.origin}
        />
      </div>
      <Input
        className="metrics-summary__body__metrics-names__search-bar"
        onChange={(e) => setMetricSearch((prev) => ({ ...prev, search: e }))}
        placeholder="Search metrics name"
        value={metricSearch.search}
        type="text"
      />
      <div className="metrics-summary__body__metrics-names__result">
        {filteredMetrics.map((metric) => {
          return (
            <div
              key={metric.name}
              className={classNames({
                'metrics-summary__body__metrics-names__result__item': true,
                'metrics-summary__body__metrics-names__result__item--selected':
                  selectedMetric?.name === metric.name,
              })}
              onClick={() => setSelectedMetric(metric)}
            >
              {metric.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsSummaryNames;
