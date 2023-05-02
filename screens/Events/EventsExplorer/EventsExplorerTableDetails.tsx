import { colorsByLogLevel, dateTimeFormat } from 'constants';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import EventsExplorerTableTags from './EventsExplorerTableTags';
import { EventPageProps } from '../types';

const EventsExplorerTableDetails = ({
  activeEvent,
  eventsState,
}: {
  activeEvent: any;
} & EventPageProps): ReactElement => {
  return (
    <div className="events__table__details">
      <div className="events__table__details__header">
        {activeEvent.alertType && (
          <div
            className="events__table__message__header__status"
            style={{ backgroundColor: colorsByLogLevel[activeEvent.alertType] }}
          >
            {activeEvent.alertType.toUpperCase()}
          </div>
        )}
        <div className="events__table__details__time">
          <b>{dayjs(activeEvent.timestamp).format(dateTimeFormat)}</b>
        </div>
        <div className="events__table__details__time">
          {dayjs(activeEvent.timestamp).fromNow()}
        </div>
      </div>
      <div className="events__table__details__message">
        <p className="events__table__details__subheader">Message</p>
        <div className="">{activeEvent.text}</div>
      </div>
      <div className="events__table__details__attributes">
        <p className="events__table__details__subheader">Attributes</p>
        {activeEvent.aggregationKey && (
          <div>
            <b>Aggregation Key:</b> {activeEvent.aggregationKey}
          </div>
        )}
        {activeEvent.eventType && (
          <div>
            <b>Event Type:</b> {activeEvent.eventType}
          </div>
        )}
        {activeEvent.host && (
          <div>
            <b>Host:</b> {activeEvent.host}
          </div>
        )}
        {activeEvent.priority && (
          <div>
            <b>Priority:</b> {activeEvent.priority}
          </div>
        )}
        {activeEvent.sourceTypeName && (
          <div>
            <b>Source:</b> {activeEvent.sourceTypeName}
          </div>
        )}
      </div>
      <div className="events__table__details__tags">
        <p className="events__table__details__subheader">Tags</p>
        <EventsExplorerTableTags eventsState={eventsState} row={activeEvent} />
      </div>
    </div>
  );
};

export default EventsExplorerTableDetails;
