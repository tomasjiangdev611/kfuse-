import { useRequest } from 'hooks';
import { useEffect } from 'react';
import {
  getLogMetricsTimeSeriesLogQL,
  promqlQuery,
  promqlQueryRange,
} from 'requests';
import { RequestResult } from 'types';

import useDashboardState from './useDashboardState';
import { DashboardTemplateValueProps } from '../types';

import {
  formatDashboardLegend,
  getActivePromqlQuery,
  getPanelWidthHeight,
  replaceLogQLVariables,
  transformPromql,
  transformFormulaExpression,
} from '../utils';

const useDashboardDataLoader = ({
  baseWidth,
  dashboardState,
  isInView,
  nestedIndex,
  panelIndex,
  templateValues,
  type,
}: {
  baseWidth?: number;
  dashboardState: ReturnType<typeof useDashboardState>;
  isInView?: boolean;
  nestedIndex: string;
  panelIndex: number;
  templateValues: DashboardTemplateValueProps;
  type: string;
}): RequestResult => {
  const promqlQueryRequest = useRequest(promqlQuery);
  const promqlQueryRangeRequest = useRequest(promqlQueryRange);
  const getLogMetricsTimeSeriesLogQLRequest = useRequest(
    getLogMetricsTimeSeriesLogQL,
  );
  const { date, panels, reloadPanels, setReloadPanels } = dashboardState;
  const nestedIndexNum = Number(nestedIndex);
  let panel = panels[panelIndex];
  let panelKey = `${panelIndex}`;

  if (
    nestedIndex !== undefined &&
    nestedIndex !== null &&
    nestedIndexNum >= 0
  ) {
    panel = panels[nestedIndexNum].panels[panelIndex];
    panelKey = `${nestedIndexNum}-${panelIndex}`;
  }

  if (!panel) return {};

  const { datasource, targets } = panel;
  const isLoki = datasource && datasource.type === 'loki';

  const loadData = () => {
    const { width: panelWidth } = getPanelWidthHeight(panel.gridPos, baseWidth);
    if (isLoki) {
      getLogMetricsTimeSeriesLogQLRequest.call({
        date,
        logQL: replaceLogQLVariables(targets[0].expr, templateValues),
        width: panelWidth,
      });
    }

    if (type === 'timeseries' && !isLoki) {
      const promqlQueries = getActivePromqlQuery(panel.targets).map(
        (target) => {
          const prop = { date, templateValues, width: panelWidth };
          if (target.expression) {
            return transformFormulaExpression({
              ...prop,
              expression: target.expression,
              targets,
            });
          }

          return transformPromql({ ...prop, promql: target.expr });
        },
      );
      promqlQueryRangeRequest.call({
        date,
        metricNames: [],
        promqlQueries,
        seriesFormatter: (idx: number, promIndex: number, metric: any) =>
          formatDashboardLegend(idx, promIndex, metric, targets),
        type: 'timeseries',
      });
    }

    if (
      type === 'stat' ||
      type === 'piechart' ||
      type === 'table' ||
      type === 'unflattened'
    ) {
      const promqlQueries = getActivePromqlQuery(panel.targets).map((target) =>
        transformPromql({
          date,
          promql: target.expr,
          templateValues,
          width: baseWidth,
        }),
      );
      promqlQueryRequest
        .call({
          promqlQueries,
          responseFormat: type === 'stat' ? undefined : type,
        })
        .catch(() => {});
    }
  };

  const isDataLoaded = () => {
    if (isLoki) {
      return Boolean(getLogMetricsTimeSeriesLogQLRequest.result);
    }

    if (type === 'timeseries' && !isLoki) {
      return Boolean(promqlQueryRangeRequest.result);
    }

    if (type === 'stat' || type === 'piechart' || type === 'table') {
      return Boolean(promqlQueryRequest.result);
    }

    if (type === 'unflattened') {
      return Boolean(promqlQueryRequest.result);
    }

    return false;
  };

  useEffect(() => {
    if (isDataLoaded()) {
      setReloadPanels((prevReloadPanels) => ({
        ...prevReloadPanels,
        [panelKey]: false,
      }));
    }
  }, [
    getLogMetricsTimeSeriesLogQLRequest.result,
    promqlQueryRangeRequest.result,
    promqlQueryRequest.result,
  ]);

  useEffect(() => {
    if (reloadPanels[panelKey] && isInView) {
      loadData();
    }
  }, [isInView, panel.targets, templateValues]);

  if (isLoki) {
    return getLogMetricsTimeSeriesLogQLRequest;
  }

  if (type === 'timeseries') {
    return promqlQueryRangeRequest;
  }

  if (type === 'stat' || type === 'piechart' || type === 'table') {
    return promqlQueryRequest;
  }

  if (type === 'unflattened') {
    return promqlQueryRequest;
  }
};

export default useDashboardDataLoader;
