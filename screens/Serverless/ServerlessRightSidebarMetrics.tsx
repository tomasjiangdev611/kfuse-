import { ChartGrid } from 'components';
import React, { useMemo } from 'react';
import { DateSelection } from 'types';
import { queryRangeStep } from './utils';

type Args = {
  colorsByFunctionName: { [key: string]: string };
  date: DateSelection;
  functionName: string;
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
        chartType: 'line',
        colorMap,
        initialParam: 'aws_lambda_concurrentexecutions_count',
        labels: [(metric) => metric.FunctionName],
        options,
        queries: (param: any) => [
          `${param}{FunctionName="${functionName}",Resource="${functionName}"${formValueFiltersString}}`,
        ],
        step,
      },
      {
        chartType: 'line',
        colorMap,
        initialParam: 'aws_lambda_postruntimeextensionsduration_count',
        labels: [(metric) => metric.FunctionName],
        options,
        queries: (param: any) => [
          `${param}{FunctionName="${functionName}",Resource="${functionName}"${formValueFiltersString}}`,
        ],
        step,
      },
    ],
    [
      {
        chartType: 'line',
        colorMap,
        initialParam: 'aws_lambda_throttles_count',
        labels: [(metric) => metric.FunctionName],
        options,
        queries: (param: any) => [
          `${param}{FunctionName="${functionName}",Resource="${functionName}"${formValueFiltersString}}`,
        ],
        step,
      },
      {
        chartType: 'line',
        colorMap,
        initialParam: 'aws_lambda_unreservedconcurrentexecutions_count',
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
  date: DateSelection;
  functionName: string;
  serverlessMetrics: string[];
};

const ServerlessRightSidebarMetrics = ({
  colorsByFunctionName,
  date,
  functionName,
  serverlessMetrics,
}: Props) => {
  const rows = useMemo(
    () =>
      getRows({ colorsByFunctionName, date, functionName, serverlessMetrics }),
    [colorsByFunctionName, date, serverlessMetrics],
  );

  return (
    <div className="serverless__right-sidebar__metrics">
      <ChartGrid date={date} rows={rows} />
    </div>
  );
};

export default ServerlessRightSidebarMetrics;
