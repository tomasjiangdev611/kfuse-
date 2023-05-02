import { Loader } from 'components';
import React, { ReactElement, useMemo } from 'react';

import { DashboardPanelNoData } from '../components';
import { useDashboardDataLoader } from '../hooks';
import { DashboardPanelComponentProps } from '../types';
import {
  getPanelWidthHeight,
  getStatFontSize,
  statEvaluatedValue,
} from '../utils';

const DashboardPanelStat = ({
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  isInView,
  nestedIndex,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  const { templateValues } = dashboardTemplateState;

  const dashboardDataLoader = useDashboardDataLoader({
    baseWidth,
    dashboardState,
    isInView,
    nestedIndex,
    panelIndex,
    templateValues,
    type: 'stat',
  });
  const panelSize = useMemo(
    () => getPanelWidthHeight(panel.gridPos, baseWidth, panel.title),
    [panel, baseWidth],
  );

  const value = dashboardDataLoader.result?.[0]?.value[1];
  const renderStatValue = () => {
    const statEval = statEvaluatedValue({
      panel,
      result: dashboardDataLoader.result,
    });
    const {
      prefix,
      suffix,
      name,
      text,
      color: textColor,
      colorMode,
      textMode,
    } = statEval;

    const suffixLength = suffix?.length / 2 || 0;
    const prefixLength = prefix?.length / 2 || 0;

    const nameLength = ['name', 'value_and_name'].includes(textMode)
      ? name?.length / 2 || 0
      : 0;

    const textWithPrefixSuffix = `${prefix || ''}${text || ''}${suffix || ''}`;

    const cssColor =
      colorMode === 'value' ? { color: textColor } : { background: textColor };

    if (textMode === 'name') {
      const fontSize = getStatFontSize(nameLength, panelSize);
      return (
        <div
          className="dashboard__panel__stat-value"
          style={{ ...cssColor, ...{ fontSize } }}
        >
          {name}
        </div>
      );
    }

    if (textMode === 'value_and_name') {
      const fontSize = getStatFontSize(
        text.length + suffixLength + prefixLength + nameLength,
        panelSize,
      );
      return (
        <div
          className="dashboard__panel__stat-value__value-and-name"
          style={{ ...cssColor, ...{ fontSize } }}
        >
          <div>{name}</div>
          <div>{textWithPrefixSuffix}</div>
        </div>
      );
    }

    const fontSize = getStatFontSize(textWithPrefixSuffix.length, panelSize);
    return (
      <div
        className="dashboard__panel__stat-value"
        style={{ ...cssColor, ...{ fontSize } }}
      >
        {textWithPrefixSuffix}
      </div>
    );
  };

  return (
    <Loader
      isLoading={dashboardDataLoader.isLoading}
      sizes="small"
      style={{ height: panelSize.heightContainer }}
    >
      {value && renderStatValue()}
      {!dashboardDataLoader.isLoading && !value && (
        <DashboardPanelNoData gridPos={panel.gridPos} baseWidth={baseWidth} />
      )}
    </Loader>
  );
};

export default DashboardPanelStat;
