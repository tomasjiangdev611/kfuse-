import React, { ReactElement } from 'react';
import { MdOutlineLabel } from 'react-icons/md';

import EventsSidebarFacetGroup from './EventsSidebarFacetGroup';
import { EventPageProps } from '../../types';
import { eventsCoreLabels, eventsLabels } from '../../utils';

const EventsSidebar = ({ eventsState }: EventPageProps): ReactElement => {
  const {
    date,
    additionalLabels,
    cloudLabels,
    kubernetesLabels,
    selectedFacetValuesByNameState,
    requestByFacetName,
    requestByLabelName,
  } = eventsState;

  return (
    <div className="events__sidebar">
      <EventsSidebarFacetGroup
        component="Core"
        date={date}
        forceExpanded
        facetNames={eventsCoreLabels}
        selectedFacetValuesByNameState={selectedFacetValuesByNameState}
        request={requestByFacetName}
      />
      <EventsSidebarFacetGroup
        component="Event"
        date={date}
        facetNames={eventsLabels}
        selectedFacetValuesByNameState={selectedFacetValuesByNameState}
        request={requestByFacetName}
      />
      <div className="events__sidebar__labels">
        <div className="events__sidebar__labels__title">
          <div className="events__sidebar__labels__title__icon">
            <MdOutlineLabel size={18} />
          </div>
          <div className="events__sidebar__labels__title__text">Labels</div>
        </div>
        <EventsSidebarFacetGroup
          component="Cloud"
          date={date}
          facetNames={cloudLabels}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
          request={requestByLabelName}
        />
        <EventsSidebarFacetGroup
          component="Kubernetes"
          date={date}
          facetNames={kubernetesLabels}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
          request={requestByLabelName}
        />
        <EventsSidebarFacetGroup
          component="Additional"
          date={date}
          facetNames={additionalLabels}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
          request={requestByLabelName}
        />
      </div>
    </div>
  );
};

export default EventsSidebar;
