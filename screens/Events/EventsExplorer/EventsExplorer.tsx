import { LeftSidebar, TooltipTrigger, useLeftSidebarState } from 'components';
import { Datepicker } from 'composite';
import React, { ReactElement } from 'react';
import { Maximize2, RefreshCw } from 'react-feather';
import { DateSelection, PanelPosition } from 'types';
import { refreshDate } from 'utils/refreshDate';

import EventsExplorerTable from './EventsExplorerTable';
import EventsExplorerChart from './EventsExplorerChart';
import { EventsSearchBar, EventsSidebar } from '../components';
import { useEventsState } from '../hooks';

const EventsExplorer = (): ReactElement => {
  const leftSidebarState = useLeftSidebarState('events-explorer');
  const eventsState = useEventsState();
  const { date, setDate } = eventsState;

  return (
    <div className="events">
      <LeftSidebar
        className="events__left-sidebar"
        leftSidebarState={leftSidebarState}
      >
        <EventsSidebar eventsState={eventsState} />
      </LeftSidebar>
      <div className="events__main">
        <div className="events__header">
          {leftSidebarState.width === 0 ? (
            <TooltipTrigger
              className="logs__search__show-filters-button"
              position={PanelPosition.TOP_LEFT}
              tooltip="Show Filters"
            >
              <button
                className="button button--icon"
                onClick={leftSidebarState.show}
              >
                <Maximize2 size={12} />
              </button>
            </TooltipTrigger>
          ) : null}
          <EventsSearchBar eventsState={eventsState} />
          <div>
            <Datepicker
              onChange={setDate as (dateSelection: DateSelection) => void}
              value={date as DateSelection}
            />
          </div>
          <button
            className="events__header__refresh-button"
            onClick={() => refreshDate(date, setDate)}
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <div className="events__body">
          <EventsExplorerChart eventsState={eventsState} />
          <EventsExplorerTable eventsState={eventsState} />
        </div>
      </div>
    </div>
  );
};

export default EventsExplorer;
