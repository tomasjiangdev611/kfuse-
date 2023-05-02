import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { ChartType } from './types';
import { chartTypesPredefined } from './utils';

const ChartRendererType = ({
  chartType,
  chartTypes,
  onChartTypeChange,
}: {
  chartType: ChartType;
  chartTypes?: ChartType[];
  onChartTypeChange: (chartType: ChartType) => void;
}): ReactElement => {
  if (chartTypes && chartTypes.length <= 1) {
    return null;
  }

  const chartTypesNew = chartTypes ? chartTypes : chartTypesPredefined;
  return (
    <div className="uplot__chart-renderer__chart-type">
      {chartTypesNew.map((type: ChartType) => {
        return (
          <button
            key={type}
            className={classNames({
              'uplot__chart-renderer__chart-type__item': true,
              'uplot__chart-renderer__chart-type__item--active':
                chartType === type,
            })}
            onClick={() => onChartTypeChange(type)}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
};

export default ChartRendererType;
