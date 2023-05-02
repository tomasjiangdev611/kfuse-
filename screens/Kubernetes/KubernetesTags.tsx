import { usePopoverContext } from 'components';
import React, { ReactElement, useState, useRef } from 'react';
import { EventPageProps } from 'screens/Events/types';
import { useKubesState } from './hooks';

const MAX_TAGS = 8;

const KuberneteTags = ({
  onExcludeByTag,
  onFilterByTag,
  onReplaceFilterByTag,
  onCopyToClipboard,
  tag,
}: {
  onExcludeByTag: (tag: string) => void;
  onFilterByTag: (tag: string) => void;
  onReplaceFilterByTag: (tag: string) => void;
  onCopyToClipboard: (tag: string) => void;
  tag: string;
}) => {
  return (
    <div className="kubernetes__attribute__dropdown__panel">
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onFilterByTag(tag)}
      >
        Filter by {tag}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onExcludeByTag(tag)}
      >
        Exclude {tag}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onReplaceFilterByTag(tag)}
      >
        Replace filter with {tag}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onCopyToClipboard(tag)}
      >
        Copy to Clipboard
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
      className="chip chip--blue kubernetes__table__message__labels__chip"
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

const KubernatesTags = ({
  row,
  kubeState,
  close,
}: {
  row: any;
  close: any;
  kubeState: ReturnType<typeof useKubesState>;
} & EventPageProps): ReactElement => {
  const popover = usePopoverContext();
  const [showAll, setShowAll] = useState(false);
  const { tags } = row;
  const { setFilterByFacets } = kubeState;
  const tagsLength = tags.length;
  const trimmerdLabels = tagsLength > MAX_TAGS ? tags.slice(0, MAX_TAGS) : tags;
  const leftLabels =
    tagsLength > MAX_TAGS ? tags.slice(MAX_TAGS, tagsLength) : [];

  const onFilterByTag = (tag: string) => {
    const queryStr = tag.replace(':', '=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${queryStr}`]: true,
      };
    });
    close();
    popover.close();
  };

  const onExcludeByTag = (tag: string) => {
    const queryStr = tag.replace(':', '!=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${queryStr}`]: true,
      };
    });
    close();
    popover.close();
  };
  const onReplaceFilterByTag = (tag: string) => {
    const queryStr = tag.replace(':', '=');
    setFilterByFacets(() => {
      return {
        [`${queryStr}`]: true,
      };
    });
    close();
    popover.close();
  };

  const onCopyToClipboard = (tag: string) => {
    navigator.clipboard.writeText(tag);
    popover.close();
  };

  const onTagClick = (tag: string, tagRef: any) => {
    popover.open({
      component: KuberneteTags,
      element: tagRef.current,
      props: {
        tag,
        onExcludeByTag,
        onFilterByTag,
        onReplaceFilterByTag,
        onCopyToClipboard,
      },
      width: 400,
    });
  };

  return (
    <div className="kubernetes__table__message__labels__chip">
      {trimmerdLabels.map((label: any, index: number) => {
        return <TagText key={index} onTagClick={onTagClick} tag={`${label}`} />;
      })}
      {showAll &&
        leftLabels.map((label: any, index: number) => {
          return (
            <TagText key={index} onTagClick={onTagClick} tag={`${label}`} />
          );
        })}
      {tagsLength > MAX_TAGS && (
        <div
          key={`${tagsLength - MAX_TAGS} more`}
          className="chip chip--blue"
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(!showAll);
          }}
        >
          {showAll ? 'Show less' : `${tagsLength - MAX_TAGS} more`}
        </div>
      )}
    </div>
  );
};

export default KubernatesTags;
