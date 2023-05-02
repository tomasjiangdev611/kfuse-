import React, { ReactElement } from 'react';

import SLOSidebarFacetGroup from './SLOSidebarFacetGroup';
import { SLOCoreFilter } from '../utils';
import { useSLOState } from '../hooks';

const SLOSidebar = ({
  sloState,
}: {
  sloState: ReturnType<typeof useSLOState>;
}): ReactElement => {
  const { getSLOStateFacetValues, selectedFacetValuesByNameState } = sloState;

  return (
    <div className="events__sidebar">
      <SLOSidebarFacetGroup
        forceExpanded
        facetNames={SLOCoreFilter}
        selectedFacetValuesByNameState={selectedFacetValuesByNameState}
        request={getSLOStateFacetValues}
      />
    </div>
  );
};

export default SLOSidebar;
