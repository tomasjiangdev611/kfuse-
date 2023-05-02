import classNames from 'classnames';
import { ChartRenderer, Loader, SizeObserver } from 'components';
import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { RefreshCw } from 'react-feather';
import { BiLinkExternal } from 'react-icons/bi';
import { promqlQueryRange } from 'requests';
import { formatChartLegend, parsePromqlAndBuildQuery } from 'utils';
import { SLOProps } from 'types/SLO';

import {
  getSLOHistoricalPromql,
  getSLOHistoricalPromqlQueries,
} from '../utils';

const SLODetailsHistoryChart = ({
  sloData,
}: {
  sloData: SLOProps;
}): ReactElement => {
  const [isHostoricalData, setIsHistoricalData] = useState(false);
  const promqlQueryRangeRequest = useRequest(promqlQueryRange);

  const getSLOHistoryPromql = () => {
    let numePromql = '';
    let denoPromql = '';
    if (isHostoricalData) {
      const promql = getSLOHistoricalPromql(
        sloData.errorExpr,
        sloData.totalExpr,
      );
      numePromql = promql[0];
      denoPromql = promql[1];
    } else {
      numePromql = `slo:sli_error_count1d{sloth_id="${sloData.name}"} * ${
        60 * 60 * 24
      }`;
      denoPromql = `(slo:sli_total_count1d{sloth_id="${
        sloData.name
      }"} - slo:sli_error_count1d{sloth_id="${sloData.name}"}) * ${
        60 * 60 * 24
      }`;
    }

    return [numePromql, denoPromql];
  };

  const loadSLOHistory = async () => {
    const legendFormat = ['Bad', 'Good'];
    const oneDay = 24 * 60 * 60;
    const dayUnix = dayjs().unix();
    const last30Days = oneDay * 30;
    promqlQueryRangeRequest.call({
      date: { startTimeUnix: dayUnix - last30Days, endTimeUnix: dayUnix },
      metricNames: legendFormat,
      promqlQueries: getSLOHistoryPromql(),
      seriesFormatter: (idx: number, promIndex: number, metric: any) => {
        const series = formatChartLegend(idx, metric, legendFormat[promIndex]);
        if (promIndex === 1) {
          return { ...series, stroke: '#14a000' };
        }
        return { ...series, stroke: '#9e0142' };
      },
      steps: [oneDay, oneDay],
      type: 'timeseries',
    });
  };

  const getExplorerLinkForHistorical = () => {
    const { queries, formulas } = getSLOHistoricalPromqlQueries(
      sloData.errorExpr,
      sloData.totalExpr,
    );

    const queryURI = decodeURIComponent(JSON.stringify(queries));
    const formulaURI = decodeURIComponent(JSON.stringify(formulas));
    return `#/metrics?metricsQueries=${queryURI}&metricsFormulas=${formulaURI}`;
  };

  const getExplorerLinkForSLO = () => {
    const numePromql = `slo:sli_error_count1d{sloth_id="${sloData.name}"}`;
    const denoPromql = `slo:sli_total_count1d{sloth_id="${sloData.name}"}`;
    const { queries } = parsePromqlAndBuildQuery([numePromql, denoPromql]);

    const queryURI = decodeURIComponent(JSON.stringify(queries));
    return `#/metrics?metricsQueries=${queryURI}`;
  };

  useEffect(() => {
    loadSLOHistory();
  }, [sloData, isHostoricalData]);

  return (
    <div className="slo__details__history-chart">
      <div className="slo__details__history-chart__toolbar">
        <a
          className="button slo__details__history-chart__explore-button"
          href={
            isHostoricalData
              ? getExplorerLinkForHistorical()
              : getExplorerLinkForSLO()
          }
          target="_blank"
          rel="noreferrer"
        >
          <BiLinkExternal /> Open in Metrics Explorer
        </a>
        <button
          className={classNames({
            button: true,
            'button--blue': isHostoricalData,
          })}
          onClick={() => setIsHistoricalData(!isHostoricalData)}
        >
          Historical Data
        </button>
        <button
          className="new-metrics__header__refresh-button"
          onClick={() => loadSLOHistory()}
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <Loader isLoading={promqlQueryRangeRequest.isLoading}>
        {!promqlQueryRangeRequest.isLoading &&
          promqlQueryRangeRequest.result &&
          promqlQueryRangeRequest.result.series.length === 0 && (
            <div className="slo__details__history-chart__no-data">
              Newly required SLOs will take some time to generate data. Please
              check back later, or flip to the historical view to see historical
              data.
            </div>
          )}
        <SizeObserver>
          {({ width }) => (
            <ChartRenderer
              date={null}
              chartData={
                promqlQueryRangeRequest.result || { data: [], series: [] }
              }
              chartTypes={['Stacked Bar']}
              legend={{ legendType: 'compact' }}
              tooltipType="compact"
              size={{ width: width - 16, height: 160 }}
              styles={{ boxShadow: false }}
              unit="number"
            />
          )}
        </SizeObserver>
      </Loader>
    </div>
  );
};

export default SLODetailsHistoryChart;
