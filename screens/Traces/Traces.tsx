import camelcaseKeys from 'camelcase-keys';
import classnames from 'classnames';
import {
  DateControls,
  LeftSidebar,
  Select,
  SpanFilters,
  TraceSidebar,
  useLeftSidebarState,
} from 'components';
import { Datepicker } from 'composite';

import {
  useColorsByServiceName,
  useDateState,
  useLiveTail,
  useRequest,
  useSpanFilters,
  useSearch,
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { traceLabelNamesBase } from 'requests';
import {
  DateSelection,
  SelectedFacetValuesByName,
  SpanFilter,
  Trace,
  TracesTab,
  VisualizeAs,
} from 'types';
import TracesChartGrid from './TracesChartGrid';
import TracesSearch from './TracesSearch';
import TracesServiceMap from './TracesServiceMap';
import TracesSidebar from './TracesSidebar';
import TracesTable from './TracesTable';
import TracesTimeseries from './TracesTimeseries';

const whitelistedFacetNamesFor7Days: { [key: string]: number } = {
  kube_deployment: 1,
  kube_namespace: 1,
  resource: 1,
  service_name: 1,
};

const getShouldDisable7Days = (
  selectedFacetValuesByName: SelectedFacetValuesByName,
): boolean => {
  const selectedFacetNames = Object.keys(selectedFacetValuesByName);
  return (
    selectedFacetNames.length === 0 ||
    !selectedFacetNames.find(
      (facetName) => whitelistedFacetNamesFor7Days[facetName],
    )
  );
};

type Props = {
  tracesTab: TracesTab;
};

const Traces = ({ tracesTab }: Props) => {
  const [activeTrace, setActiveTrace] = useState<Trace>(null);
  const [date, setDate] = useDateState();
  const liveTail = useLiveTail(
    '/trace/livetail?traceFilter=%7B%7D',
    camelcaseKeys,
  );

  const search = useSearch();

  const leftSidebarState = useLeftSidebarState('traces');
  const selectedFacetRangeByNameState = useSelectedFacetRangeByNameState();
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const [traceIdSearch, setTraceIdSearch] = useState('');
  const traceLabelNamesRequest = useRequest(traceLabelNamesBase);
  const spanFilters = useSpanFilters(selectedFacetValuesByNameState);
  const { spanFilter, setSpanFilter } = spanFilters;
  const colorsByServiceName = useColorsByServiceName(date);

  const close = () => {
    setActiveTrace(null);
  };

  useEffect(() => {
    traceLabelNamesRequest.call({ date });
    liveTail.stopLiveTail();
  }, [date]);

  useEffect(() => {
    return () => {
      liveTail.closeSocket();
    };
  }, []);

  const shouldDisable7Days = useMemo(
    () => getShouldDisable7Days(selectedFacetValuesByNameState.state),
    [selectedFacetValuesByNameState.state],
  );

  return (
    <div
      className={classnames({
        traces: true,
        'traces--disable-7-day': shouldDisable7Days,
      })}
    >
      <LeftSidebar leftSidebarState={leftSidebarState}>
        <TracesSidebar
          colorsByServiceName={colorsByServiceName}
          date={date}
          selectedFacetRangeByNameState={selectedFacetRangeByNameState}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
          spanFilter={spanFilter}
          traceLabelNamesRequest={traceLabelNamesRequest}
        />
      </LeftSidebar>
      <div className="traces__main">
        <div className="traces__header">
          <div className="traces__header__left">
            <TracesSearch
              date={date}
              leftSidebarState={leftSidebarState}
              search={search}
              selectedFacetRangeByNameState={selectedFacetRangeByNameState}
              selectedFacetValuesByNameState={selectedFacetValuesByNameState}
              setTraceIdSearch={setTraceIdSearch}
              spanFilter={spanFilter}
              traceIdSearch={traceIdSearch}
              traceLabelNamesRequest={traceLabelNamesRequest}
              tracesTab={tracesTab}
            />
          </div>
          <div className="traces__header__right">
            <div className="traces__header__date-controls">
              <div className="traces__header__date-controls__item">
                <Datepicker
                  hasStartedLiveTail={liveTail.isEnabled}
                  onChange={setDate as (dateSelection: DateSelection) => void}
                  startLiveTail={liveTail.startLiveTailIfNeeded}
                  value={date as DateSelection}
                />
              </div>
              <div className="traces__header__date-controls__item">
                <DateControls
                  date={date}
                  liveTail={liveTail}
                  setDate={setDate}
                />
              </div>
            </div>
            <div className="traces__header__filters">
              {search.visualizeAs === VisualizeAs.flowMap ? (
                <Select
                  className={classnames({
                    'select--disabled': true,
                  })}
                  onChange={setSpanFilter}
                  options={Object.values(SpanFilter).map((spanFilterLabel) => ({
                    label: spanFilterLabel,
                    value: spanFilterLabel,
                  }))}
                  right
                  value={
                    tracesTab === TracesTab.serviceMap
                      ? SpanFilter.traceRootSpans
                      : spanFilter
                  }
                />
              ) : (
                <SpanFilters spanFilters={spanFilters} />
              )}
            </div>
          </div>
        </div>
        <TracesChartGrid
          date={date}
          selectedFacetValuesByName={selectedFacetValuesByNameState.state}
          setDate={setDate}
          spanFilter={spanFilter}
        />
        <div className="traces__main">
          {tracesTab === TracesTab.serviceMap ? (
            <TracesServiceMap
              colorsByServiceName={colorsByServiceName}
              date={date}
              selectedFacetValuesByName={selectedFacetValuesByNameState.state}
            />
          ) : null}
          {tracesTab === TracesTab.list ? (
            <TracesTable
              colorsByServiceName={colorsByServiceName}
              date={date}
              liveTail={liveTail}
              selectedFacetRangeByNameState={selectedFacetRangeByNameState}
              selectedFacetValuesByNameState={selectedFacetValuesByNameState}
              setActiveTrace={setActiveTrace}
              spanFilter={spanFilter}
              traceIdSearch={traceIdSearch}
            />
          ) : null}
          {tracesTab === TracesTab.timeseries ? (
            <TracesTimeseries
              date={date}
              search={search}
              selectedFacetRangeByName={selectedFacetRangeByNameState.state}
              selectedFacetValuesByName={selectedFacetValuesByNameState.state}
            />
          ) : null}
        </div>
      </div>
      {activeTrace ? (
        <TraceSidebar
          close={close}
          colorsByServiceName={colorsByServiceName}
          date={date as DateSelection}
          key={activeTrace.span.spanId}
          trace={activeTrace}
        />
      ) : null}
    </div>
  );
};

export default Traces;
