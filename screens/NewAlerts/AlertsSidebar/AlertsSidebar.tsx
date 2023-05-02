import React, { ReactElement } from 'react';

import AlertsSidebarFacetGroup from './AlertsSidebarFacetGroup';
import { AlertsFacet } from '../utils';
import { useAlertsState } from '../hooks';

const AlertstSidebar = ({
  alertsState,
}: {
  alertsState: ReturnType<typeof useAlertsState>;
}): ReactElement => {
  const { getPredefinedFacetValues, selectedFacetValuesByNameState } =
    alertsState;

  return (
    <div className="events__sidebar">
      <AlertsSidebarFacetGroup
        forceExpanded
        facetNames={AlertsFacet}
        selectedFacetValuesByNameState={selectedFacetValuesByNameState}
        request={getPredefinedFacetValues}
      />
    </div>
  );
};

export default AlertstSidebar;
