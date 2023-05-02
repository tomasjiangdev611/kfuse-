import { ChartGrid, Tabs, Tab, useTabs } from 'components';
import { useSelectedFacetValuesByNameState } from 'hooks';
import React, { useMemo } from 'react';
import { DateSelection } from 'types';
import ServerlessRightSidebarConfiguration from './ServerlessRightSidebarConfiguration';
import ServerlessRightSidebarFilters from './ServerlessRightSidebarFilters';
import ServerlessRightSidebarLogs from './ServerlessRightSidebarLogs';
import ServerlessRightSidebarMetrics from './ServerlessRightSidebarMetrics';
import { queryRangeStep } from './utils';

type Args = {
  colorsByFunctionName: { [key: string]: string };
  configurationByFunctionName: { [key: string]: any };
  date: DateSelection;
  functionName: string;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  serverlessMetrics: string[];
};

const getRows = ({
  colorsByFunctionName,
  date,
  functionName,
  serverlessMetrics,
}: Args) => {
  const options = serverlessMetrics.map((metric) => ({
    label: metric.replace('aws_lambda_', '').replace(/_/g, ' '),
    value: metric,
  }));

  const colorMap = colorsByFunctionName;
  const formValueFiltersString = '';
  const step = `${queryRangeStep(date)}s`;
  return [
    [
      {
        chartType: 'bar',
        colorMap,
        initialParam: 'aws_lambda_invocations_count',
        labels: [(metric) => metric.FunctionName],
        options,
        queries: (param: any) => [
          `${param}{FunctionName="${functionName}",Resource="${functionName}"${formValueFiltersString}}`,
        ],
        step,
      },
      {
        chartType: 'bar',
        colorMap,
        initialParam: 'aws_lambda_duration_sum',
        labels: [(metric) => metric.FunctionName],
        options,
        queries: (param: any) => [
          `${param}{FunctionName="${functionName}",Resource="${functionName}"${formValueFiltersString}}`,
        ],
        step,
      },
      {
        chartType: 'bar',
        colorMap,
        initialParam: 'aws_lambda_errors_count',
        labels: [(metric) => metric.FunctionName],
        options,
        queries: (param: any) => [
          `${param}{FunctionName="${functionName}",Resource="${functionName}"${formValueFiltersString}}`,
        ],
        step,
      },
    ],
  ];
};

type Props = {
  colorsByFunctionName: { [key: string]: string };
  configurationByFunctionName: { [key: string]: any };
  date: DateSelection;
  functionName: string;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  serverlessMetrics: string[];
};

const ServerlessRightSidebar = ({
  colorsByFunctionName,
  configurationByFunctionName,
  date,
  functionName,
  selectedFacetValuesByNameState,
  serverlessMetrics,
}: Props) => {
  const rows = useMemo(
    () =>
      getRows({ colorsByFunctionName, date, functionName, serverlessMetrics }),
    [colorsByFunctionName, date, serverlessMetrics],
  );

  const tabs = useTabs();

  return (
    <div>
      <ServerlessRightSidebarFilters
        date={date}
        functionName={functionName}
        selectedFacetValuesByNameState={selectedFacetValuesByNameState}
      />
      <div className="serverless__right-sidebar__section">
        <ChartGrid date={date} rows={rows} />
      </div>
      <div className="serverless__right-sidebar__section">
        <Tabs
          className="serverless__right-sidebar__tabs tabs--underline"
          tabs={tabs}
        >
          <Tab label="Logs">
            <ServerlessRightSidebarLogs
              date={date}
              functionName={functionName}
            />
          </Tab>
          <Tab label="Metrics">
            <ServerlessRightSidebarMetrics
              colorsByFunctionName={colorsByFunctionName}
              date={date}
              functionName={functionName}
              serverlessMetrics={serverlessMetrics}
            />
          </Tab>
          <Tab label="Configuration">
            <ServerlessRightSidebarConfiguration
              configurationByFunctionName={configurationByFunctionName}
              functionName={functionName}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ServerlessRightSidebar;
