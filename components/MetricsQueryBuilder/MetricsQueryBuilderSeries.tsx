import { TooltipTrigger } from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement } from 'react';
import { Plus } from 'react-feather';

import MetricsQueryBuilderSeriesBuilder from './MetricsQueryBuilderSeriesBuilder';

const MetricsQueryBuilderSeries = ({
  metricName,
  queryIndex,
  metricsQueryState,
  series,
}: {
  metricName: string;
  queryIndex: number;
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
  series: string[];
}): ReactElement => {
  const { labelValueList, seriesList, updateQuery, updateSeries } =
    metricsQueryState;

  const handleLabelChange = (labelIndex: number, newLabel: string) => {
    updateSeries(queryIndex, labelIndex, newLabel);
  };

  const handleValueChange = (labelIndex: number, newValue: string) => {
    const labelKey = series[labelIndex];
    const newLabelKey = labelKey.replace(
      /".*"/,
      `"${newValue.replace(/"/g, '')}"`,
    );
    updateSeries(queryIndex, labelIndex, newLabelKey);
  };

  const handleOperatorChange = (
    labelIndex: number,
    newOperator: string,
    operator: string,
  ) => {
    const labelKey = series[labelIndex];
    let newLabelKey = labelKey.replace(operator, newOperator);

    if (newOperator === '=' || newOperator === '!=') {
      newLabelKey = newLabelKey.replace(/".*"/, '""');
    }

    updateSeries(queryIndex, labelIndex, newLabelKey);
  };

  const addNewLabel = () => {
    const newSeries = [...series];
    newSeries.push('=""');
    updateQuery(queryIndex, 'series', newSeries);
  };

  const removeLabel = (labelIndex: number) => {
    const newSeries = [...series];
    newSeries.splice(labelIndex, 1);
    updateQuery(queryIndex, 'series', newSeries);
  };

  return (
    <div className="metrics__query-builder__series">
      {series.map((item, idx) => {
        return (
          <MetricsQueryBuilderSeriesBuilder
            key={idx}
            labelIndex={idx}
            labelKey={item}
            labelList={seriesList[metricName] || []}
            labelValueList={labelValueList[metricName] || {}}
            onLabelChange={handleLabelChange}
            onOperatorChange={handleOperatorChange}
            onValueChange={handleValueChange}
            removeLabel={removeLabel}
          />
        );
      })}
      <TooltipTrigger tooltip="Add Label">
        <div
          className="metrics__query-builder__series__add-button"
          onClick={addNewLabel}
        >
          <Plus />
        </div>
      </TooltipTrigger>
    </div>
  );
};

export default MetricsQueryBuilderSeries;
