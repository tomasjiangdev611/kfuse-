import { usePopoverContext } from 'components';
import React, { ReactElement, useRef } from 'react';
import { GoKebabVertical } from 'react-icons/go';
import { TooltipTrigger } from '..';
import { Select } from '../SelectV2';

import ChartRendererType from './ChartRendererType';
import { ToolbarMenuItem, ChartToolbarPropsComponent } from './types';
import { chartTypesPredefined, strokeTypesPredefined } from './utils';

const ToolbarMenuPanel = ({
  close,
  toolbarMenuItems,
}: {
  close: () => void;
  toolbarMenuItems: ToolbarMenuItem[];
}): ReactElement => {
  return (
    <div className="uplot__toolbar__menu__panel__container">
      {toolbarMenuItems.map((item) => {
        return (
          <div
            key={item.label}
            onClick={() => {
              close();
              item.onClick();
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

const ChartRendererToolbar = ({
  activeChart,
  activeStroke,
  chartTypes,
  setActiveChart,
  setActiveStroke,
  toolbar: {
    leftToolbar,
    rightToolbar,
    toolbarMenuItems,
    toolbarMenuType = 'button',
  },
}: ChartToolbarPropsComponent): ReactElement => {
  const popover = usePopoverContext();
  const menuRef = useRef<HTMLDivElement>(null);

  const onMenuClick = () => {
    popover.open({
      component: ToolbarMenuPanel,
      element: menuRef.current,
      props: {
        close: popover.close,
        toolbarMenuItems,
      },
      popoverPanelClassName: 'uplot__toolbar__menu__panel',
      right: true,
      width: 120,
    });
  };

  const chartTypesNew = chartTypes ? chartTypes : chartTypesPredefined;
  return (
    <div className="uplot__chart-renderer__toolbar">
      <div className="uplot__chart-renderer__toolbar__left">
        {leftToolbar && leftToolbar}
      </div>
      <div className="uplot__chart-renderer__toolbar__right">
        {activeStroke && (
          <Select
            className="uplot__chart-renderer__toolbar__select"
            options={strokeTypesPredefined.map((type: string) => ({
              label: type,
              value: type,
            }))}
            onChange={(type) => setActiveStroke(type)}
            value={activeStroke}
          />
        )}
        {toolbarMenuType === 'button' && (
          <ChartRendererType
            chartType={activeChart}
            chartTypes={chartTypes}
            onChartTypeChange={(type) => setActiveChart(type)}
          />
        )}
        {toolbarMenuType === 'dropdown' && (
          <Select
            className="uplot__chart-renderer__toolbar__select"
            options={chartTypesNew.map((type: any) => ({
              label: type,
              value: type,
            }))}
            onChange={(type) => setActiveChart(type)}
            value={activeChart}
          />
        )}
        {toolbarMenuItems && toolbarMenuItems.length && (
          <TooltipTrigger tooltip="Menu">
            <div
              className="uplot__chart-renderer__toolbar__menu"
              onClick={onMenuClick}
              ref={menuRef}
            >
              <GoKebabVertical />
            </div>
          </TooltipTrigger>
        )}
        {rightToolbar && rightToolbar}
      </div>
    </div>
  );
};

export default ChartRendererToolbar;
