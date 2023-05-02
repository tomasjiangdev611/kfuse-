import { useRequest, useSelectedFacetValuesByNameState } from 'hooks';
import React, { useEffect } from 'react';
import { queryRange } from 'requests';
import { DateSelection, PrometheusDataset } from 'types';
import { facetNames } from './constants';
import ServerlessRightSidebarFiltersItem from './ServerlessRightSidebarFiltersItem';
import { queryRangeStep } from './utils';

const formatResult = (datasets: PrometheusDataset[]) => {
  const result: { [key: string]: string } = {};

  datasets.forEach((dataset) => {
    const { metric } = dataset;
    Object.keys(metric).forEach((key) => {
      result[key] = metric[key];
    });
  });

  return result;
};

type Props = {
  date: DateSelection;
  functionName: string;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
};

const ServerlessRightSidebarFilters = ({
  date,
  functionName,
  selectedFacetValuesByNameState,
}: Props) => {
  const getLabels = () =>
    queryRange({
      date,
      query: `sum by (${facetNames
        .map((facetName) => facetName.name)
        .join(
          ',',
        )}, FunctionName) (aws_lambda_invocations_count{FunctionName="${functionName}"})`,
      step: `${queryRangeStep(date)}s`,
    }).then(formatResult);

  const getLabelsRequest = useRequest(getLabels);

  useEffect(() => {
    getLabelsRequest.call();
  }, []);

  const values = getLabelsRequest.result || {};

  return (
    <div className="serverless__right-sidebar__filters">
      {facetNames.map((facetName) => (
        <ServerlessRightSidebarFiltersItem
          date={date}
          facetName={facetName.facetName}
          key={facetName.name}
          name={facetName.name}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
          value={values[facetName.name]}
        />
      ))}
    </div>
  );
};

export default ServerlessRightSidebarFilters;
