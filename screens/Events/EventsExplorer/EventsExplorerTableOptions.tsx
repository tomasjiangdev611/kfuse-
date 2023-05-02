import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { Check } from 'react-feather';

const DENSITY_OPTIONS = ['Single-line', 'Compact', 'Expanded'];

const EventsExplorerTableOptions = ({
  close,
  setTableEventsSettings,
  tableEventsSettings,
}: {
  close: () => void;
  setTableEventsSettings: any;
  tableEventsSettings: any;
}): ReactElement => {
  return (
    <div className="events__explorer__table__options">
      <div className="events__explorer__table__options__density">
        <div>LIST DENSITY</div>
        {DENSITY_OPTIONS.map((option, index) => {
          return (
            <div
              className={classNames({
                events__explorer__table__options__density__item: true,
                'events__explorer__table__options__density__item-active':
                  option === tableEventsSettings.listDensity,
              })}
              onClick={() => {
                setTableEventsSettings({
                  ...tableEventsSettings,
                  listDensity: option,
                });
                close();
              }}
              key={index}
            >
              <label htmlFor={option}>{option}</label>
              {option === tableEventsSettings.listDensity && (
                <Check size={14} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsExplorerTableOptions;
