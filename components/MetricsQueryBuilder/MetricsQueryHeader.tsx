import { Input } from 'components';
import { useMetricsQueryState } from 'hooks';
import React, { ReactElement } from 'react';
import { Edit2 } from 'react-feather';

const MetricsQueryHeader = ({
  chartIndex,
  isTitleEditing,
  metricsQueryState,
  title,
}: {
  chartIndex: number;
  isTitleEditing: boolean;
  metricsQueryState: ReturnType<typeof useMetricsQueryState>;
  title: string;
}): ReactElement => {
  const { removeChart, updateChart } = metricsQueryState;
  return (
    <div className="metrics__query-builder__chart-header">
      <div className="metrics__query-builder__chart-header__title">
        {isTitleEditing ? (
          <Input
            type="text"
            value={title}
            onChange={(e) => updateChart(chartIndex, 'title', e)}
            placeholder="Enter chart name"
            onBlur={() => updateChart(chartIndex, 'isTitleEditing', false)}
          />
        ) : (
          <div className="metrics__query-builder__chart-header__title__input">
            {title}
          </div>
        )}
        <div
          className="metrics__query-builder__chart-header__title__icon"
          onClick={() =>
            updateChart(chartIndex, 'isTitleEditing', !isTitleEditing)
          }
        >
          <Edit2 size={15} />
        </div>
      </div>
      <button
        className="button button--red"
        onClick={() => removeChart(chartIndex)}
      >
        Remove
      </button>
    </div>
  );
};

export default MetricsQueryHeader;
