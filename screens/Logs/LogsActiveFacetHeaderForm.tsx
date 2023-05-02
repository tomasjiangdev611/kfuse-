import classnames from 'classnames';
import { Autocomplete, Multiselect, useModalsContext } from 'components';
import { delimiter } from 'constants';
import React, { ReactElement, useMemo } from 'react';
import { RangeAggregate, VectorAggregate } from 'types';

const LogsActiveFacetHeaderForm = ({
  component,
  enableChartMetricButtonToggle,
  facetNames,
  form,
  getGroupingFacetNamesRequest,
  getLogMetricsTimeSeriesRequest,
  logsState,
  name,
  type,
}): ReactElement => {
  const { date, selectedFacetValues, keyExists, kplTerms, searchTerms, width } =
    logsState;

  const groupingOptions = useMemo(() => {
    const coreCloudAndKubernetesAndComponentFacets = facetNames.filter(
      (facetName) =>
        (facetName.component === 'Core' ||
          facetName.component === 'Cloud' ||
          facetName.component === 'Kubernetes' ||
          facetName.component === component)
    );

    return coreCloudAndKubernetesAndComponentFacets
      .map((facetName) => ({
        label: `${facetName.component}:${facetName.name}`,
        value: `${facetName.component}${delimiter}${facetName.name}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [component, facetNames]);

  const chartMetric = () => {
    getLogMetricsTimeSeriesRequest
      .call({
        component,
        date,
        dimensions: form.values.dimensions,
        filterOrExcludeByFingerprint: form.values.filterOrExcludeByFingerprint,
        keyExists,
        kplTerms,
        name,
        rangeAggregate: form.values.rangeAggregate,
        rangeAggregateGrouping: form.values.rangeAggregateGrouping,
        searchTerms,
        selectedFacetValues,
        type,
        vectorAggregate: form.values.vectorAggregate,
        vectorAggregateGrouping: form.values.vectorAggregateGrouping,
        width,
      })
      .then(enableChartMetricButtonToggle.off);
  };

  return (
    <div className="logs__active-facet__header__form">
      <div className="logs__active-facet__header__form__row">
        <div className="logs__active-facet__header__form__field logs__active-facet__header__form__dimensions">
          <Autocomplete
            options={Object.values(RangeAggregate)
              .map((rangeAggregate) => ({
                label: rangeAggregate,
                value: rangeAggregate,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            placeholder="Range Aggregate"
            {...form.propsByKey('rangeAggregate')}
          />
        </div>
        <div className="logs__active-facet__header__form__field logs__active-facet__header__form__aggregate-by">
          <Multiselect
            options={groupingOptions}
            placeholder="Range Group By"
            {...form.propsByKey('rangeAggregateGrouping')}
          />
        </div>
      </div>
      <div className="logs__active-facet__header__form__row">
        <div className="logs__active-facet__header__form__field logs__active-facet__header__form__dimensions">
          <Autocomplete
            options={Object.values(VectorAggregate)
              .map((vectorAggregate) => ({
                label: vectorAggregate,
                value: vectorAggregate,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            placeholder="Vector Aggregate"
            {...form.propsByKey('vectorAggregate')}
          />
        </div>
        <div className="logs__active-facet__header__form__field logs__active-facet__header__form__aggregate-by">
          <Multiselect
            options={groupingOptions}
            placeholder="Vector Group By"
            {...form.propsByKey('vectorAggregateGrouping')}
          />
        </div>
        <div className="logs__active-facet__header__form__field logs__active-facet__header__form__create-button">
          <button
            className={classnames({
              button: true,
              'button--disabled':
                getLogMetricsTimeSeriesRequest.isLoading ||
                !enableChartMetricButtonToggle.value,
            })}
            onClick={chartMetric}
            type="button"
          >
            Chart Metric
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsActiveFacetHeaderForm;
