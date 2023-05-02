import {
  CheckboxWithLabel,
  PopoverPosition,
  PopoverTriggerV2,
  Select,
  TooltipTrigger,
  useModalsContext,
} from 'components';
import React from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import Metrics from 'screens/NewMetrics';
import ChartGridItemHeaderTopK from './ChartGridItemHeaderTopK';
import { Compare } from './types';

const compareOptions = (compare: Compare) => [
  { label: `${compare ? 'Remove Compare' : 'Compare'}`, value: null },
  ...Object.values(Compare).map((compare) => ({
    label: `1 ${compare} before`,
    value: compare,
  })),
];

const ChartGridItemHeader = ({
  chart,
  chartGridItem,
  chartGridItemData,
  date,
  form,
  width,
}) => {
  const { charts, initialKey } = chartGridItem;

  const modal = useModalsContext();
  const { propsByKey, values } = form;

  const chartOptions = charts.map((chart) => ({
    label: chart.label,
    value: chart.key,
  }));

  const onExploreClick = async (width: number) => {
    const chartQuery = await chart.query({
      chart,
      date,
      width,
      parsedPromql: true,
    });

    const { formulas, queries, stepInMs, labels } = chartQuery;

    queries.forEach((query, idx: number) => {
      query.legendFormat = (labels && labels[idx]) || undefined;
      query.steps = stepInMs / 1000;
    });

    modal.push(
      <div className="chart-grid__item__explorer-modal">
        <Metrics
          close={modal.pop}
          defaultDate={date}
          defaultFormulas={formulas}
          defaultQueries={queries}
          title="Explore"
        />
      </div>,
    );
  };

  return (
    <div className="chart-grid__item__header">
      <div className="chart-grid__item__header__left">
        {chartOptions.length > 1 ? (
          <Select
            className="select--thin"
            {...propsByKey('key')}
            options={chartOptions}
          />
        ) : (
          <div className="chart-grid__item__header__left__placeholder">
            {chart?.label}
          </div>
        )}
      </div>
      <div className="chart-grid__item__header__right">
        {chart?.disabledCompare ? null : (
          <Select
            className="select--thin select--naked"
            options={compareOptions(values.compare)}
            placeholder="Compare"
            {...propsByKey('compare')}
          />
        )}
        {chart?.disableExplore ? null : (
          <TooltipTrigger tooltip="Explore Metric">
            <div
              className="chart-grid__item__header__right__explorer"
              onClick={() => onExploreClick(width)}
            >
              <BsArrowsFullscreen size={12} />
            </div>
          </TooltipTrigger>
        )}
        {chart.additionalButtons ? (
          <>
            {chart.additionalButtons.map((button) => (
              <TooltipTrigger tooltip={button.tooltip}>
                <div
                  className="chart-grid__item__header__right__explorer"
                  onClick={button.onClick}
                >
                  {button.icon}
                </div>
              </TooltipTrigger>
            ))}
          </>
        ) : null}
        <PopoverTriggerV2
          className="chart-grid__item__header__right__settings"
          popover={() => (
            <div>
              {chart?.disableLogScale ? null : (
                <>
                  <CheckboxWithLabel
                    label="Show Log Scale"
                    {...(propsByKey('isLogScaleEnabled') as {
                      onChange: (value: any) => void;
                      value: boolean;
                    })}
                  />
                </>
              )}
              <ChartGridItemHeaderTopK
                chartGridItemData={chartGridItemData}
                form={form}
              />
            </div>
          )}
          position={PopoverPosition.BOTTOM_RIGHT}
        >
          <IoSettingsOutline size={16} />
        </PopoverTriggerV2>
      </div>
    </div>
  );
};

export default ChartGridItemHeader;
