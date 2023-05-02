import { delimiter } from 'constants';
import React, { useMemo } from 'react';
import { useLogsState } from './hooks';
import LogsAnalytics from './LogsAnalytics';

type Props = {
  facetNames: { component: string; name: string; type: string }[];
  isFacetNamesLoading: boolean;
  logsState: ReturnType<typeof useLogsState>;
};

const LogsActiveFacetHeader = ({
  facetNames,
  isFacetNamesLoading,
  logsState,
}: Props) => {
  const facetKeyOptions = useMemo(() => {
    return facetNames
      .map((facetName) => ({
        label: `${facetName.component}:${facetName.name}`,
        value: `${facetName.component}${delimiter}${facetName.name}${delimiter}${facetName.type}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [facetNames]);

  return (
    <LogsAnalytics
      isFacetNamesLoading={isFacetNamesLoading}
      labelValueOptions={facetKeyOptions}
      logsState={logsState}
    />
  );
};

export default LogsActiveFacetHeader;
