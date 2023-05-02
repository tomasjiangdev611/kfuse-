import {
  Loader,
  PopoverPosition,
  PopoverTriggerV2,
  RightSidebar,
  Table,
} from 'components';
import { colorsByLogLevel } from 'constants';
import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { eventsData } from 'requests';

import EventsExplorerTableDetails from './EventsExplorerTableDetails';
import EventsExplorerTableOptions from './EventsExplorerTableOptions';
import EventsExplorerTableTags from './EventsExplorerTableTags';
import { useTableEventsSettings } from '../hooks';
import { EventPageProps } from '../types';
import { Settings } from 'react-feather';

const columns = ({
  eventsState,
  rowDensity,
  setActiveEvent,
}: EventPageProps & { rowDensity: string; setActiveEvent: any }) => [
  {
    key: 'sourceTypeName',
    label: 'Source',
    renderCell: ({ row }: any) => {
      if (rowDensity === 'Single-line') {
        return (
          <div
            className="events__table__source"
            onClick={() => setActiveEvent(row)}
          >
            <div
              className="events__table__source__sign"
              style={{
                backgroundColor: colorsByLogLevel[row.alertType],
              }}
            ></div>
            <div>{row.sourceTypeName}</div>
          </div>
        );
      }

      return row.sourceTypeName;
    },
  },
  {
    key: 'text',
    label: 'Message',
    renderCell: ({
      row,
    }: {
      row: { text: string; title: string; alertType: string };
    }) => {
      if (rowDensity === 'Single-line') {
        return (
          <div
            className="events__table__message--signle-line"
            onClick={() => setActiveEvent(row)}
          >
            <div className="events__table__message__title--signle-line">
              {row.title.length > 40
                ? `${row.title.slice(0, 40)}...`
                : row.title}
            </div>
            <EventsExplorerTableTags
              maxTags={row.title.length > 40 ? 1 : 2}
              row={row}
              eventsState={eventsState}
            />
          </div>
        );
      }

      if (rowDensity === 'Compact') {
        return (
          <div
            className="events__table__message--compact"
            onClick={() => setActiveEvent(row)}
          >
            <div className="events__table__message__header">
              <div
                className="events__table__message__header__status"
                style={{ backgroundColor: colorsByLogLevel[row.alertType] }}
              >
                {row.alertType.toUpperCase()}
              </div>
              <div className="events__table__message__title--compact">
                {row.title}
              </div>
            </div>
            <div className="events__table__message__preview--compact">
              {row.text.trim()}
            </div>
            <EventsExplorerTableTags
              maxTags={4}
              row={row}
              eventsState={eventsState}
            />
          </div>
        );
      }

      return (
        <div
          className="events__table__message"
          onClick={() => setActiveEvent(row)}
        >
          <div className="events__table__message__header">
            <div
              className="events__table__message__header__status"
              style={{ backgroundColor: colorsByLogLevel[row.alertType] }}
            >
              {row.alertType.toUpperCase()}
            </div>
          </div>
          <div className="events__table__message__title">{row.title}</div>
          <EventsExplorerTableTags row={row} eventsState={eventsState} />
          <pre className="text--prewrap events__table__message__preview">
            {row.text.trim()}
          </pre>
        </div>
      );
    },
  },
  {
    key: 'timestamp',
    label: 'Date',
    renderCell: ({ row }: { row: { timestamp: string } }) => {
      return dayjs(row.timestamp).fromNow(false);
    },
  },
];

const EventsExplorerTable = ({ eventsState }: EventPageProps): ReactElement => {
  const [activeEvent, setActiveEvent] = useState(null);
  const eventsDataRequest = useRequest(eventsData);
  const { date, filterByFacets, searchTerms, selectedFacetValuesByNameState } =
    eventsState;
  const { tableEventsSettings, setTableEventsSettings } =
    useTableEventsSettings();

  useEffect(() => {
    eventsDataRequest.call({
      date,
      filterByFacets,
      searchTerms,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
    });
  }, [date, filterByFacets, searchTerms, selectedFacetValuesByNameState.state]);
  return (
    <Loader isLoading={eventsDataRequest.isLoading}>
      <div className="events__table__setting-options">
        <PopoverTriggerV2
          className="events__table__setting-options__popover"
          popover={({ close }) => (
            <EventsExplorerTableOptions
              close={close}
              setTableEventsSettings={setTableEventsSettings}
              tableEventsSettings={tableEventsSettings}
            />
          )}
          position={PopoverPosition.BOTTOM_LEFT}
          offsetY={-2}
        >
          <div className="events__table__setting-options__button">
            <Settings size={16} />
            Options
          </div>
        </PopoverTriggerV2>
      </div>
      <div className="events__table">
        <Table
          className="events__table__table"
          columns={columns({
            eventsState,
            rowDensity: tableEventsSettings.listDensity,
            setActiveEvent,
          })}
          rows={eventsDataRequest.result || []}
        />
        {activeEvent && (
          <RightSidebar
            className="events__right-sidebar"
            close={() => setActiveEvent(null)}
            title={activeEvent.title}
          >
            <EventsExplorerTableDetails
              activeEvent={activeEvent}
              eventsState={eventsState}
            />
          </RightSidebar>
        )}
      </div>
    </Loader>
  );
};

export default EventsExplorerTable;
