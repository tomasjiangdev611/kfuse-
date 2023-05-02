import { Loader, RightSidebar, useLeftSidebarState } from 'components';
import { Datepicker } from 'composite';
import { chartingPalette, serverlessTableKpis } from 'constants';
import {
  useDateState,
  useRequest,
  useSelectedFacetValuesByNameState,
  useToggle,
} from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import {
  getServerlessFunctions,
  getServerlessMetrics,
  queryRange,
} from 'requests';
import { DateSelection, SelectedFacetValuesByName } from 'types';
import ServerlessRightSidebar from './ServerlessRightSidebar';
import ServerlessSidebar from './ServerlessSidebar';
import ServerlessTable from './ServerlessTable';
import { formatDatasets } from './utils';

const getQueries = (
  date: DateSelection,
  selectedFacetValuesByName: SelectedFacetValuesByName,
) => {
  const timeDuration = `${date.endTimeUnix - date.startTimeUnix}s`;
  return serverlessTableKpis.map((kpi) =>
    kpi.query(timeDuration, selectedFacetValuesByName),
  );
};

const Serverless = () => {
  const [activeFunctionName, setActiveFunctionName] = useState<string>(null);
  const [date, setDate] = useDateState();
  const getServerlessFunctionsRequest = useRequest(getServerlessFunctions);
  const getServerlessMetricsRequest = useRequest(getServerlessMetrics);
  const leftSidebarState = useLeftSidebarState('serverless');
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();

  const kpisByFunctionNameRequest = useRequest((args) => {
    const queries = getQueries(args.date, args.selectedFacetValuesByName);
    return Promise.all(
      queries.map((query) => queryRange({ date, instant: true, query })),
    ).then(formatDatasets('FunctionName'));
  });

  const kpisByFunctionName = useMemo(
    () => kpisByFunctionNameRequest.result || {},
    [kpisByFunctionNameRequest.result],
  );

  useEffect(() => {
    kpisByFunctionNameRequest.call({
      date,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
    });
  }, [date, selectedFacetValuesByNameState.state]);

  const colorsByFunctionName = Object.keys(
    kpisByFunctionNameRequest.result || [],
  )
    .sort()
    .reduce(
      (obj, functionName, i) => ({
        ...obj,
        [functionName]: chartingPalette[i % chartingPalette.length],
      }),
      {},
    );

  useEffect(() => {
    getServerlessFunctionsRequest.call();
  }, []);

  useEffect(() => {
    getServerlessMetricsRequest.call(date);
  }, [date]);

  const serverlessMetrics = useMemo(
    () => getServerlessMetricsRequest.result || [],
    [getServerlessMetricsRequest.result],
  );

  return (
    <div className="serverless">
      <ServerlessSidebar
        date={date}
        kpisByFunctionName={kpisByFunctionName}
        kpisByFunctionNameRequest={kpisByFunctionNameRequest}
        leftSidebarState={leftSidebarState}
        selectedFacetValuesByNameState={selectedFacetValuesByNameState}
      />
      <div className="serverless__main">
        <div className="serverless__header">
          <div className="serverless__header__left">
            <div className="serverless__header__title text--h1">Serverless</div>
          </div>
          <div className="serverless__header__right">
            <Datepicker
              onChange={setDate as (dateSelection: DateSelection) => void}
              value={date as DateSelection}
            />
          </div>
        </div>
        <div className="serverless__body">
          <Loader
            className="serverless__table"
            isLoading={kpisByFunctionNameRequest.isLoading}
          >
            <ServerlessTable
              colorsByFunctionName={colorsByFunctionName}
              kpisByFunctionName={kpisByFunctionNameRequest.result || {}}
              setActiveFunctionName={setActiveFunctionName}
            />
          </Loader>
        </div>
      </div>
      {activeFunctionName ? (
        <RightSidebar
          className="serverless__right-sidebar"
          close={() => setActiveFunctionName(null)}
          closeOnOutsideClick={() => {}}
          title={activeFunctionName}
        >
          <ServerlessRightSidebar
            colorsByFunctionName={colorsByFunctionName}
            configurationByFunctionName={
              getServerlessFunctionsRequest.result || {}
            }
            date={date}
            functionName={activeFunctionName}
            selectedFacetValuesByNameState={selectedFacetValuesByNameState}
            serverlessMetrics={serverlessMetrics}
          />
        </RightSidebar>
      ) : null}
    </div>
  );
};

export default Serverless;
