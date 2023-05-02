import { Input } from 'components';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';

import { useEventsAutocompleteState, useEventsState } from '../../hooks';

const EventsSearchBar = ({
  eventsState,
}: {
  eventsState: ReturnType<typeof useEventsState>;
}): ReactElement => {
  const {
    focusToggle,
    inputRef,
    onChange,
    onBackspace,
    onFoucs,
    onEnter,
    search,
    tags,
  } = useEventsAutocompleteState(eventsState);

  return (
    <div className="events__header__search-bar" onClick={onFoucs}>
      <div className="events__header__search-bar__container">
        {tags.map((tag, i) => {
          const onRemove = (e) => {
            e.stopPropagation();
            tag.onRemove();
          };
          return (
            <div key={i} className="chip" title={tag.label}>
              <span className="chip__label">{tag.label}</span>
              <button className="chip__button" onClick={onRemove} type="button">
                <X size={12} />
              </button>
            </div>
          );
        })}
        <Input
          className="events__header__search-bar__container__input"
          onBackspace={onBackspace}
          onBlur={focusToggle.off}
          onChange={onChange}
          onEnter={onEnter}
          onFocus={onFoucs}
          ref={inputRef}
          placeholder="Search events"
          type="text"
          value={search}
        />
      </div>
    </div>
  );
};

export default EventsSearchBar;
