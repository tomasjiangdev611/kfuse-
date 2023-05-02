import {
  AutocompleteV2,
  AutocompleteOption,
  Input,
  MultiselectV2,
} from 'components';
import { delimiter } from 'constants';
import { useLogsMetricsQueryBuilderState } from 'hooks';
import React, { ReactElement, useMemo } from 'react';
import { XCircle } from 'react-feather';
import {
  LogsMetricQueryProps,
  RangeAggregatesWithParams,
  RangeAggregatesWithoutGrouping,
  VectorAggregatesWithParams,
} from 'types';

import {
  getLabelAndFacetGroupingOptions,
  getRangeAggregateOptions,
  getVectorAggregateOptions,
  normalizeFunctionOptions,
} from 'utils/MetricsLogsQueryBuilder';

const LogsMetricsQueryBuilderQuery = ({
  allowMultipleQueries,
  enableVectorAggregates,
  facetNamesOptions,
  logsMetricsQueryBuilderState,
  queryIndex,
  query,
  queries,
}: {
  allowMultipleQueries?: boolean;
  enableVectorAggregates?: boolean;
  facetNamesOptions: AutocompleteOption[];
  logsMetricsQueryBuilderState: ReturnType<
    typeof useLogsMetricsQueryBuilderState
  >;
  queryIndex: number;
  query: LogsMetricQueryProps;
  queries: LogsMetricQueryProps[];
}): ReactElement => {
  const { removeQuery, updateQuery } = logsMetricsQueryBuilderState;

  const { metric } = query;
  const source = metric ? metric.split(delimiter)[0] : null;
  const groupingOptions = useMemo(
    () => getLabelAndFacetGroupingOptions(facetNamesOptions, source),
    [facetNamesOptions, source],
  );

  const normalizeFunctionOptionsFilter = useMemo(() => {
    if (metric === '*') {
      return normalizeFunctionOptions.filter(
        (option) => option.value !== 'bytes' && option.value !== 'duration',
      );
    }
    return normalizeFunctionOptions;
  }, [metric]);

  return (
    <div className="query-builder__logs__container">
      <div className="query-builder__logs__item">
        <div className="query-builder__logs__item__input">
          {allowMultipleQueries && (
            <div className="query-builder__logs__item__query-key">
              {query.queryKey}
            </div>
          )}
          <AutocompleteV2
            className="autocomplete__fixed-height-30"
            onChange={(val) => updateQuery(queryIndex, 'metric', val)}
            options={facetNamesOptions}
            placeholder="Select a metric"
            value={query.metric}
          />
        </div>
        <div className="query-builder__logs__item__text">as</div>
        <div className="query-builder__logs__item__input">
          <AutocompleteV2
            className="autocomplete__fixed-height-30"
            onChange={(val) =>
              updateQuery(queryIndex, 'normalizeFunction', val)
            }
            options={normalizeFunctionOptionsFilter}
            placeholder="Choose type"
            value={query.normalizeFunction}
          />
        </div>
        <div className="query-builder__logs__item__group">
          <div>
            <AutocompleteV2
              className="autocomplete-container--no-border autocomplete__fixed-height-30"
              onChange={(val) => updateQuery(queryIndex, 'rangeAggregate', val)}
              options={getRangeAggregateOptions(metric)}
              placeholder="Select range aggregate"
              value={query.rangeAggregate}
            />
          </div>
          {RangeAggregatesWithParams[query.rangeAggregate] && (
            <div>
              <Input
                className="input--no-border"
                onChange={(val) =>
                  updateQuery(queryIndex, 'rangeAggregateParam', val)
                }
                placeholder="Enter value"
                type="text"
                value={query.rangeAggregateParam}
              />
            </div>
          )}
          {!RangeAggregatesWithoutGrouping[query.rangeAggregate] && (
            <div>
              <MultiselectV2
                className="autocomplete-container--no-border autocomplete__fixed-height-30"
                onChange={(val) =>
                  updateQuery(queryIndex, 'rangeAggregateGrouping', val)
                }
                options={groupingOptions}
                placeholder="Group by range"
                value={query.rangeAggregateGrouping}
              />
            </div>
          )}
        </div>
        {enableVectorAggregates && (
          <div className="query-builder__logs__item__group">
            <div>
              <AutocompleteV2
                className="autocomplete-container--no-border autocomplete__fixed-height-30"
                onChange={(val) =>
                  updateQuery(queryIndex, 'vectorAggregate', val)
                }
                options={getVectorAggregateOptions()}
                placeholder="Vector aggregate"
                value={query.vectorAggregate}
              />
            </div>
            {VectorAggregatesWithParams[query.vectorAggregate] && (
              <div>
                <Input
                  className="input--no-border query-builder__logs__item__fixed-width"
                  onChange={(val) =>
                    updateQuery(queryIndex, 'vectorAggregateParam', val)
                  }
                  placeholder="Enter value"
                  type="text"
                  value={query.vectorAggregateParam}
                />
              </div>
            )}
            <div>
              <MultiselectV2
                className="autocomplete-container--no-border autocomplete__fixed-height-30"
                onChange={(val) =>
                  updateQuery(queryIndex, 'vectorAggregateGrouping', val)
                }
                options={groupingOptions}
                placeholder="Group by vector"
                value={query.vectorAggregateGrouping}
              />
            </div>
          </div>
        )}
      </div>
      <div className="query-builder__logs__query-action">
        {queries.length > 1 && (
          <div className="query-builder__logs__query-action__icon--delete">
            <XCircle onClick={() => removeQuery(queryIndex)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsMetricsQueryBuilderQuery;
