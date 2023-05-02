import { usePopoverContext } from 'components';
import React, { ReactElement, useRef, useState } from 'react';

import { EventPageProps } from '../types';

const MAX_TAGS = 8;

const EventsExplorerTableTagsPanel = ({
  onExcludeByTag,
  onFilterByTag,
  tag,
}: {
  onExcludeByTag: (tag: string) => void;
  onFilterByTag: (tag: string) => void;
  tag: string;
}) => {
  return (
    <div className="events__attribute__panel">
      <div
        className="events__attribute__panel__item"
        onClick={() => onFilterByTag(tag)}
      >
        Filter by {tag}
      </div>
      <div
        className="events__attribute__panel__item"
        onClick={() => onExcludeByTag(tag)}
      >
        Exclude {tag}
      </div>
    </div>
  );
};

const TagText = ({
  onTagClick,
  tag,
}: {
  onTagClick: (tag: string, tagRef: any) => void;
  tag: string;
}) => {
  const tagRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="chip chip--blue events__table__message__labels__chip"
      onClick={(e) => {
        e.stopPropagation();
        onTagClick(tag, tagRef);
      }}
      ref={tagRef}
    >
      {tag}
    </div>
  );
};

const EventsExplorerTableTags = ({
  maxTags = MAX_TAGS,
  row,
  eventsState,
}: { maxTags?: number; row: any } & EventPageProps): ReactElement => {
  const popover = usePopoverContext();
  const [showAll, setShowAll] = useState(false);
  const { labels } = row;
  const valuesLength = labels.length;
  const trimmerdLabels =
    valuesLength > maxTags ? labels.slice(0, maxTags) : labels;
  const leftLabels =
    valuesLength > maxTags ? labels.slice(maxTags, valuesLength) : [];

  const onExcludeByTag = (tag: string) => {
    const { selectedFacetValuesByNameState } = eventsState;
    const [name, value] = tag.split(':');
    selectedFacetValuesByNameState.excludeFacetValue({ name, value });
    popover.close();
  };

  const onFilterByTag = (tag: string) => {
    const { selectedFacetValuesByNameState } = eventsState;
    const [name, value] = tag.split(':');
    selectedFacetValuesByNameState.selectOnlyFacetValue({ name, value });
    popover.close();
  };

  const onTagClick = (tag: string, tagRef: any) => {
    popover.open({
      component: EventsExplorerTableTagsPanel,
      element: tagRef.current,
      props: { tag, onExcludeByTag, onFilterByTag },
      width: 400,
    });
  };

  return (
    <div>
      {trimmerdLabels.map((label: any, index: number) => {
        return (
          <TagText
            key={index}
            onTagClick={onTagClick}
            tag={`${label.name}:${label.value}`}
          />
        );
      })}
      {showAll &&
        leftLabels.map((label: any, index: number) => {
          return (
            <TagText
              key={index}
              onTagClick={onTagClick}
              tag={`${label.name}:${label.value}`}
            />
          );
        })}
      {valuesLength > maxTags && (
        <div
          key={`${valuesLength - maxTags} more`}
          className="chip chip--blue"
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(!showAll);
          }}
        >
          {showAll ? 'Show less' : `${valuesLength - maxTags} more`}
        </div>
      )}
    </div>
  );
};

export default EventsExplorerTableTags;
