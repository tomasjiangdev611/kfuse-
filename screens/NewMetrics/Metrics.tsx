import { Datepicker } from 'composite';
import { CheckboxWithLabel, MetricsQueryBuilder } from 'components';
import { useDateState, useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { RefreshCw, X } from 'react-feather';
import { DateSelection, ExplorerQueryProps, FormulaProps } from 'types';
import { refreshDate } from 'utils';
import { getDateFromRange } from 'screens/Dashboard/utils';

import MetricsCharts from './MetricsCharts';
import MetricsChartsCombined from './MetricsChartsCombined';

const Metrics = ({
  close = undefined,
  defaultDate,
  defaultFormulas,
  defaultQueries,
  title = 'Metrics Explorer',
}: {
  close?: () => void;
  defaultDate?: DateSelection;
  defaultFormulas?: FormulaProps[];
  defaultQueries?: ExplorerQueryProps[];
  title?: string;
}): ReactElement => {
  const [isMultiChart, setIsMultiChart] = useState(false);
  const [date, setDate] = useDateState(getDateFromRange('now-1h', 'now'));

  const queryBuilderState = useMetricsQueryStateV2({ date });
  const {
    absoluteTimeRangeStorage,
    formulas,
    queries,
    queryData,
    setabsoluteTimeRangeStorage,
  } = queryBuilderState;

  const onDateChange = (nextDate: DateSelection) => {
    const { startTimeUnix, endTimeUnix, startLabel, endLabel } = nextDate;
    if (!startLabel && !endLabel) {
      setabsoluteTimeRangeStorage((preHistory) => {
        if (preHistory.length > 3) {
          preHistory.pop();
        }
        return [...[{ startTimeUnix, endTimeUnix }], ...preHistory];
      });
    }
    setDate(nextDate);
  };

  useEffect(() => {
    const {
      callSeriesQuery,
      callMultiplePromqlQueries,
      setFormulas,
      setQueries,
      setQueryData,
    } = queryBuilderState;

    if (defaultDate) {
      setDate(defaultDate);
    }

    if (defaultQueries) {
      setQueries(defaultQueries);
      defaultQueries.forEach((query, index) => {
        callSeriesQuery(index, query.metric);
      });
    }

    if (defaultFormulas) {
      setFormulas(defaultFormulas);
    }

    if (defaultFormulas || defaultQueries) {
      callMultiplePromqlQueries(defaultQueries, defaultFormulas);
      setIsMultiChart(false);
    }

    return () => {
      setQueries([]);
      setFormulas([]);
      setQueryData({});
    };
  }, []);

  return (
    <div className="new-metrics">
      <div className="new-metrics__header">
        <div className="new-metrics__header__title">{title}</div>
        <div className="new-metrics__header__date-picker">
          <Datepicker
            absoluteTimeRangeStorage={absoluteTimeRangeStorage}
            className="logs__search__datepicker"
            hasStartedLiveTail={false}
            onChange={onDateChange}
            startLiveTail={null}
            value={date}
          />
          <button
            className="new-metrics__header__refresh-button"
            onClick={() => refreshDate(date, setDate)}
          >
            <RefreshCw size={14} />
          </button>
          {close && (
            <button
              className="new-metrics__header__close-button"
              onClick={close}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <MetricsQueryBuilder metricsQueryState={queryBuilderState} />
      <div className="new-metrics__combine-query-checkbox">
        <CheckboxWithLabel
          label="Combine all queries into one chart"
          onChange={(checked) => setIsMultiChart(!checked)}
          value={!isMultiChart}
        />
      </div>
      {!isMultiChart && (
        <div className="">
          <MetricsChartsCombined
            date={date}
            formulas={formulas}
            queries={queries}
            queryData={queryData}
          />
        </div>
      )}
      {isMultiChart && (
        <div className="new-metrics__charts">
          {queries.map((_, index: number) => {
            const chartData = queryData[`query_${index}`] || {};
            return (
              <div className="new-metrics__charts__item" key={index}>
                <MetricsCharts
                  date={date}
                  isLoading={chartData.isLoading || false}
                  queryData={queryData}
                  queryItem={{ queries, queryIndex: index, type: 'query' }}
                />
              </div>
            );
          })}
          {formulas.map((_, index: number) => {
            const chartData = queryData[`formula_${index}`] || {};
            return (
              <div className="new-metrics__charts__item" key={index}>
                <MetricsCharts
                  date={date}
                  isLoading={chartData.isLoading || false}
                  queryData={queryData}
                  queryItem={{
                    formulas,
                    queries,
                    queryIndex: index,
                    type: 'formula',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Metrics;
