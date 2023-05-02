import { FacetPicker, LeftSidebar, useLeftSidebarState } from 'components';
import { useRequest, useSelectedFacetValuesByNameState } from 'hooks';
import React, { useEffect, useState } from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { facetNames } from './constants';
import { KpisByFunctionName } from './types';

const formatResult =
  (name: string, kpisByFunctionName: KpisByFunctionName) => (result) => {
    const functionNamesBitmap = Object.keys(kpisByFunctionName).reduce(
      (obj, functionName) => ({ ...obj, [functionName]: 1 }),
      {},
    );

    const countsByValue: { [key: string]: number } = {};
    result.forEach((dataset) => {
      const { metric } = dataset;
      const value = metric[name];
      if (value && functionNamesBitmap[metric.FunctionName]) {
        if (!countsByValue[value]) {
          countsByValue[value] = 0;
        }

        countsByValue[value] += 1;
      }
    });

    return Object.keys(countsByValue).map((value) => ({
      count: countsByValue[value],
      value,
    }));
  };

type Props = {
  date: DateSelection;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  leftSidebarState: ReturnType<typeof useLeftSidebarState>;
  kpisByFunctionName: KpisByFunctionName;
  kpisByFunctionNameRequest: ReturnType<typeof useRequest>;
};

const ServerlessSidebar = ({
  date,
  selectedFacetValuesByNameState,
  kpisByFunctionName,
  kpisByFunctionNameRequest,
  leftSidebarState,
}: Props) => {
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());
  const clearFacetHandler = (name: string) => () => {
    selectedFacetValuesByNameState.clearFacet(name);
  };

  const handlersByName = (name: string) => ({
    excludeFacetValue: (value: string) => {
      selectedFacetValuesByNameState.excludeFacetValue({ name, value });
    },
    selectOnlyFacetValue: (value: string) => {
      selectedFacetValuesByNameState.selectOnlyFacetValue({ name, value });
    },
    toggleFacetValue: (value: string) => {
      selectedFacetValuesByNameState.toggleFacetValue({ name, value });
    },
  });

  const requestByLabelName = (name: string) => () =>
    queryRange({
      date,
      query: `sum by (${name}, FunctionName) (aws_lambda_invocations_count)`,
    }).then(formatResult(name, kpisByFunctionName));

  useEffect(() => {
    setLastRefreshedAt(new Date());
  }, [date, kpisByFunctionNameRequest.result]);

  return (
    <LeftSidebar leftSidebarState={leftSidebarState}>
      <div className="serverless__sidebar__body">
        {facetNames.map(({ name, renderName }) => (
          <FacetPicker
            clearFacet={clearFacetHandler(name)}
            key={name}
            lastRefreshedAt={lastRefreshedAt}
            name={name}
            renderName={renderName}
            request={requestByLabelName(name)}
            selectedFacetValues={
              selectedFacetValuesByNameState.state[name] || {}
            }
            {...handlersByName(name)}
          />
        ))}
      </div>
    </LeftSidebar>
  );
};

export default ServerlessSidebar;
