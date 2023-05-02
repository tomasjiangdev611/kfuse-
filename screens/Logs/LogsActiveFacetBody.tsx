import { Checkbox, Loader, useThemeContext } from 'components';
import { useRequest, useToggle } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { getLogFacetFpList, getLogMetricsTimeSeries } from 'requests';
import { WidgetTypes } from 'types';

import { useLogsState } from './hooks';
import LogsActiveFacetBodyChart from './LogsActiveFacetBodyChart';
import LogsActiveFacetBodyFingerprint from './LogsActiveFacetBodyFingerprint';
import LogsActiveFacetShowSaveMetricModalButton from './LogsActiveFacetShowSaveMetricModalButton';

const LogsActiveFacetBody = ({
  chartType,
  component,
  enableChartMetricButtonToggle,
  facetKey,
  form,
  getLogMetricsTimeSeriesRequest,
  getGroupingFacetNamesRequest,
  logsState,
  name,
  type,
}: {
  chartType: WidgetTypes;
  component: string;
  enableChartMetricButtonToggle: ReturnType<typeof useToggle>;
  facetKey: any;
  facetNames: any;
  form: any;
  getGroupingFacetNamesRequest: ReturnType<typeof useRequest>;
  getLogMetricsTimeSeriesRequest: ReturnType<typeof useRequest>;
  logsState: ReturnType<typeof useLogsState>;
  name: string;
  type: any;
}): ReactElement => {
  const { utcTimeEnabled } = useThemeContext();
  const getLogFacetFpListRequest = useRequest(getLogFacetFpList);

  const {
    date,
    selectedFacetValues,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    width,
  } = logsState;

  useEffect(() => {
    if (form.values.rangeAggregate && width) {
      enableChartMetricButtonToggle.on();
    }
  }, [
    date,
    selectedFacetValues,
    facetKey,
    filterOrExcludeByFingerprint,
    form.values,
    keyExists,
    searchTerms,
    width,
  ]);

  useEffect(() => {
    getLogFacetFpListRequest
      .call({
        component,
        date,
        selectedFacetValues,
        filterOrExcludeByFingerprint,
        name,
        keyExists,
        searchTerms,
        type,
      })
      .then((fingerprints) => {
        const nextFilterOrExcludeByFingerprint = fingerprints.reduce(
          (obj, fingerprint) => ({ ...obj, [fingerprint.hash]: 1 }),
          {},
        );

        form.setValue(
          'filterOrExcludeByFingerprint',
          nextFilterOrExcludeByFingerprint,
        );

        getGroupingFacetNamesRequest.call({
          date,
          filterOrExcludeByFingerprint: nextFilterOrExcludeByFingerprint,
        });
      });
  }, [
    date,
    selectedFacetValues,
    facetKey,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    width,
  ]);

  const data = getLogMetricsTimeSeriesRequest.result?.data || [];
  const fingerprints = getLogFacetFpListRequest.result || [];
  const labels = getLogMetricsTimeSeriesRequest.result?.labels || [];

  return (
    <div className="logs__active-facet__body">
      <Loader
        className="logs__active-facet__chart"
        isLoading={getLogMetricsTimeSeriesRequest.isLoading}
      >
        <LogsActiveFacetBodyChart
          chartType={chartType}
          data={data}
          labels={labels}
          width={width}
          utcTimeEnabled={utcTimeEnabled}
        />
      </Loader>
      <Loader
        className="logs__active-facet__fingerprints"
        isLoading={getLogFacetFpListRequest.isLoading}
      >
        <div className="logs__active-facet__fingerprints__header">
          Fingerprints
        </div>
        <div className="logs__active-facet__fingerprints__checkbox">
          {fingerprints.length ? (
            <Checkbox
              onChange={(checked) => {
                form.setValue(
                  'filterOrExcludeByFingerprint',
                  checked
                    ? fingerprints.reduce(
                        (obj, fingerprint) => ({
                          ...obj,
                          [fingerprint.hash]: 1,
                        }),
                        {},
                      )
                    : {},
                );
              }}
              value={
                Object.values(form.values.filterOrExcludeByFingerprint).filter(
                  (value) => value,
                ).length === fingerprints.length
              }
            />
          ) : null}
        </div>
        <div className="logs__active-facet__fingerprints__items">
          {fingerprints.map((fingerprint) => (
            <div
              className="logs__active-facet__fingerprints__item"
              key={fingerprint.hash}
            >
              <div className="logs__active-facet__fingerprints__item__checkbox">
                <Checkbox
                  onChange={() => {
                    form.toggleMapItem(
                      'filterOrExcludeByFingerprint',
                      fingerprint.hash,
                    );
                  }}
                  value={
                    form.values.filterOrExcludeByFingerprint[fingerprint.hash]
                  }
                />
              </div>
              <LogsActiveFacetBodyFingerprint
                fingerprint={fingerprint}
                logsState={logsState}
              />
            </div>
          ))}
        </div>
      </Loader>
    </div>
  );
};

export default LogsActiveFacetBody;
